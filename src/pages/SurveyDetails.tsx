import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Paper,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Assessment as AssessmentIcon,
  HelpOutline as HelpOutlineIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  Poll as PollIcon,
  HowToVote as HowToVoteIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Survey, Question, VoteResult } from '../types';
import { getSurveyById } from '../utils/storage';
import { formatDate, getQuestionTypeLabel } from '../utils/helpers';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const SurveyDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (id) {
      const foundSurvey = getSurveyById(id);
      setSurvey(foundSurvey || null);
      setLoading(false);
    }
  }, [id]);

  const getVoteResults = (question: Question): VoteResult[] => {
    if (!question.options || !question.votes) return [];
    
    const totalVotes = Object.values(question.votes).reduce((sum, count) => sum + count, 0);
    
    return question.options.map(option => ({
      option,
      votes: question.votes?.[option] || 0,
      percentage: totalVotes > 0 ? Math.round(((question.votes?.[option] || 0) / totalVotes) * 100) : 0
    }));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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

  const voteQuestions = survey.questions.filter(q => q.type === 'vote' || q.type === 'poll');
  const regularQuestions = survey.questions.filter(q => q.type !== 'vote' && q.type !== 'poll');

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navigation Header */}
      <AppBar position="fixed" sx={{ bgcolor: 'white', color: 'text.primary' }} elevation={1}>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            {survey.title}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/edit-survey/${id}`)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            startIcon={<HelpOutlineIcon />}
            onClick={() => navigate(`/create-questions?id=${id}&title=${encodeURIComponent(survey.title)}&description=${encodeURIComponent(survey.description)}`)}
          >
            Edit Questions
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
        {/* Survey Header */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h4" component="h2" color="primary" gutterBottom>
                {survey.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {survey.description}
              </Typography>
            </Box>
            <Chip
              label={survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
              color={survey.status === 'active' ? 'success' : survey.status === 'draft' ? 'warning' : 'default'}
            />
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <HelpOutlineIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  <strong>{survey.questions.length}</strong> Questions
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ChatBubbleOutlineIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  <strong>{survey.responses}</strong> Responses
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <HowToVoteIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  <strong>{voteQuestions.length}</strong> Vote/Poll Questions
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Created: {formatDate(survey.createdAt)}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Questions" />
            <Tab label="Vote Results" disabled={voteQuestions.length === 0} />
            <Tab label="Analytics" />
          </Tabs>
        </Box>

        {/* Questions Tab */}
        <TabPanel value={tabValue} index={0}>
          {survey.questions.length === 0 ? (
            <Paper sx={{ p: 8, textAlign: 'center' }}>
              <HelpOutlineIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="primary" gutterBottom>
                No Questions Added
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Start building your survey by adding questions.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate(`/create-questions?id=${id}&title=${encodeURIComponent(survey.title)}&description=${encodeURIComponent(survey.description)}`)}
              >
                Add Questions
              </Button>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {survey.questions.map((question, index) => (
                <Card key={question.id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" component="h3">
                          {index + 1}. {question.text}
                        </Typography>
                        {question.required && (
                          <Chip label="Required" size="small" color="error" />
                        )}
                        {(question.type === 'vote' || question.type === 'poll') && (
                          <Chip
                            label={question.type === 'vote' ? 'Vote' : 'Poll'}
                            size="small"
                            color="primary"
                            icon={question.type === 'vote' ? <HowToVoteIcon /> : <PollIcon />}
                          />
                        )}
                      </Box>
                      <Chip label={getQuestionTypeLabel(question.type)} size="small" variant="outlined" />
                    </Box>

                    {question.options && question.options.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        {question.options.map((option, optIndex) => (
                          <Box key={optIndex} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                border: 1,
                                borderColor: 'grey.400',
                                borderRadius: ['single', 'vote', 'poll'].includes(question.type) ? '50%' : 1,
                                mr: 1.5
                              }}
                            />
                            <Typography variant="body2">{option}</Typography>
                            {(question.type === 'vote' || question.type === 'poll') && question.votes && (
                              <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                                {question.votes[option] || 0} votes
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </TabPanel>

        {/* Vote Results Tab */}
        <TabPanel value={tabValue} index={1}>
          {voteQuestions.length === 0 ? (
            <Paper sx={{ p: 8, textAlign: 'center' }}>
              <PollIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="primary" gutterBottom>
                No Vote Questions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add vote or poll questions to see results here.
              </Typography>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {voteQuestions.map((question, index) => {
                const results = getVoteResults(question);
                const totalVotes = results.reduce((sum, result) => sum + result.votes, 0);

                return (
                  <Card key={question.id}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {question.text}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Total votes: {totalVotes}
                      </Typography>

                      {results.map((result, resultIndex) => (
                        <Box key={resultIndex} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">{result.option}</Typography>
                            <Typography variant="body2">
                              {result.votes} ({result.percentage}%)
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={result.percentage}
                            sx={{ height: 8, borderRadius: 1 }}
                          />
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={tabValue} index={2}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Survey Analytics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h4" color="primary">
                      {survey.responses}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Responses
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h4" color="primary">
                      {Math.round((survey.responses / Math.max(survey.responses + 10, 1)) * 100)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completion Rate
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </TabPanel>
      </Container>
    </Box>
  );
};

export default SurveyDetails;