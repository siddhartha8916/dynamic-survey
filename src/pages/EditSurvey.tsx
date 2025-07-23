import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Survey } from '../types';
import { getSurveys, saveSurveys, getSurveyById } from '../utils/storage';

const EditSurvey: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'customer',
    status: 'draft' as Survey['status']
  });

  useEffect(() => {
    if (id) {
      const foundSurvey = getSurveyById(id);
      if (foundSurvey) {
        setSurvey(foundSurvey);
        setFormData({
          title: foundSurvey.title,
          description: foundSurvey.description,
          type: foundSurvey.type || 'customer',
          status: foundSurvey.status
        });
      }
      setLoading(false);
    }
  }, [id]);

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('Please enter a survey title');
      return;
    }

    if (!survey || !id) return;

    const updatedSurvey: Survey = {
      ...survey,
      title: formData.title,
      description: formData.description,
      status: formData.status,
      type: formData.type as Survey['type']
    };

    const surveys = getSurveys();
    const index = surveys.findIndex(s => s.id === id);
    if (index !== -1) {
      surveys[index] = updatedSurvey;
      saveSurveys(surveys);
      navigate(`/survey-details/${id}`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!survey) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Survey not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navigation Header */}
      <AppBar position="fixed" sx={{ bgcolor: 'white', color: 'text.primary' }} elevation={1}>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            Edit Survey
          </Typography>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ mt: 12, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h2" color="primary" gutterBottom>
            Edit Survey Details
          </Typography>

          <TextField
            fullWidth
            label="Survey Title"
            variant="outlined"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 3 }}
          />

          <TextField
            select
            fullWidth
            label="Survey Type"
            variant="outlined"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            sx={{ mb: 3 }}
          >
            <MenuItem value="customer">Customer Feedback</MenuItem>
            <MenuItem value="employee">Employee Satisfaction</MenuItem>
            <MenuItem value="product">Product Feedback</MenuItem>
            <MenuItem value="market">Market Research</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            label="Status"
            variant="outlined"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Survey['status'] })}
            sx={{ mb: 3 }}
          >
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
          </TextField>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate('/')}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              Save Changes
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default EditSurvey;