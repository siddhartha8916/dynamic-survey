import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  Switch,
  Paper,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Edit as EditIcon,
  ContentCopy as ContentCopyIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  HelpOutline as HelpOutlineIcon,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Question, Survey } from '../types';
import { getSurveys, saveSurveys } from '../utils/storage';
import { generateId, getQuestionTypeLabel } from '../utils/helpers';

const CreateQuestions: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    text: '',
    type: 'text' as Question['type'],
    required: false,
    options: ['', '']
  });

  const surveyId = searchParams.get('id') || '';
  const surveyTitle = searchParams.get('title') || 'New Survey';
  const surveyDescription = searchParams.get('description') || '';

  useEffect(() => {
    // Load existing survey questions if editing
    const surveys = getSurveys();
    const currentSurvey = surveys.find(s => s.id === surveyId);
    if (currentSurvey && currentSurvey.questions) {
      setQuestions(currentSurvey.questions);
    }
  }, [surveyId]);

  const handleAddQuestion = () => {
    setEditingIndex(null);
    setFormData({
      text: '',
      type: 'text',
      required: false,
      options: ['', '']
    });
    setModalOpen(true);
  };

  const handleEditQuestion = (index: number) => {
    setEditingIndex(index);
    const question = questions[index];
    setFormData({
      text: question.text,
      type: question.type,
      required: question.required,
      options: question.options || ['', '']
    });
    setModalOpen(true);
  };

  const handleSaveQuestion = () => {
    if (!formData.text.trim()) {
      alert('Please enter the question text');
      return;
    }

    let options: string[] = [];
    if (['single', 'multi', 'vote', 'poll'].includes(formData.type)) {
      options = formData.options.filter(opt => opt.trim());
      if (options.length < 2) {
        alert('Please add at least two options');
        return;
      }
    }

    const question: Question = {
      id: editingIndex !== null ? questions[editingIndex].id : generateId(),
      text: formData.text,
      type: formData.type,
      options,
      required: formData.required,
      ...(formData.type === 'vote' || formData.type === 'poll' ? { votes: {} } : {})
    };

    if (editingIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = question;
      setQuestions(updatedQuestions);
    } else {
      setQuestions([...questions, question]);
    }

    setModalOpen(false);
  };

  const handleDuplicateQuestion = (index: number) => {
    const question = { ...questions[index] };
    question.id = generateId();
    question.text = `${question.text} (Copy)`;
    setQuestions([...questions, question]);
  };

  const handleDeleteQuestion = (index: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    }
  };

  const handleAddOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, '']
    });
  };

  const handleRemoveOption = (index: number) => {
    if (formData.options.length > 2) {
      const updatedOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: updatedOptions });
    }
  };

  const handleSaveSurvey = () => {
    if (questions.length === 0) {
      alert('Please add at least one question to your survey');
      return;
    }

    const survey: Survey = {
      id: surveyId,
      title: surveyTitle,
      description: surveyDescription,
      questions,
      status: 'draft',
      responses: 0,
      createdAt: new Date().toISOString()
    };

    const surveys = getSurveys();
    const existingIndex = surveys.findIndex(s => s.id === survey.id);

    if (existingIndex !== -1) {
      surveys[existingIndex] = survey;
    } else {
      surveys.push(survey);
    }

    saveSurveys(surveys);
    navigate(`/survey-details/${survey.id}`);
  };

  const needsOptions = ['single', 'multi', 'vote', 'poll'].includes(formData.type);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navigation Header */}
      <AppBar position="fixed" sx={{ bgcolor: 'white', color: 'text.primary' }} elevation={1}>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            Create Questions - {surveyTitle}
          </Typography>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveSurvey}
          >
            Save Survey
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" component="h2" color="primary">
            Survey Questions
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddQuestion}
          >
            Add Question
          </Button>
        </Box>

        {questions.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: 'center' }}>
            <HelpOutlineIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="primary" gutterBottom>
              No questions added yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Click "Add Question" to create your first question
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddQuestion}
            >
              Add Your First Question
            </Button>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {questions.map((question, index) => (
              <Card key={question.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" component="h3">
                          {question.text}
                        </Typography>
                        {question.required && (
                          <Chip label="Required" size="small" color="error" sx={{ ml: 1 }} />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {getQuestionTypeLabel(question.type)}
                      </Typography>
                      
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
                                  borderRadius: question.type === 'single' || question.type === 'vote' || question.type === 'poll' ? '50%' : 1,
                                  mr: 1.5
                                }}
                              />
                              <Typography variant="body2">{option}</Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton onClick={() => handleEditQuestion(index)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDuplicateQuestion(index)}>
                        <ContentCopyIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteQuestion(index)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>

      {/* Add/Edit Question Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingIndex !== null ? 'Edit Question' : 'Add Question'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Question Text"
            fullWidth
            variant="outlined"
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <TextField
            select
            margin="dense"
            label="Question Type"
            fullWidth
            variant="outlined"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as Question['type'] })}
            sx={{ mb: 2 }}
          >
            <MenuItem value="text">Text Question</MenuItem>
            <MenuItem value="number">Number Input</MenuItem>
            <MenuItem value="single">Single Select</MenuItem>
            <MenuItem value="multi">Multiple Choice</MenuItem>
            <MenuItem value="vote">Vote Question</MenuItem>
            <MenuItem value="poll">Poll Question</MenuItem>
          </TextField>

          <FormControlLabel
            control={
              <Switch
                checked={formData.required}
                onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
              />
            }
            label="Required Question"
            sx={{ mb: 2 }}
          />

          {needsOptions && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Options
              </Typography>
              {formData.options.map((option, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => {
                      const updatedOptions = [...formData.options];
                      updatedOptions[index] = e.target.value;
                      setFormData({ ...formData, options: updatedOptions });
                    }}
                  />
                  {formData.options.length > 2 && (
                    <IconButton onClick={() => handleRemoveOption(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button onClick={handleAddOption} startIcon={<AddIcon />}>
                Add Option
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveQuestion} variant="contained">
            {editingIndex !== null ? 'Save Changes' : 'Add Question'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateQuestions;