import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Add,
  TrendingUp,
  Edit,
  FileCopy,
  Delete,
  QuestionAnswer,
  CheckCircle,
  ChatBubbleOutline,
  ShowChart,
  RecordVoiceOver,
  Domain,
  Inventory,
  BarChart,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useSurveys } from '../hooks/useSurveys';
import type { Survey, SurveyFormData } from '../types';
import { formatDate, capitalize, getStatusColor, getSurveyIcon } from '../utils/helpers';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { surveys, loading, addSurvey, deleteSurvey, duplicateSurvey } = useSurveys();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState<SurveyFormData>({
    title: '',
    description: '',
    type: 'customer',
  });

  const handleCreateSurvey = () => {
    if (!formData.title.trim()) {
      alert('Please enter a survey title');
      return;
    }

    const newSurvey: Survey = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      status: 'draft',
      questions: [],
      responses: 0,
      createdAt: new Date().toISOString(),
    };

    addSurvey(newSurvey);
    setCreateModalOpen(false);
    setFormData({ title: '', description: '', type: 'customer' });
    
    // Navigate to create questions page
    navigate(`/create-questions?id=${newSurvey.id}&title=${encodeURIComponent(newSurvey.title)}&description=${encodeURIComponent(newSurvey.description)}`);
  };

  const handleDeleteSurvey = (id: string) => {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      deleteSurvey(id);
    }
  };

  const handleDuplicateSurvey = (id: string) => {
    duplicateSurvey(id);
  };

  const getIconComponent = (title: string) => {
    const iconName = getSurveyIcon(title);
    switch (iconName) {
      case 'domain':
        return <Domain />;
      case 'inventory':
        return <Inventory />;
      case 'bar_chart':
        return <BarChart />;
      default:
        return <RecordVoiceOver />;
    }
  };

  // Calculate statistics
  const totalSurveys = surveys.length;
  const activeSurveys = surveys.filter(s => s.status === 'active').length;
  const totalResponses = surveys.reduce((sum, s) => sum + s.responses, 0);
  const avgCompletionRate = surveys.length > 0 ? 87 : 0; // Mock data for completion rate

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Navigation title="Dashboard" subtitle="Welcome back, Sarah! Here's an overview of your surveys." />
      
      <Container maxWidth="xl" sx={{ pt: 12, pb: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Welcome back, Sarah! Here's an overview of your surveys.
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <Card sx={{ backgroundColor: 'white', border: '1px solid #f0f0f0' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Total Surveys
                      </Typography>
                      <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mt: 1 }}>
                        {totalSurveys}
                      </Typography>
                    </Box>
                    <Box sx={{ p: 1.5, backgroundColor: 'primary.main', borderRadius: 2, opacity: 0.1 }}>
                      <QuestionAnswer sx={{ color: 'primary.main', fontSize: '1.5rem' }} />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp sx={{ color: 'success.main', fontSize: '1rem', mr: 0.5 }} />
                    <Typography variant="caption" sx={{ color: 'success.main' }}>
                      12% vs last month
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <Card sx={{ backgroundColor: 'white', border: '1px solid #f0f0f0' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Active Surveys
                      </Typography>
                      <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mt: 1 }}>
                        {activeSurveys}
                      </Typography>
                    </Box>
                    <Box sx={{ p: 1.5, backgroundColor: 'success.main', borderRadius: 2, opacity: 0.1 }}>
                      <CheckCircle sx={{ color: 'success.main', fontSize: '1.5rem' }} />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp sx={{ color: 'success.main', fontSize: '1rem', mr: 0.5 }} />
                    <Typography variant="caption" sx={{ color: 'success.main' }}>
                      8% vs last month
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <Card sx={{ backgroundColor: 'white', border: '1px solid #f0f0f0' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Total Responses
                      </Typography>
                      <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mt: 1 }}>
                        {totalResponses.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ p: 1.5, backgroundColor: 'info.main', borderRadius: 2, opacity: 0.1 }}>
                      <ChatBubbleOutline sx={{ color: 'info.main', fontSize: '1.5rem' }} />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp sx={{ color: 'success.main', fontSize: '1rem', mr: 0.5 }} />
                    <Typography variant="caption" sx={{ color: 'success.main' }}>
                      24% vs last month
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <Card sx={{ backgroundColor: 'white', border: '1px solid #f0f0f0' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Completion Rate
                      </Typography>
                      <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mt: 1 }}>
                        {avgCompletionRate}%
                      </Typography>
                    </Box>
                    <Box sx={{ p: 1.5, backgroundColor: 'warning.main', borderRadius: 2, opacity: 0.1 }}>
                      <ShowChart sx={{ color: 'warning.main', fontSize: '1.5rem' }} />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp sx={{ color: 'success.main', fontSize: '1rem', mr: 0.5 }} />
                    <Typography variant="caption" sx={{ color: 'success.main' }}>
                      5% vs last month
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Surveys Section */}
        <Paper sx={{ p: 3, position: 'relative' }}>
          <Box sx={{ 
            position: 'absolute', 
            top: -16, 
            left: 20, 
            backgroundColor: 'background.default', 
            px: 2, 
            py: 1,
            borderRadius: '0 0 8px 8px'
          }}>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <BarChart sx={{ mr: 1 }} />
              Surveys
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3, mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateModalOpen(true)}
              sx={{ borderRadius: 2 }}
            >
              Create Survey
            </Button>
          </Box>

          {surveys.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
              <QuestionAnswer sx={{ fontSize: '4rem', color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 1 }}>
                No Surveys Created Yet
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: '400px', mx: 'auto' }}>
                Create your first survey to start gathering valuable feedback from your audience.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setCreateModalOpen(true)}
                sx={{ borderRadius: 2 }}
              >
                Create Your First Survey
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {surveys.map((survey) => (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={survey.id}>
                  <Card sx={{ 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-2px)'
                    },
                    position: 'relative',
                    overflow: 'visible'
                  }}>
                    <Box sx={{ 
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      backgroundColor: getStatusColor(survey.status) === 'success' ? 'success.main' : 
                                      getStatusColor(survey.status) === 'warning' ? 'warning.main' : 'grey.400'
                    }} />
                    
                    <CardContent onClick={() => navigate(`/survey-details/${survey.id}`)}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          <Box sx={{ 
                            p: 1.5, 
                            backgroundColor: 'primary.main', 
                            borderRadius: 2, 
                            opacity: 0.1, 
                            mr: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {getIconComponent(survey.title)}
                          </Box>
                          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'semibold' }}>
                            {survey.title}
                          </Typography>
                        </Box>
                        <Chip 
                          label={capitalize(survey.status)} 
                          color={getStatusColor(survey.status)}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.5 }}>
                        {survey.description || 'No description provided.'}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <QuestionAnswer sx={{ fontSize: '1.1rem', mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {survey.questions?.length || 0} Questions
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ChatBubbleOutline sx={{ fontSize: '1.1rem', mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {survey.responses} Responses
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                    
                    <CardActions sx={{ backgroundColor: 'background.default', justifyContent: 'space-between', px: 2 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Created: {formatDate(survey.createdAt)}
                      </Typography>
                      <Box>
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/edit-survey/${survey.id}`);
                          }}
                          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateSurvey(survey.id);
                          }}
                          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                        >
                          <FileCopy fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSurvey(survey.id);
                          }}
                          sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Container>

      {/* Create Survey Modal */}
      <Dialog 
        open={createModalOpen} 
        onClose={() => setCreateModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            Create New Survey
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Survey Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              placeholder="Enter survey title"
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={4}
              placeholder="Enter survey description"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Survey Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                label="Survey Type"
              >
                <MenuItem value="customer">Customer Feedback</MenuItem>
                <MenuItem value="employee">Employee Satisfaction</MenuItem>
                <MenuItem value="product">Product Feedback</MenuItem>
                <MenuItem value="market">Market Research</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setCreateModalOpen(false)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCreateSurvey}
            sx={{ borderRadius: 2 }}
          >
            Continue to Questions
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;