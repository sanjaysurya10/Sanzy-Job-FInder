import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import type { ApplicationFunnelData } from '@/types/analytics';

interface ApplicationFunnelProps {
  data: ApplicationFunnelData[] | undefined;
  loading?: boolean;
}

const EMPTY_FUNNEL: ApplicationFunnelData[] = [
  { stage: 'Pending', count: 0 },
  { stage: 'Approved', count: 0 },
  { stage: 'Applied', count: 0 },
  { stage: 'Interview', count: 0 },
  { stage: 'Offer', count: 0 },
];

function ApplicationFunnel({ data, loading = false }: ApplicationFunnelProps) {
  const chartData = data && data.length > 0 ? data : EMPTY_FUNNEL;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Application Funnel
        </Typography>

        {loading ? (
          <Box
            sx={{
              height: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography color="text.secondary">Loading chart data...</Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="stage" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.55)' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.55)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  background: 'rgba(15,10,40,0.85)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(167,139,250,0.3)',
                  color: '#fff',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}
                labelStyle={{ color: '#C4B5FD', fontWeight: 600 }}
                cursor={{ fill: 'rgba(167,139,250,0.06)' }}
              />
              <Bar dataKey="count" fill="url(#barGrad)" radius={[6, 6, 0, 0]} maxBarSize={60}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#5B21B6" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default ApplicationFunnel;
