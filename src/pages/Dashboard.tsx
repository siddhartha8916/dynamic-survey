import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Paper,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  BarChart as BarChartIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Edit as EditIcon,
  ContentCopy as ContentCopyIcon,
  Delete as DeleteIcon,
  HelpOutline as HelpOutlineIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Survey, SurveyFormData, DashboardStats } from '../types';
import { getSurveys, saveSurveys, deleteSurvey, duplicateSurvey } from '../utils/storage';
import { calculateDashboardStats, formatDate, capitalize } from '../utils/helpers';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalSurveys: 0,
    activeSurveys: 0,
    totalResponses: 0,
    completionRate: 0
  });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState<SurveyFormData>({
    title: '',
    description: '',
    type: 'customer'
  });

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = () => {
    const loadedSurveys = getSurveys();
    setSurveys(loadedSurveys);
    setStats(calculateDashboardStats(loadedSurveys));
  };

  const handleCreateSurvey = () => {
    if (!formData.title.trim()) {
      alert('Please enter a survey title');
      return;
    }

    const newSurveyId = Date.now().toString();
    navigate(`/create-questions?id=${newSurveyId}&title=${encodeURIComponent(formData.title)}&description=${encodeURIComponent(formData.description)}`);
    setCreateModalOpen(false);
    setFormData({ title: '', description: '', type: 'customer' });
  };

  const handleEdit = (surveyId: string) => {
    navigate(`/edit-survey/${surveyId}`);
  };

  const handleView = (surveyId: string) => {
    navigate(`/survey-details/${surveyId}`);
  };

  const handleDuplicate = (surveyId: string) => {
    duplicateSurvey(surveyId);
    loadSurveys();
  };

  const handleDelete = (surveyId: string) => {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      deleteSurvey(surveyId);
      loadSurveys();
    }
  };

  const getStatusColor = (status: Survey['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'closed': return 'default';
      default: return 'primary';
    }
  };

  const getIconForSurvey = (title: string) => {
    if (title.toLowerCase().includes('employee')) {
      return <BarChartIcon />;
    } else if (title.toLowerCase().includes('product')) {
      return <AssessmentIcon />;
    }
    return <ChatBubbleOutlineIcon />;
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navigation Header */}
      <AppBar position="fixed" sx={{ bgcolor: 'white', color: 'text.primary' }} elevation={1}>
        <Toolbar>
          <Box component="img" src="/cosa-logo.png" alt="Logo" sx={{ height: 48, mr: 2 }} />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{ width: 36, height: 36, mr: 1, bgcolor: 'primary.main' }}
              src="https://placehold.co/40x40/2B4652/FFFFFF?text=SJ"
            >
              SJ
            </Avatar>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Sarah Johnson
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
        {/* Dashboard Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" color="primary" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, Sarah! Here's an overview of your surveys.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      Total Surveys
                    </Typography>
                    <Typography variant="h4" component="h2" color="primary">
                      {stats.totalSurveys}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5, bgcolor: 'primary.light', borderRadius: 2 }}>
                    <BarChartIcon sx={{ color: 'primary.main' }} />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                  <Typography variant="caption" color="success.main">
                    12% vs last month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      Active Surveys
                    </Typography>
                    <Typography variant="h4" component="h2" color="primary">
                      {stats.activeSurveys}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5, bgcolor: 'success.light', borderRadius: 2 }}>
                    <CheckCircleIcon sx={{ color: 'success.main' }} />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                  <Typography variant="caption" color="success.main">
                    8% vs last month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      Total Responses
                    </Typography>
                    <Typography variant="h4" component="h2" color="primary">
                      {stats.totalResponses.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5, bgcolor: 'info.light', borderRadius: 2 }}>
                    <ChatBubbleOutlineIcon sx={{ color: 'info.main' }} />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                  <Typography variant="caption" color="success.main">
                    24% vs last month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      Completion Rate
                    </Typography>
                    <Typography variant="h4" component="h2" color="primary">
                      {stats.completionRate}%
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5, bgcolor: 'warning.light', borderRadius: 2 }}>
                    <AssessmentIcon sx={{ color: 'warning.main' }} />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                  <Typography variant="caption" color="success.main">
                    5% vs last month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Surveys Section */}
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" component="h2" color="primary">
              <BarChartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Surveys
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateModalOpen(true)}
            >
              Create Survey
            </Button>
          </Box>

          {surveys.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <BarChartIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="primary" gutterBottom>
                No Surveys Created Yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Create your first survey to start gathering valuable feedback from your audience.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateModalOpen(true)}
              >
                Create Your First Survey
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {surveys.map((survey) => (
                <Grid item xs={12} md={6} lg={4} key={survey.id}>
                  <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => handleView(survey.id)}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ p: 1, bgcolor: 'primary.light', borderRadius: 1, mr: 1.5 }}>
                            {getIconForSurvey(survey.title)}
                          </Box>
                          <Typography variant="h6" component="h3">
                            {survey.title}
                          </Typography>
                        </Box>
                        <Chip
                          label={capitalize(survey.status)}
                          color={getStatusColor(survey.status)}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40 }}>
                        {survey.description || 'No description provided.'}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <HelpOutlineIcon sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {survey.questions?.length || 0} Questions
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ChatBubbleOutlineIcon sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {survey.responses || 0} Responses
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2, borderTop: 1, borderColor: 'divider' }}>
                        <Typography variant="caption" color="text.secondary">
                          Created: {formatDate(survey.createdAt)}
                        </Typography>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(survey.id);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicate(survey.id);
                            }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(survey.id);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Container>

      {/* Create Survey Modal */}
      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Survey</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Survey Title"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            margin="dense"
            label="Survey Type"
            fullWidth
            variant="outlined"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <MenuItem value="customer">Customer Feedback</MenuItem>
            <MenuItem value="employee">Employee Satisfaction</MenuItem>
            <MenuItem value="product">Product Feedback</MenuItem>
            <MenuItem value="market">Market Research</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateModalOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateSurvey} variant="contained">
            Continue to Questions
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;