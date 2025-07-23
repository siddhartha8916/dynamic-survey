import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, Box, IconButton } from '@mui/material';
import { ArrowBack, ExpandMore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface NavigationProps {
  title?: string;
  showBackButton?: boolean;
  subtitle?: string;
}

const Navigation: React.FC<NavigationProps> = ({ 
  title = 'Dashboard', 
  showBackButton = false,
  subtitle
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: 'white', 
        color: 'text.primary',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e5e7eb'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {showBackButton && (
            <IconButton
              onClick={handleBack}
              sx={{ mr: 2, color: 'text.secondary' }}
            >
              <ArrowBack />
            </IconButton>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/cosa-logo.png" 
              alt="Logo" 
              style={{ height: '48px', marginRight: '16px' }} 
            />
            <Box>
              <Typography variant="h6" component="div" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar 
            sx={{ 
              width: 36, 
              height: 36, 
              backgroundColor: 'primary.main',
              border: '2px solid',
              borderColor: 'primary.main'
            }}
          >
            SJ
          </Avatar>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
              Sarah Johnson
            </Typography>
          </Box>
          <ExpandMore sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;