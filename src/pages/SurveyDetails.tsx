import React from 'react';
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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CalendarToday as CalendarIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSurveys } from '../hooks/useSurveys';

const SurveyDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getSurveyById } = useSurveys();

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
        <Paper sx={{ p: 3 }}>
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
        </Paper>
      </Container>
    </Box>
  );
};

export default SurveyDetails;