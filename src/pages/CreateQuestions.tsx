import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import {
  Add,
  Save,
  Edit,
  FileCopy,
  Delete,
  RadioButtonChecked,
  CheckBox,
  Close,
} from '@mui/icons-material';
import Navigation from '../components/Navigation';
import { useSurveys } from '../hooks/useSurveys';
import type { Question, QuestionType, Survey } from '../types';
import { getQuestionTypeLabel } from '../utils/helpers';

const CreateQuestions: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { surveys, updateSurvey, getSurveyById } = useSurveys();
  
  // Get survey details from URL params
  const surveyId = searchParams.get('id');
  const urlTitle = searchParams.get('title');
  const urlDescription = searchParams.get('description');
  
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [questionForm, setQuestionForm] = useState({
    text: '',
    type: 'text' as QuestionType,
    options: ['', ''],
    required: false,
  });

  useEffect(() => {
    if (surveyId) {
      // Try to get existing survey first
      const existingSurvey = getSurveyById(surveyId);
      if (existingSurvey) {
        setSurvey(existingSurvey);
        setQuestions(existingSurvey.questions || []);
      } else if (urlTitle) {
        // Create new survey object
        const newSurvey: Survey = {
          id: surveyId,
          title: urlTitle,
          description: urlDescription || '',
          status: 'draft',
          questions: [],
          responses: 0,
          createdAt: new Date().toISOString(),
        };
        setSurvey(newSurvey);
        setQuestions([]);
      }
    }
  }, [surveyId, urlTitle, urlDescription, getSurveyById]);

  const openModal = (index?: number) => {
    if (index !== undefined) {
      const question = questions[index];
      setQuestionForm({
        text: question.text,
        type: question.type,
        options: question.options || ['', ''],
        required: question.required,
      });
      setEditingIndex(index);
    } else {
      setQuestionForm({
        text: '',
        type: 'text',
        options: ['', ''],
        required: false,
      });
      setEditingIndex(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingIndex(null);
    setQuestionForm({
      text: '',
      type: 'text',
      options: ['', ''],
      required: false,
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const addOption = () => {
    setQuestionForm({
      ...questionForm,
      options: [...questionForm.options, ''],
    });
  };

  const removeOption = (index: number) => {
    if (questionForm.options.length > 2) {
      const newOptions = questionForm.options.filter((_, i) => i !== index);
      setQuestionForm({ ...questionForm, options: newOptions });
    }
  };

  const saveQuestion = () => {
    if (!questionForm.text.trim()) {
      alert('Please enter the question text');
      return;
    }

    if (['single', 'multi'].includes(questionForm.type)) {
      const validOptions = questionForm.options.filter(opt => opt.trim());
      if (validOptions.length < 2) {
        alert('Please add at least two options');
        return;
      }
    }

    const newQuestion: Question = {
      id: editingIndex !== null ? questions[editingIndex].id : Date.now(),
      text: questionForm.text,
      type: questionForm.type,
      options: ['single', 'multi'].includes(questionForm.type) 
        ? questionForm.options.filter(opt => opt.trim()) 
        : undefined,
      required: questionForm.required,
    };

    let newQuestions: Question[];
    if (editingIndex !== null) {
      newQuestions = [...questions];
      newQuestions[editingIndex] = newQuestion;
    } else {
      newQuestions = [...questions, newQuestion];
    }

    setQuestions(newQuestions);
    closeModal();
  };

  const duplicateQuestion = (index: number) => {
    const question = questions[index];
    const duplicate: Question = {
      ...question,
      id: Date.now(),
      text: `${question.text} (Copy)`,
    };
    setQuestions([...questions, duplicate]);
  };

  const deleteQuestion = (index: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    }
  };

  const saveSurvey = () => {
    if (questions.length === 0) {
      alert('Please add at least one question to your survey');
      return;
    }

    if (survey) {
      const updatedSurvey: Survey = {
        ...survey,
        questions,
      };
      updateSurvey(updatedSurvey);
      navigate(`/survey-details/${survey.id}`);
    }
  };

  if (!survey) {
    return (
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Navigation title="Create Questions" showBackButton />
        <Container maxWidth="xl" sx={{ pt: 12, pb: 4 }}>
          <Typography variant="h4">Loading...</Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Navigation title="Create Questions" showBackButton subtitle={survey.title} />
      
      <Container maxWidth="xl" sx={{ pt: 12, pb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 1 }}>
            Create Questions
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Add questions to your survey: {survey.title}
          </Typography>
        </Box>

        {/* Questions Section */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                Questions
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Add questions to your survey
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => openModal()}
              sx={{ borderRadius: 2 }}
            >
              Add Question
            </Button>
          </Box>

          {questions.length === 0 ? (
            <Paper sx={{ p: 4, backgroundColor: '#f9f9f9', textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: 'primary.main', mb: 1 }}>
                No questions added yet
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Click "Add Question" to create your first question
              </Typography>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {questions.map((question, index) => (
                <Card key={question.id} sx={{ border: '1px solid #e0e0e0' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" sx={{ color: 'primary.main' }}>
                            {question.text}
                          </Typography>
                          {question.required && (
                            <Chip label="Required" size="small" color="error" sx={{ ml: 1 }} />
                          )}
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                          {getQuestionTypeLabel(question.type)}
                        </Typography>
                        
                        {question.options && question.options.length > 0 && (
                          <Box>
                            {question.type === 'single' && (
                              <Box>
                                {question.options.map((option, optIndex) => (
                                  <Box key={optIndex} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                    <RadioButtonChecked sx={{ fontSize: '1rem', mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                      {option}
                                    </Typography>
                                  </Box>
                                ))}
                              </Box>
                            )}
                            {question.type === 'multi' && (
                              <Box>
                                {question.options.map((option, optIndex) => (
                                  <Box key={optIndex} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                    <CheckBox sx={{ fontSize: '1rem', mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
                          onClick={() => openModal(index)}
                          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => duplicateQuestion(index)}
                          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                        >
                          <FileCopy fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => deleteQuestion(index)}
                          sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Paper>

        {/* Save Survey Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Save />}
            onClick={saveSurvey}
            sx={{ borderRadius: 2, px: 4, py: 1.5 }}
          >
            Save Survey
          </Button>
        </Box>
      </Container>

      {/* Add/Edit Question Modal */}
      <Dialog open={modalOpen} onClose={closeModal} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              {editingIndex !== null ? 'Edit Question' : 'Add Question'}
            </Typography>
            <IconButton onClick={closeModal}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Question Text"
              value={questionForm.text}
              onChange={(e) => setQuestionForm({ ...questionForm, text: e.target.value })}
              margin="normal"
              placeholder="Enter your question here"
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Question Type</InputLabel>
              <Select
                value={questionForm.type}
                onChange={(e) => setQuestionForm({ 
                  ...questionForm, 
                  type: e.target.value as QuestionType,
                  options: ['single', 'multi'].includes(e.target.value) ? questionForm.options : []
                })}
                label="Question Type"
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="single">Single Select</MenuItem>
                <MenuItem value="multi">Multi Select</MenuItem>
              </Select>
            </FormControl>

            {['single', 'multi'].includes(questionForm.type) && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
                  Options
                </Typography>
                {questionForm.options.map((option, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    {questionForm.options.length > 2 && (
                      <IconButton
                        onClick={() => removeOption(index)}
                        sx={{ ml: 1, color: 'error.main' }}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Button
                  startIcon={<Add />}
                  onClick={addOption}
                  sx={{ mt: 1, color: 'primary.main' }}
                >
                  Add Option
                </Button>
              </Box>
            )}

            <FormControlLabel
              control={
                <Checkbox
                  checked={questionForm.required}
                  onChange={(e) => setQuestionForm({ ...questionForm, required: e.target.checked })}
                />
              }
              label="This question is required"
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={closeModal} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={saveQuestion} sx={{ borderRadius: 2 }}>
            {editingIndex !== null ? 'Save Changes' : 'Add Question'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateQuestions;