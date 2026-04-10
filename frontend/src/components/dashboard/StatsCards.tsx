import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import WorkIcon from '@mui/icons-material/Work';
import SendIcon from '@mui/icons-material/Send';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';

import type { DashboardStats } from '@/types/analytics';

interface StatsCardsProps {
  stats: DashboardStats | undefined;
  loading?: boolean;
}

interface StatCardItem {
  label: string;
  getValue: (s: DashboardStats) => string;
  icon: React.ReactElement;
  color: string;
}

const STAT_ITEMS: StatCardItem[] = [
  {
    label: 'Jobs Found',
    getValue: (s) => s.total_jobs_found.toLocaleString(),
    icon: <WorkIcon />,
    color: '#7C3AED',
  },
  {
    label: 'Applications',
    getValue: (s) => s.total_applications.toLocaleString(),
    icon: <SendIcon />,
    color: '#A855F7',
  },
  {
    label: 'Interviews',
    getValue: (s) => s.applications_interview.toLocaleString(),
    icon: <TrendingUpIcon />,
    color: '#5B21B6',
  },
  {
    label: 'Avg ATS Score',
    getValue: (s) => `${Math.round(s.avg_ats_score * 100)}%`,
    icon: <StarIcon />,
    color: '#6D28D9',
  },
];

function StatsCards({ stats, loading = false }: StatsCardsProps) {
  return (
    <Grid container spacing={3}>
      {STAT_ITEMS.map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item.label}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {item.label}
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {loading || !stats ? '--' : item.getValue(stats)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: 'rgba(167,139,250,0.15)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(167,139,250,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color,
                  }}
                >
                  {item.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default StatsCards;
