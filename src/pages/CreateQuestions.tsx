import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Chip,
  Paper,
  List,
  ListItem,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Edit as EditIcon,
  FileCopy as FileCopyIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSurveys } from '../hooks/useSurveys';
import type { Question, QuestionFormData, Survey } from '../types/survey';

const CreateQuestions: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addSurvey, updateSurvey, getSurveyById } = useSurveys();

  const surveyId = searchParams.get('id') || '';
  const surveyTitle = searchParams.get('title') || 'New Survey';
  const surveyDescription = searchParams.get('description') || '';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<QuestionFormData>({
    text: '',
    type: 'text',
    required: false,
    options: ['', ''],
  });

  // Load existing survey questions if editing
  useEffect(() => {
    if (surveyId) {
      const existingSurvey = getSurveyById(surveyId);
      if (existingSurvey && existingSurvey.questions) {
        setQuestions(existingSurvey.questions);
      }
    }
  }, [surveyId, getSurveyById]);

  const handleOpenQuestionModal = () => {
    setEditingQuestionIndex(null);
    setFormData({
      text: '',
      type: 'text',
      required: false,
      options: ['', ''],
    });
    setQuestionModalOpen(true);
  };

  const handleEditQuestion = (index: number) => {
    const question = questions[index];
    setEditingQuestionIndex(index);
    setFormData({
      text: question.text,
      type: question.type,
      required: question.required,
      options: question.options || ['', ''],
    });
    setQuestionModalOpen(true);
  };

  const handleSaveQuestion = () => {
    if (!formData.text.trim()) {
      alert('Please enter the question text');
      return;
    }

    let options: string[] = [];
    if (formData.type === 'single' || formData.type === 'multi') {
      options = formData.options.filter(option => option.trim() !== '');
      if (options.length < 2) {
        alert('Please add at least two options');
        return;
      }
    }

    const question: Question = {
      id: editingQuestionIndex !== null ? questions[editingQuestionIndex].id : Date.now(),
      text: formData.text,
      type: formData.type,
      options: options.length > 0 ? options : undefined,
      required: formData.required,
    };

    if (editingQuestionIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = question;
      setQuestions(updatedQuestions);
    } else {
      setQuestions([...questions, question]);
    }

    setQuestionModalOpen(false);
  };

  const handleDuplicateQuestion = (index: number) => {
    const question = { ...questions[index] };
    question.id = Date.now();
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
      options: [...formData.options, ''],
    });
  };

  const handleRemoveOption = (index: number) => {
    if (formData.options.length > 2) {
      const updatedOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: updatedOptions });
    }
  };

  const handleUpdateOption = (index: number, value: string) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = value;
    setFormData({ ...formData, options: updatedOptions });
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
      questions: questions,
      status: 'draft',
      responses: 0,
      createdAt: new Date().toISOString(),
    };

    const existingSurvey = getSurveyById(surveyId);
    if (existingSurvey) {
      updateSurvey(surveyId, survey);
    } else {
      addSurvey(survey);
    }

    navigate(`/survey-details/${survey.id}`);
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
            Create Survey Questions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {surveyTitle}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Questions Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Questions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add questions to your survey
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenQuestionModal}
            >
              Add Question
            </Button>
          </Box>

          {questions.length > 0 ? (
            <List sx={{ width: '100%' }}>
              {questions.map((question, index) => (
                <Paper key={question.id} sx={{ mb: 2, border: '1px solid', borderColor: 'grey.200' }}>
                  <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                            {question.text}
                          </Typography>
                          {question.required && (
                            <Chip label="Required" color="error" size="small" sx={{ ml: 2 }} />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {getQuestionTypeLabel(question.type)}
                        </Typography>

                        {question.options && question.options.length > 0 && (
                          <Box>
                            {question.type === 'single' && (
                              <Box>
                                {question.options.map((option, optionIndex) => (
                                  <Box key={optionIndex} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <RadioButtonUncheckedIcon sx={{ mr: 1, color: 'grey.400' }} />
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
                                  <Box key={optionIndex} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <CheckBoxOutlineBlankIcon sx={{ mr: 1, color: 'grey.400' }} />
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
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditQuestion(index)}
                          title="Edit Question"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDuplicateQuestion(index)}
                          title="Duplicate Question"
                        >
                          <FileCopyIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteQuestion(index)}
                          title="Delete Question"
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </ListItem>
                </Paper>
              ))}
            </List>
          ) : (
            <Card sx={{ backgroundColor: 'background.default' }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="primary.main" sx={{ mb: 1 }}>
                  No questions added yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click "Add Question" to create your first question
                </Typography>
              </CardContent>
            </Card>
          )}
        </Paper>

        {/* Save Survey Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            onClick={handleSaveSurvey}
          >
            Save Survey
          </Button>
        </Box>
      </Container>

      {/* Add Question Dialog */}
      <Dialog open={questionModalOpen} onClose={() => setQuestionModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingQuestionIndex !== null ? 'Edit Question' : 'Add Question'}
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
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            sx={{ mb: 2 }}
          >
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="single">Single Select</MenuItem>
            <MenuItem value="multi">Multi Select</MenuItem>
          </TextField>

          {(formData.type === 'single' || formData.type === 'multi') && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Options
              </Typography>
              {formData.options.map((option, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={option}
                    placeholder={`Option ${index + 1}`}
                    onChange={(e) => handleUpdateOption(index, e.target.value)}
                  />
                  {formData.options.length > 2 && (
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveOption(index)}
                      color="error"
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddOption}
                sx={{ textTransform: 'none' }}
              >
                Add Option
              </Button>
            </Box>
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.required}
                onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
              />
            }
            label="This question is required"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuestionModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveQuestion} variant="contained">
            {editingQuestionIndex !== null ? 'Save Changes' : 'Add Question'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateQuestions;