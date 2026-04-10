import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import SendIcon from '@mui/icons-material/Send';
import DescriptionIcon from '@mui/icons-material/Description';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import SmartToyIcon from '@mui/icons-material/SmartToy';

import { useAppStore } from '@/store/useAppStore';

export const DRAWER_WIDTH = 260;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactElement;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Job Search', path: '/jobs', icon: <WorkIcon /> },
  { label: 'Applications', path: '/applications', icon: <SendIcon /> },
  { label: 'Resumes', path: '/resumes', icon: <DescriptionIcon /> },
  { label: 'Analytics', path: '/analytics', icon: <BarChartIcon /> },
  { label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        background: 'linear-gradient(180deg, #2D1B69 0%, #1E1040 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo area */}
      <Toolbar sx={{ px: 3, py: 2.5, minHeight: 72 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #A78BFA, #7C3AED)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 1.5,
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(167,139,250,0.4)',
          }}
        >
          <SmartToyIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Box>
          <Typography
            variant="subtitle1"
            noWrap
            sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.2, fontSize: 15 }}
          >
            Sanzy Job Finder
          </Typography>
          <Typography sx={{ color: 'rgba(167,139,250,0.7)', fontSize: 10, letterSpacing: '0.08em' }}>
            AI-Powered
          </Typography>
        </Box>
      </Toolbar>

      <Divider sx={{ borderColor: 'rgba(167,139,250,0.15)', mx: 2 }} />

      <List sx={{ px: 1.5, pt: 2, flexGrow: 1 }}>
        {NAV_ITEMS.map((item) => {
          const selected = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={selected}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  color: selected ? '#fff' : 'rgba(196,181,253,0.7)',
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.9), rgba(91,33,182,0.9))',
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(124,58,237,0.35)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(109,40,217,0.95), rgba(76,29,149,0.95))',
                    },
                    '& .MuiListItemIcon-root': { color: '#fff' },
                  },
                  '&:hover': {
                    background: 'rgba(167,139,250,0.1)',
                    color: '#fff',
                    '& .MuiListItemIcon-root': { color: '#A78BFA' },
                  },
                  '& .MuiListItemIcon-root': {
                    color: selected ? '#fff' : 'rgba(167,139,250,0.6)',
                    minWidth: 40,
                    transition: 'color 0.2s',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: selected ? 600 : 500, fontSize: 14 }}
                />
                {selected && (
                  <Box
                    sx={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      bgcolor: '#A78BFA',
                      ml: 1,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Bottom badge */}
      <Box sx={{ px: 2, pb: 3 }}>
        <Divider sx={{ borderColor: 'rgba(167,139,250,0.15)', mb: 2 }} />
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderRadius: 2,
            background: 'rgba(124,58,237,0.2)',
            border: '1px solid rgba(167,139,250,0.2)',
          }}
        >
          <Typography sx={{ color: 'rgba(196,181,253,0.9)', fontSize: 11, fontWeight: 600 }}>
            AI Automation Active
          </Typography>
          <Typography sx={{ color: 'rgba(167,139,250,0.6)', fontSize: 10, mt: 0.3 }}>
            Pipeline ready
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: 0 }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

export default Sidebar;
