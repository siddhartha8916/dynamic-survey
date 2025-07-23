import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Navigation from '../components/Navigation';

const EditSurvey: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Navigation title="Edit Survey" showBackButton />
      
      <Container maxWidth="xl" sx={{ pt: 12, pb: 4 }}>
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 4 }}>
          Edit Survey
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          This page will be implemented next...
        </Typography>
      </Container>
    </Box>
  );
};

export default EditSurvey;