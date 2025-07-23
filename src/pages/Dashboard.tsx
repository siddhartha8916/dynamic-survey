import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CardActions,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  FileCopy as FileCopyIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Message as MessageIcon,
  Assessment as AssessmentIcon,
  HelpOutline as HelpOutlineIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  Feedback as FeedbackIcon,
  Inventory as InventoryIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSurveys } from '../hooks/useSurveys';
import type { SurveyFormData } from '../types/survey';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { surveys, loading, duplicateSurvey, deleteSurvey } = useSurveys();
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

    const newSurveyId = Date.now().toString();
    const params = new URLSearchParams({
      id: newSurveyId,
      title: formData.title,
      description: formData.description,
    });

    navigate(`/create-questions?${params.toString()}`);
    setCreateModalOpen(false);
    setFormData({ title: '', description: '', type: 'customer' });
  };

  const handleDuplicateSurvey = (id: string) => {
    duplicateSurvey(id);
  };

  const handleDeleteSurvey = (id: string) => {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      deleteSurvey(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'draft':
        return 'warning';
      case 'closed':
        return 'default';
      default:
        return 'primary';
    }
  };

  const getSurveyIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('employee')) return <BusinessIcon />;
    if (lowerTitle.includes('product')) return <InventoryIcon />;
    if (lowerTitle.includes('market')) return <AssessmentIcon />;
    return <FeedbackIcon />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navigation Header */}
      <AppBar position="fixed" sx={{ backgroundColor: 'white', color: 'text.primary', boxShadow: 1 }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img
              src="/cosa-logo.png"
              alt="Logo"
              style={{ height: 48, marginRight: 16 }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}
              src="https://placehold.co/40x40/2B4652/FFFFFF?text=SJ"
            >
              SJ
            </Avatar>
            <Typography variant="body2" sx={{ display: { xs: 'none', md: 'block' } }}>
              Sarah Johnson
            </Typography>
            <KeyboardArrowDownIcon />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 10, mb: 4 }}>
        {/* Dashboard Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" sx={{ color: 'primary.main', mb: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, Sarah! Here's an overview of your surveys.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2, border: '1px solid', borderColor: 'grey.200' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Surveys
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {surveys.length}
                      </Typography>
                    </Box>
                    <Box sx={{ p: 1.5, backgroundColor: 'primary.main', borderRadius: 2, opacity: 0.1 }}>
                      <AssessmentIcon sx={{ color: 'primary.main' }} />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUpIcon sx={{ color: 'success.main', fontSize: 'small' }} />
                    <Typography variant="caption" sx={{ color: 'success.main', mr: 1 }}>
                      12%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      vs last month
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2, border: '1px solid', borderColor: 'grey.200' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Active Surveys
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {surveys.filter(s => s.status === 'active').length}
                      </Typography>
                    </Box>
                    <Box sx={{ p: 1.5, backgroundColor: 'success.light', borderRadius: 2 }}>
                      <CheckCircleIcon sx={{ color: 'success.main' }} />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUpIcon sx={{ color: 'success.main', fontSize: 'small' }} />
                    <Typography variant="caption" sx={{ color: 'success.main', mr: 1 }}>
                      8%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      vs last month
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2, border: '1px solid', borderColor: 'grey.200' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Responses
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {surveys.reduce((total, survey) => total + survey.responses, 0)}
                      </Typography>
                    </Box>
                    <Box sx={{ p: 1.5, backgroundColor: 'info.light', borderRadius: 2 }}>
                      <MessageIcon sx={{ color: 'info.main' }} />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUpIcon sx={{ color: 'success.main', fontSize: 'small' }} />
                    <Typography variant="caption" sx={{ color: 'success.main', mr: 1 }}>
                      24%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      vs last month
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2, border: '1px solid', borderColor: 'grey.200' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Completion Rate
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        87%
                      </Typography>
                    </Box>
                    <Box sx={{ p: 1.5, backgroundColor: 'warning.light', borderRadius: 2 }}>
                      <TrendingUpIcon sx={{ color: 'warning.main' }} />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUpIcon sx={{ color: 'success.main', fontSize: 'small' }} />
                    <Typography variant="caption" sx={{ color: 'success.main', mr: 1 }}>
                      5%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      vs last month
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Surveys Section */}
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AssessmentIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Surveys
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateModalOpen(true)}
              sx={{ textTransform: 'none' }}
            >
              Create Survey
            </Button>
          </Box>

          {surveys.length > 0 ? (
            <Grid container spacing={3}>
              {surveys.map((survey) => (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={survey.id}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-2px)',
                      },
                      borderLeft: '4px solid',
                      borderLeftColor: survey.status === 'active' ? 'success.main' : 'warning.main',
                    }}
                    onClick={() => navigate(`/survey-details/${survey.id}`)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ p: 1, backgroundColor: 'primary.main', borderRadius: 1, mr: 2, opacity: 0.1 }}>
                            {getSurveyIcon(survey.title)}
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 'semibold', color: 'primary.main' }}>
                            {survey.title}
                          </Typography>
                        </Box>
                        <Chip
                          label={survey.status}
                          color={getStatusColor(survey.status) as any}
                          size="small"
                          variant="filled"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {survey.description || 'No description provided.'}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <HelpOutlineIcon sx={{ fontSize: 'small', mr: 0.5 }} />
                          <Typography variant="body2">
                            {survey.questions?.length || 0} Questions
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <MessageIcon sx={{ fontSize: 'small', mr: 0.5 }} />
                          <Typography variant="body2">
                            {survey.responses} Responses
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ backgroundColor: 'background.default', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarIcon sx={{ fontSize: 'small', mr: 0.5 }} />
                        <Typography variant="caption">
                          Created: {formatDate(survey.createdAt)}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/edit-survey/${survey.id}`);
                          }}
                          title="Edit Survey"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateSurvey(survey.id);
                          }}
                          title="Clone Survey"
                        >
                          <FileCopyIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSurvey(survey.id);
                          }}
                          title="Delete Survey"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Box sx={{ p: 3, backgroundColor: 'background.default', borderRadius: 50, display: 'inline-block', mb: 3 }}>
                <AssessmentIcon sx={{ fontSize: 64, color: 'primary.main' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'semibold', color: 'primary.main', mb: 2 }}>
                No Surveys Created Yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                Create your first survey to start gathering valuable feedback from your audience.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateModalOpen(true)}
                size="large"
              >
                Create Your First Survey
              </Button>
            </Box>
          )}
        </Paper>
      </Container>

      {/* Create Survey Dialog */}
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
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
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