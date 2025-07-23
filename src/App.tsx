import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Dashboard from './pages/Dashboard';
import CreateQuestions from './pages/CreateQuestions';
import SurveyDetails from './pages/SurveyDetails';
import EditSurvey from './pages/EditSurvey';

// Create Material-UI theme to match the original design
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
    fontFamily: '"DM Sans", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-questions" element={<CreateQuestions />} />
          <Route path="/survey-details/:id" element={<SurveyDetails />} />
          <Route path="/edit-survey/:id" element={<EditSurvey />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
