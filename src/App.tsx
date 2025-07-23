import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './pages/Dashboard';
import CreateQuestions from './pages/CreateQuestions';
import EditSurvey from './pages/EditSurvey';
import SurveyDetails from './pages/SurveyDetails';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2B4652', // Dark blue
    },
    secondary: {
      main: '#90A4AD', // Light blue-gray
    },
    background: {
      default: '#EBEBEB', // Light gray
    },
    text: {
      primary: '#0D0D0D', // Almost black
      secondary: '#575757', // Medium gray
    },
  },
  typography: {
    fontFamily: '"DM Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-questions" element={<CreateQuestions />} />
          <Route path="/edit-survey/:id" element={<EditSurvey />} />
          <Route path="/survey-details/:id" element={<SurveyDetails />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;