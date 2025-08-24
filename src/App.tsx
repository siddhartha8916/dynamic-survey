import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './pages/Dashboard';
import CreateQuestions from './pages/CreateQuestions';
import EditSurvey from './pages/EditSurvey';
import SurveyDetails from './pages/SurveyDetails';

// Create theme based on the original color scheme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2B4652', // Dark blue from original
    },
    secondary: {
      main: '#90A4AD', // Light blue-gray from original
    },
    background: {
      default: '#EBEBEB', // Light gray from original
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0D0D0D', // Almost black from original
      secondary: '#575757', // Medium gray from original
    },
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
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
          fontWeight: 500,
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
          <Route path="/edit-survey/:id" element={<EditSurvey />} />
          <Route path="/survey-details/:id" element={<SurveyDetails />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
