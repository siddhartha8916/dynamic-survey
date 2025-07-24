import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
  Grid,
  Divider,
  List,
  ListItem,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CalendarToday as CalendarIcon,
  BarChart as BarChartIcon,
  PhoneAndroid as PhoneAndroidIcon,
  VoiceChat as VoiceChatIcon,
  WhatsApp as WhatsAppIcon,
  Launch as LaunchIcon,
  Link as LinkIcon,
  Share as ShareIcon,
  InsertDriveFile as InsertDriveFileIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSurveys } from '../hooks/useSurveys';

const SurveyDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getSurveyById } = useSurveys();
  const [currentTab, setCurrentTab] = useState(0);
  const [deploymentModal, setDeploymentModal] = useState<{
    open: boolean;
    type: 'pwa' | 'voicebot' | 'whatsapp' | null;
  }>({ open: false, type: null });

  const survey = id ? getSurveyById(id) : null;

  if (!survey) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: 'white', color: 'text.primary', boxShadow: 1 }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => navigate('/')}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main' }}>
              Survey Details
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="error">
              Survey not found
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'text':
        return 'Text Question';
      case 'number':
        return 'Number Input';
      case 'single':
        return 'Single Select';
      case 'multi':
        return 'Multiple Choice';
      default:
        return type;
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleDeployment = (type: 'pwa' | 'voicebot' | 'whatsapp') => {
    setDeploymentModal({ open: true, type });
  };

  const handleDeploymentSubmit = () => {
    // Generate a mock deployment URL
    const baseUrl = 'https://survey.agrimensor.com';
    const surveyPath = `/survey/${survey?.id}`;
    let fullUrl = '';

    switch (deploymentModal.type) {
      case 'pwa':
        fullUrl = `${baseUrl}/pwa${surveyPath}`;
        break;
      case 'voicebot':
        fullUrl = `${baseUrl}/voice${surveyPath}`;
        break;
      case 'whatsapp':
        fullUrl = `${baseUrl}/whatsapp${surveyPath}`;
        break;
    }

    setDeploymentModal({ open: false, type: null });
    
    // Show success message or handle deployment logic here
    alert(`Survey deployed successfully! URL: ${fullUrl}`);
  };

  const closeModal = () => {
    setDeploymentModal({ open: false, type: null });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navigation Header */}
      <AppBar position="static" sx={{ backgroundColor: 'white', color: 'text.primary', boxShadow: 1 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main' }}>
            Survey Details
          </Typography>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/edit-survey/${survey.id}`)}
          >
            Edit Survey
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Survey Overview */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                {survey.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {survey.description || 'No description provided.'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip
                  label={survey.status}
                  color={getStatusColor(survey.status) as any}
                  variant="filled"
                />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarIcon sx={{ fontSize: 'small', mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    Created: {formatDate(survey.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Stats */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {survey.questions?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Questions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {survey.responses}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Responses
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {survey.responses > 0 ? '87%' : '0%'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completion Rate
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Questions */}
        <Paper sx={{ p: 0 }}>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab} onChange={handleTabChange} sx={{ px: 3 }}>
              <Tab label="Questions" />
              <Tab label="Deployment" />
              <Tab label="Responses" />
            </Tabs>
          </Box>

          {/* Questions Tab */}
          {currentTab === 0 && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BarChartIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Questions ({survey.questions?.length || 0})
                </Typography>
              </Box>

              {survey.questions && survey.questions.length > 0 ? (
                <List sx={{ width: '100%' }}>
                  {survey.questions.map((question, index) => (
                    <React.Fragment key={question.id}>
                      <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 3 }}>
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                              {index + 1}. {question.text}
                            </Typography>
                            {question.required && (
                              <Chip label="Required" color="error" size="small" sx={{ ml: 2 }} />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {getQuestionTypeLabel(question.type)}
                          </Typography>

                          {question.options && question.options.length > 0 && (
                            <Box sx={{ ml: 2 }}>
                              {question.type === 'single' && (
                                <Box>
                                  {question.options.map((option, optionIndex) => (
                                    <Box key={optionIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                      <RadioButtonUncheckedIcon sx={{ mr: 1, color: 'grey.400', fontSize: 'small' }} />
                                      <Typography variant="body2" color="text.secondary">
                                        {option}
                                      </Typography>
                                    </Box>
                                  ))}
                                </Box>
                              )}
                              {question.type === 'multi' && (
                                <Box>
                                  {question.options.map((option, optionIndex) => (
                                    <Box key={optionIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                      <CheckBoxOutlineBlankIcon sx={{ mr: 1, color: 'grey.400', fontSize: 'small' }} />
                                      <Typography variant="body2" color="text.secondary">
                                        {option}
                                      </Typography>
                                    </Box>
                                  ))}
                                </Box>
                              )}
                            </Box>
                          )}
                        </Box>
                      </ListItem>
                      {index < survey.questions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Card sx={{ backgroundColor: 'background.default' }}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="primary.main" sx={{ mb: 1 }}>
                      No questions added yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Add questions to this survey to start collecting responses
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/edit-survey/${survey.id}`)}
                    >
                      Add Questions
                    </Button>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}

          {/* Deployment Tab */}
          {currentTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                Deployment Options
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Choose how you want to deploy your survey to respondents.
              </Typography>

              <Grid container spacing={3}>
                {/* PWA Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PhoneAndroidIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          Progressive Web App
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Deploy as a Progressive Web App that works offline and can be installed on mobile devices.
                      </Typography>
                      <Chip 
                        label="Not deployed" 
                        variant="outlined" 
                        size="small" 
                        sx={{ mb: 3 }}
                      />
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<LaunchIcon />}
                        onClick={() => handleDeployment('pwa')}
                      >
                        Deploy as PWA
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Voice Bot Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <VoiceChatIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          Voice Bot
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Deploy as a voice-enabled interface accessible through voice commands and interactions.
                      </Typography>
                      <Chip 
                        label="Not deployed" 
                        variant="outlined" 
                        size="small" 
                        sx={{ mb: 3 }}
                      />
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<LinkIcon />}
                        onClick={() => handleDeployment('voicebot')}
                      >
                        Deploy Voice Bot
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                {/* WhatsApp Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <WhatsAppIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          WhatsApp Flows
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Deploy as a WhatsApp Flow for easy sharing and responses via WhatsApp.
                      </Typography>
                      <Chip 
                        label="Not deployed" 
                        variant="outlined" 
                        size="small" 
                        sx={{ mb: 3 }}
                      />
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<ShareIcon />}
                        onClick={() => handleDeployment('whatsapp')}
                      >
                        Deploy to WhatsApp
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Responses Tab */}
          {currentTab === 2 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 4 }}>
                Survey Responses
              </Typography>

              {/* Empty state for responses */}
              <Card sx={{ backgroundColor: 'background.default' }}>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <InsertDriveFileIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    No Responses Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Deploy your survey to start collecting responses.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setCurrentTab(1)}
                  >
                    Go to Deployment
                  </Button>
                </CardContent>
              </Card>
            </Box>
          )}
        </Paper>

        {/* Deployment Modal */}
        <Dialog 
          open={deploymentModal.open} 
          onClose={closeModal}
          maxWidth="sm" 
          fullWidth
        >
          <DialogTitle>
            Deploy Survey - {deploymentModal.type === 'pwa' ? 'Progressive Web App' : 
                              deploymentModal.type === 'voicebot' ? 'Voice Bot' : 
                              'WhatsApp Flows'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {deploymentModal.type === 'pwa' && 
                  'Configure your Progressive Web App deployment settings. The app will be installable and work offline.'}
                {deploymentModal.type === 'voicebot' && 
                  'Configure your voice bot deployment. Users will be able to interact with your survey using voice commands.'}
                {deploymentModal.type === 'whatsapp' && 
                  'Configure your WhatsApp Flow deployment. Users will be able to take the survey directly in WhatsApp.'}
              </Typography>
              
              <TextField
                label="Survey URL Name"
                placeholder={`${survey?.title?.toLowerCase().replace(/\s+/g, '-') || 'my-survey'}`}
                fullWidth
                helperText="This will be part of your survey URL"
              />
              
              {deploymentModal.type === 'whatsapp' && (
                <TextField
                  label="WhatsApp Business Number"
                  placeholder="+1234567890"
                  fullWidth
                  helperText="The WhatsApp Business number to send flows from"
                />
              )}
              
              {deploymentModal.type === 'voicebot' && (
                <TextField
                  label="Voice Language"
                  select
                  defaultValue="en-US"
                  fullWidth
                  helperText="Select the primary language for voice interactions"
                >
                  <MenuItem value="en-US">English (US)</MenuItem>
                  <MenuItem value="es-ES">Spanish</MenuItem>
                  <MenuItem value="fr-FR">French</MenuItem>
                </TextField>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleDeploymentSubmit}
              startIcon={<LaunchIcon />}
            >
              Deploy
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default SurveyDetails;