# AutoApply AI — Product Requirements Document (PRD)

**Version:** 1.0  
**Generated:** 2026-04-02  

## 1. Executive Summary
AutoApply AI is a full-stack platform that automates and manages the modern job application workflow: discover opportunities, tailor resumes, track applications, review analytics, and orchestrate browser-based automation from a single workspace.

The system combines:
- Multi-platform job discovery (LinkedIn/Indeed/Glassdoor + Exa semantic search fallback)
- ATS resume scoring (multi-factor)
- LLM-powered resume tailoring + ATS optimization
- Document rendering (PDF/DOCX) from templates
- Application tracking with a status lifecycle and human approval modes
- A Redis-backed background worker pipeline for end-to-end automation
- Real-time progress delivery via WebSocket

## 2. Goals and Non-Goals

### 2.1 Goals
1. Provide a single UI to search jobs, create applications, track statuses, and review analytics.
2. Generate ATS-optimized documents (tailored resumes and cover letters) using LLMs while preserving factual accuracy.
3. Score candidate-job fit using a weighted ATS engine (skills, keywords, experience, education).
4. Support configurable application submission modes:
   - `review`: human approval before enqueueing/automation
   - `autonomous`: enqueue immediately for automated submission
   - `batch`: create batch items for bulk approval
5. Orchestrate a background apply pipeline via Redis queues and update application records and the UI.
6. Track LLM usage, cost, and latency for transparency and optimization.

### 2.2 Non-Goals (Phase-In)
1. Perfect job board scraping at all times (platform UIs change; the system is resilient and supports fallbacks).
2. Guaranteeing successful “Easy Apply” submissions without credentials and platform compliance.
3. Building a full customer identity/permissions system (current setup assumes a single-user settings row).

## 3. Target Users and Personas
1. Job seekers who want to apply faster with quality control (approval workflow).
2. Users who upload resumes and want ATS-aligned tailoring for specific job descriptions.
3. Users who want visibility into application funnel and LLM costs.
4. Power users who enable autonomous mode and want hands-off automation.

## 4. System Context

### 4.1 User-Facing Interfaces
1. Web UI (React + MUI + Vite) with pages:
   - Dashboard
   - Job Search
   - Applications
   - Resumes
   - Analytics
   - Settings

### 4.2 Backend Interfaces
1. REST API under `/api/v1` for jobs/applications/resumes/analytics/settings.
2. WebSocket endpoint `/ws` for real-time progress updates (application progress, queue updates, etc.).
3. Health endpoint `/health`.
4. Metrics endpoint `/metrics` (enabled in non-production).

## 5. End-to-End Workflows (Sorted Order)

### 5.1 Configure AutoApply Settings
1. User opens `Settings` page.
2. User sets:
   - `apply_mode` (`autonomous`, `review`, `batch`)
   - `min_ats_score` threshold (0..1)
   - `max_parallel` browser sessions
   - enabled platforms: `linkedin`, `indeed`, `glassdoor`
   - LLM provider preference (and provider API keys)
   - candidate profile fields (full name, contact, skills, experience, education, certifications)
3. Backend persists settings into the singleton `user_settings` row.

### 5.2 Upload Resume
1. User uploads a resume PDF/DOCX via `POST /api/v1/resumes/upload`.
2. Backend:
   - Saves uploaded file to `data/uploads`
   - Parses the resume (PDF/DOCX) to extract text, sections, contact info, skills
   - Stores resume record in `resumes` table with `content_text` (truncated to a fixed max in service)
3. Frontend shows skills detected and the resume entry in the `Resumes` page.

### 5.3 Search Jobs
1. User enters a job query and optional location and platform filters on `Job Search` page.
2. Frontend calls `POST /api/v1/jobs/search` with:
   - `query`, `location`, `platforms`, `filters`, `limit`
3. Backend attempts live platform searches via browser automation plugins.
4. If live scraping returns nothing (or if dependencies are unavailable), the service can generate deterministic fallback listings (dev/local reliability).
5. Backend stores discovered jobs in the `jobs` table and returns a paginated `JobListResponse`.
6. Frontend renders jobs as cards with optional details and an “Apply” action.

### 5.4 (Optional) Analyze Job vs Candidate
1. User can trigger job analysis (ATS match analysis) via `POST /api/v1/jobs/{id}/analyze`.
2. Backend runs ATS scoring:
   - If `resume_id` is not provided, returns placeholder scores with suggestions.
   - If spaCy model is unavailable, falls back to a keyword overlap approach.
3. Frontend shows match scores and suggestions.

### 5.5 Create Application
1. User selects job(s) and clicks “Apply” from Job Search or Job Detail.
2. Frontend creates an application via:
   - `POST /api/v1/applications/` for single
   - `POST /api/v1/applications/batch` for batch
3. Backend writes application with initial status:
   - Current code: `queued` (regardless of apply_mode)
4. Frontend displays the application card in `Applications` page.

### 5.6 Approval / Enqueueing (Apply Modes)
1. `review` mode:
   - Expected behavior: application created as `pending_review`, user must approve
   - Current implementation: creation uses `queued`; approval changes status to `approved`
2. `autonomous` mode:
   - Expected behavior: enqueue immediately
   - Current implementation: enqueue wiring is not present in the approval/create path
3. `batch` mode:
   - Expected behavior: create queued items and allow “Approve All”
   - Current implementation: bulk approval UI exists but automation pipeline wiring is not complete

### 5.7 Worker Pipeline (Automation Execution)
1. A background worker should consume tasks from Redis queue `autoapply:queue:apply`.
2. Pipeline steps implemented in `application_worker.py`:
   - load job from DB
   - broadcast progress via WebSocket
   - generate tailored resume + cover letter (via DocumentGenerator and resume services)
   - run ATS scoring against job and compare vs `min_ats_score`
   - if score is below threshold: mark application `failed` with notes
   - apply via platform plugin `apply()` using browser automation
   - update application status to `applied`, store timestamps and ATS score

### 5.8 Update Application Status
1. Users can update status manually via:
   - `PUT /api/v1/applications/{app_id}/approve`
   - `PUT /api/v1/applications/{app_id}/status` with notes (e.g., set to `applied`, `interview`, etc.)
2. If worker is functioning, it should update status automatically during the pipeline.

### 5.9 Analytics and Reporting
1. Dashboard calls:
   - `/api/v1/analytics/dashboard`
   - `/api/v1/analytics/funnel`
   - recent application list
2. Analytics page calls:
   - `/api/v1/analytics/ats-scores`
   - `/api/v1/analytics/llm-usage`
   - `/api/v1/analytics/timeline`
3. Backend aggregates from `jobs`, `applications`, and `llm_usage`.

## 6. Functional Requirements by Module

### 6.1 Job Discovery Module
Input:
- `query`, `location`, `platforms`, `filters`, `limit`

Output:
- Stored `Job` records and returned `JobListResponse`

Requirements:
1. Provide plugin-based integrations for:
   - `linkedin`, `indeed`, `glassdoor`
2. Support semantic discovery using `exa-py` (ExaJobSearch).
3. Deduplicate jobs by `(platform, platform_job_id)`.
4. Provide reliable dev/local fallback when live scraping is unavailable.

### 6.2 Resume Parsing and Profile Extraction
Input:
- Uploaded resume file (PDF/DOCX)
Output:
- `Resume` record with:
  - `file_path_pdf` / `file_path_docx`
  - `content_text`
  - `content_text` extracted via parser
  - detected skills for quick ATS iteration

Requirements:
1. Parse resume asynchronously; avoid blocking event loop.
2. Fall back when parsing fails (decode text as best-effort).
3. Extract skills using spaCy-backed matcher, with regex-only fallback.

### 6.3 Resume Tailoring (LLM + Templates)
Input:
- base resume text and job description
- template selection
Output:
- generated tailored resume PDF/DOCX files and DB record

Requirements:
1. Use structured output schema for LLM tailoring to ensure template compatibility.
2. Never fabricate factual experience/skills/credentials (prompt rules).
3. Render to PDF via WeasyPrint and DOCX via python-docx.

### 6.4 ATS Scoring (Multi-Factor Engine)
Input:
- resume content text
- job description and extracted job metadata (skills required/preferred)
Output:
- overall ATS score + breakdown (skills/experience/education/keywords)
Requirements:
1. Weighted composite score:
   - skills 0.4
   - experience 0.3
   - education 0.2
   - keywords 0.1
2. Provide improvement suggestions:
   - missing required skills
   - low keyword alignment suggestions
   - experience/education improvement tips
3. Provide deterministic fallback when spaCy or model isn’t available.

### 6.5 ATS Optimization (LLM Rewriting)
Input:
- ATS score details + resume text + job description
Output:
- optimized resume record (linked via `base_resume_id`) + rerun scoring

Requirements:
1. Produce prioritized improvement suggestions via `ATSOptimizer`.
2. Rewrite content with LLM using ATS optimization prompt rules.
3. Re-score optimized resume and store `ats_score`.

### 6.6 Cover Letter Generation
Input:
- resume text, job description, optional company info
Output:
- cover letter PDF/DOCX generation (via DocumentGenerator)

Requirements:
1. Select cover letter template style based on job context.
2. Provide LLM generation fallback if no LLM client is available.

### 6.7 Application Lifecycle and Automation
Input:
- create application for a job/resume and chosen apply mode
Output:
- Application status transitions and optional worker automation

Requirements:
1. Maintain status lifecycle:
   - queued → pending_review → approved → applying → applied
   - other terminal states: rejected, offer, withdrawn, failed
2. Approval endpoint must support review mode gating.
3. Worker should update status to applied upon success.
4. Worker should broadcast progress via WebSocket.
5. Queue orchestration must be connected:
   - API/Service layer must enqueue on approval/autonomous/batch.

## 7. Automation Architecture Details

### 7.1 Browser Automation Layer (`core/automation`)
Components:
1. `BrowserAgent`: wrapper around `browser-use` Agent.
2. `SessionManager`: cookie persistence per platform.
3. `JobPlatform` interface:
   - `login`, `search`, `scrape_details`, `apply`
4. Platform implementations:
   - `LinkedInPlatform`, `IndeedPlatform`, `GlassdoorPlatform`

Requirements:
1. Session reuse via saved cookies to reduce re-authentication.
2. Extract job listings and details into normalized `JobListing`.
3. Submit application via platform-specific action flows.

### 7.2 LLM Layer (`core/llm`)
Components:
1. `LLMClient`: unified async client around LiteLLM with provider fallback chain.
2. Structured output support (`complete_with_structured_output`) with enforced JSON.
3. Metrics recording:
   - requests count
   - latency
   - tokens
   - cost (USD)

Requirements:
1. Provider fallback order:
   - preferred model/provider
   - configured fallbacks
2. Prompt rules forbid fabrication of factual content.

### 7.3 Document Engine (`core/documents`)
Components:
1. `DocumentParser`: parse resume PDF/DOCX into extracted text + sections.
2. `DocumentGenerator`:
   - optional LLM tailoring
   - parallel rendering to PDF and DOCX
3. Renderers:
   - `PDFRenderer` (WeasyPrint + Jinja2)
   - `DOCXRenderer` (python-docx)

Requirements:
1. Preserve ATS-friendly formatting via templates.
2. Parallelize render jobs for performance.

## 8. Data Model Requirements (SQLAlchemy Models)

### 8.1 `Job`
Table: `jobs`
- `id`: UUID PK (string hex, generated)
- `platform`: platform identifier (linkedin/indeed/glassdoor)
- `platform_job_id`: platform-specific job ID
- `title`: job title
- `company`: company name
- `location`: location string (default "")
- `url`: job URL
- `description`: job description text
- `salary_range`: optional
- `job_type`: optional
- `remote`: bool (default false)
- `posted_date`: optional datetime
- `experience_level`: optional string
- `match_score`: optional float
- `skills_required`: optional JSON (dict or structure)
- `status`: job status string (default "new")
- Relationships:
  - `applications`: cascade delete-orphan

Constraints/Indexes:
- Unique constraint `(platform, platform_job_id)` (`uq_job_platform_id`)
- Indexes:
  - `ix_job_status` on `status`
  - `ix_job_match_score` on `match_score`

### 8.2 `Application`
Table: `applications`
- `id`: UUID PK
- `job_id`: FK → `jobs.id` (CASCADE)
- `resume_id`: FK → `resumes.id` (SET NULL)
- `status`: default `"queued"`
- `apply_mode`: default `"review"`
- `ats_score`: optional float
- `cover_letter_path`: optional
- `applied_at`: optional datetime
- `response_date`: optional datetime
- `notes`: optional text
- `browser_screenshots`: optional JSON list
- Relationships:
  - `job` back-populates jobs
  - `resume` back-populates resumes

Constraints/Indexes:
- Indexes:
  - `ix_application_status` on `status`
  - `ix_application_job_id` on `job_id`

### 8.3 `Resume`
Table: `resumes`
- `id`: UUID PK
- `name`: user-friendly name
- `type`: base/tailored/optimized (default "base")
- `base_resume_id`: optional FK → `resumes.id`
- `job_id`: optional FK → `jobs.id` (tailored resumes link to a job)
- `template_id`: resume template style (default "modern")
- `file_path_pdf`: optional
- `file_path_docx`: optional
- `ats_score`: optional float
- `content_text`: optional extracted text
- Relationships:
  - `base_resume` / `tailored_versions`
  - `applications`

Constraints/Indexes:
- Index:
  - `ix_resume_type` on `type`

### 8.4 `LLMUsage`
Table: `llm_usage`
- `id`: UUID PK
- `provider`, `model`
- token usage:
  - `prompt_tokens`, `completion_tokens`, `total_tokens`
- `cost_usd`
- `latency_ms`
- `purpose`: string label (resume_tailor/cover_letter/ats_optimize/job_analysis)
- `trace_id`: optional

### 8.5 `UserSettings`
Table: `user_settings`
- Singleton row:
  - `id`: `"singleton"` as PK
  - constraint `ck_user_settings_singleton` ensures single-row behavior
- apply behavior:
  - `apply_mode` (review/autonomous/batch)
  - `max_parallel`
  - `min_ats_score`
- LLM preference:
  - `preferred_provider`
- platform config:
  - `platforms_enabled`: JSON list
- candidate profile:
  - `candidate_profile`: JSON

## 9. Schema and API Contract Requirements

### 9.1 Jobs API
- `POST /api/v1/jobs/search`
  - Request: `query`, `location`, `platforms`, `filters`, `limit`
  - Response: `JobListResponse { items, total, page, page_size, has_next }`
- `GET /api/v1/jobs/` list jobs with pagination and optional status filter
- `GET /api/v1/jobs/{job_id}` get job details
- `POST /api/v1/jobs/{job_id}/analyze` ATS match analysis
- `DELETE /api/v1/jobs/{job_id}` delete job

### 9.2 Applications API
- `POST /api/v1/applications/` create application
- `POST /api/v1/applications/batch` batch create
- `GET /api/v1/applications/` list with status filter
- `GET /api/v1/applications/{app_id}` get single application
- `PUT /api/v1/applications/{app_id}/approve` approve pending for submission
- `PUT /api/v1/applications/{app_id}/status` update status (+ optional notes)

### 9.3 Resumes API
- `POST /api/v1/resumes/upload` upload resume PDF/DOCX
- `GET /api/v1/resumes/` list resumes
- `POST /api/v1/resumes/generate` generate tailored resume
- `POST /api/v1/resumes/{resume_id}/score` score resume vs job
- `POST /api/v1/resumes/{resume_id}/optimize` ATS optimization (LLM rewrite)
- `GET /api/v1/resumes/{resume_id}/download?format=pdf|docx`
- `GET /api/v1/resumes/{resume_id}/profile-data` extract candidate profile for editor

### 9.4 Analytics API
- `GET /api/v1/analytics/dashboard`
- `GET /api/v1/analytics/funnel`
- `GET /api/v1/analytics/ats-scores`
- `GET /api/v1/analytics/llm-usage`
- `GET /api/v1/analytics/timeline`

### 9.5 Settings API
- `GET /api/v1/settings`
- `PUT /api/v1/settings`
- `GET /api/v1/settings/llm-providers` provider status (configured vs not)

## 10. Observability and Metrics Requirements
The backend uses:
1. Structlog for structured JSON logs
2. Prometheus metrics (non-production)
3. LLM usage/cost tracking:
   - record each LLM call in `llm_usage`
4. WebSocket broadcasting for progress updates

## 11. Security, Privacy, and Responsible Use
1. Review AI-generated materials before submission.
2. Respect platform terms, rate limits, and automation policies.
3. Protect stored credentials and personal profile data.
4. Keep a human approval step in the loop unless there’s a strong reason not to.

## 12. Current Implementation Notes (What Works vs What’s In-Progress)
From repository documentation:

### 12.1 Working
1. FastAPI backend with versioned API routes and OpenAPI docs
2. React + MUI dashboard with jobs, applications, resumes, analytics, and settings pages
3. Application tracking CRUD with approval flow and status lifecycle
4. Resume upload with real parsing, skill extraction, and ATS scoring
5. Multi-factor ATS scoring engine
6. Analytics endpoints (dashboard stats, funnel, ATS distribution, LLM usage, timeline)
7. Redis worker scaffolding and WebSocket progress events
8. LLM client with provider fallback chain and Prometheus metrics
9. Exa AI semantic job search integration
10. Dockerized local environment (backend, frontend, worker, Redis)
11. 30+ unit/integration tests

### 12.2 In Progress
1. Live platform search execution (LinkedIn, Indeed, Glassdoor scrapers)
2. Fully automated browser-based application submission
3. LLM-powered resume generation and cover letter pipeline
4. Persistent settings and provider health checks

### 12.3 Known Gap for End-to-End Automation (Queue Wiring)
The worker pipeline exists, but the API/service approval path must enqueue tasks into Redis for autonomous/batch workflows. Without enqueue wiring, applications remain in `approved` and do not progress to `applying`/`applied`.

## 13. Ideas and Roadmap (Ordered by Product Stages)

This section consolidates explicit roadmap “ideas” from:
- `ARCHITECTURE.md` migration plan phases
- `docs/INTEGRATION_PLAN.md` improvement checklists and timeline
- `docs/TOOLS.md` development/testing and dependency guidance
- `CLAUDE.md` project conventions

### 13.1 Migration Plan (from `ARCHITECTURE.md`)
Phase 1: Foundation (Backend skeleton + cleanup)
1. Delete obsolete files from current codebase
2. Create new `backend/` directory structure
3. Set up FastAPI app factory with config
4. Migrate SQLAlchemy models (async)
5. Set up Redis connection
6. Implement health check endpoint

Phase 2: Core Modules
1. Port ATS scorer to `core/ats/`
2. Port document parser to `core/documents/`
3. Implement LiteLLM + Portkey client in `core/llm/`
4. Port FAISS vector store to `core/matching/`
5. Build platform plugin system in `core/automation/`

Phase 3: API + Services
1. Build all API routes with Pydantic schemas
2. Implement service layer orchestration
3. Set up Redis queue + workers
4. Add WebSocket events

Phase 4: Browser Automation
1. Implement browser-use Agent wrapper
2. Build LinkedIn platform plugin
3. Build Indeed platform plugin
4. Build Glassdoor platform plugin
5. Implement session management

Phase 5: Document Generation
1. Create 5 HTML/CSS resume templates
2. Implement WeasyPrint PDF renderer
3. Implement DOCX renderer
4. Build cover letter templates

Phase 6: Frontend
1. React + Vite + MUI project setup
2. Dashboard page
3. Job search page
4. Applications page
5. Resume management page
6. Settings page
7. WebSocket integration

Phase 7: Observability + Deployment
1. Structlog configuration
2. Prometheus metrics
3. Docker compose setup
4. Cloud deployment config

### 13.2 Integration Improvement Ideas (from `docs/INTEGRATION_PLAN.md`)
## 1. LinkedIn Integration
### Current Implementation
- Basic LinkedIn API interaction
- Authentication handling
- Job search functionality

### Improvements Needed
1.1 OAuth2 Implementation
- [ ] Replace basic auth with OAuth2
- [ ] Implement token refresh mechanism
- [ ] Add proper scopes for required permissions
- [ ] Store tokens securely

1.2 Rate Limiting and Retry Logic
- [ ] Implement exponential backoff for rate limits
- [ ] Add request throttling
- [ ] Handle API quotas
- [ ] Implement circuit breaker pattern

1.3 Error Handling
- [ ] Add comprehensive error types
- [ ] Implement retry for transient errors
- [ ] Add detailed logging
- [ ] Create user-friendly error messages

1.4 Features to Add
- [ ] Profile data extraction
- [ ] Connection management
- [ ] Message automation
- [ ] Job application tracking

## 2. Resume Optimization (`resume_optimizer.py`)
### Current Implementation
- Basic resume parsing
- Simple keyword matching

### Improvements Needed
2.1 ATS Compatibility
- [ ] Implement ATS scoring system
- [ ] Add format validation
- [ ] Check for ATS-friendly formatting
- [ ] Add score explanation

2.2 Skill Gap Analysis
- [ ] Parse job descriptions
- [ ] Compare with resume skills
- [ ] Identify missing skills
- [ ] Suggest improvements

2.3 Content Optimization
- [ ] Action verb analysis
- [ ] Quantifiable achievements
- [ ] Keyword optimization
- [ ] Readability scoring

## 3. Application Tracking (`application_tracker.py`)
### Current Implementation
- Basic application storage
- Status tracking

### Improvements Needed
3.1 Database Schema
- [ ] Normalize data structure
- [ ] Add indexes for common queries
- [ ] Implement soft deletes
- [ ] Add audit logging

3.2 Search and Filtering
- [ ] Advanced search functionality
- [ ] Custom filters
- [ ] Saved searches
- [ ] Tagging system

3.3 Reporting
- [ ] Application statistics
- [ ] Success rate analysis
- [ ] Time-based metrics
- [ ] Export functionality

## 4. Browser Automation (`browser_automation.py`)
### Current Implementation
- Basic browser control
- Form filling
- Navigation

### Improvements Needed
4.1 Page Object Model
- [ ] Create base page class
- [ ] Implement page objects for common sites
- [ ] Add element locators
- [ ] Implement page transitions

4.2 Multi-site Support
- [ ] Abstract site-specific logic
- [ ] Create site adapters
- [ ] Implement site detection
- [ ] Handle site-specific edge cases

4.3 Error Recovery
- [ ] Implement recovery procedures
- [ ] Add session management
- [ ] Handle CAPTCHAs
- [ ] Add visual verification

### Implementation Timeline
Phase 1: Core Improvements (2 weeks)
- [ ] Implement OAuth2 for LinkedIn
- [ ] Add rate limiting and retry logic
- [ ] Improve error handling
- [ ] Set up test infrastructure

Phase 2: Feature Enhancements (3 weeks)
- [ ] Implement ATS scoring
- [ ] Add skill gap analysis
- [ ] Improve application tracking
- [ ] Add browser automation features

Phase 3: Polish and Optimization (2 weeks)
- [ ] Performance optimization
- [ ] Add comprehensive tests
- [ ] Update documentation
- [ ] User acceptance testing

### Dependencies (from `docs/INTEGRATION_PLAN.md`)
External Services
- LinkedIn API
- OpenAI/GPT for content generation
- ATS database (if applicable)

Internal Dependencies
- Database schema updates
- Configuration management
- Logging infrastructure

### Risks and Mitigation (from `docs/INTEGRATION_PLAN.md`)
| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| API Rate Limiting | High | High | Implement backoff and retry |
| Browser Changes | High | Medium | Regular maintenance |
| Data Loss | Critical | Low | Regular backups |
| Security Issues | Critical | Low | Regular security audits |

### Success Metrics (from `docs/INTEGRATION_PLAN.md`)
- 95%+ test coverage
- < 1% error rate in production
- Sub-100ms response time for 95% of requests
- 99.9% uptime

## 14. Acceptance Criteria for MVP Completion
1. User can:
   - upload resume
   - search jobs and get non-empty results
   - create applications
   - approve applications
2. Worker pipeline is enqueued for:
   - autonomous mode (immediate enqueue)
   - review/batch modes (enqueue upon approval)
3. Worker can progress statuses from:
   - approved → applying → applied (at least in mocked/dev mode)
4. Analytics pages populate:
   - dashboard stats
   - funnel counts
   - ATS score distribution
   - LLM usage stats
   - timeline
5. Document generation produces valid PDF/DOCX files.

## 15. Appendix: Core Queue/Status/Template Constants
- Redis queues:
  - `autoapply:queue:apply` (application submissions)
  - `autoapply:queue:scrape`
  - `autoapply:queue:generate`
- Application status values:
  - queued, pending_review, approved, applying, applied, interview, rejected, offer, withdrawn, failed
- Job status values:
  - new, saved, applied, hidden
- Resume templates:
  - modern, classic, creative, executive, minimal
- Cover letter templates:
  - standard, technical, creative

