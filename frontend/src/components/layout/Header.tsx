import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MenuIcon from '@mui/icons-material/Menu';
import CircleIcon from '@mui/icons-material/Circle';

import { useAppStore } from '@/store/useAppStore';
import { DRAWER_WIDTH } from './Sidebar';

function Header() {
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const wsConnected = useAppStore((s) => s.wsConnected);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
        bgcolor: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: 'none',
        zIndex: 1200,
      }}
    >
      <Toolbar sx={{ minHeight: 72, px: { xs: 2, md: 3 } }}>
        <IconButton
          edge="start"
          onClick={toggleSidebar}
          sx={{
            mr: 2,
            display: { md: 'none' },
            color: 'rgba(255,255,255,0.8)',
            bgcolor: 'rgba(255,255,255,0.06)',
            borderRadius: 2,
            '&:hover': { bgcolor: 'rgba(167,139,250,0.15)' },
          }}
          aria-label="Open navigation menu"
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Chip
            icon={
              <CircleIcon
                sx={{
                  fontSize: 8,
                  color: wsConnected ? '#10B981' : '#EF4444',
                  '&.MuiChip-icon': { ml: '8px' },
                }}
              />
            }
            label={wsConnected ? 'Connected' : 'Disconnected'}
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: 12,
              bgcolor: wsConnected ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)',
              color: wsConnected ? '#34D399' : '#F87171',
              border: `1px solid ${wsConnected ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
              backdropFilter: 'blur(8px)',
              height: 28,
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
