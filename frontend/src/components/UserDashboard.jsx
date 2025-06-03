import { useState } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material';
// Icons removed - install @mui/icons-material if you want to use them

function UserDashboard() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questionHistory, setQuestionHistory] = useState([]);

  const askQuestion = async () => {
    if (!question.trim()) {
      setError('Please enter a question.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5001/query', { question });
      const newAnswer = res.data.answer;
      setAnswer(newAnswer);
      
      // Add to history
      setQuestionHistory(prev => [
        { question: question.trim(), answer: newAnswer, timestamp: new Date() },
        ...prev.slice(0, 4) // Keep only last 5 questions
      ]);
      
      setQuestion(''); // Clear input after successful query
    } catch (err) {
      setError('Error querying the model. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary" sx={{ mb: 4 }}>
        User Dashboard
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Ask Your Question
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            rows={3}
            disabled={loading}
            placeholder="e.g., What is the main topic of the uploaded document?"
          />
          
          <Button
            variant="contained"
            color="primary"
            onClick={askQuestion}
            disabled={loading || !question.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ minWidth: 120, height: 'fit-content', mt: 1 }}
          >
            {loading ? 'Asking...' : 'Ask'}
          </Button>
        </Box>
      </Paper>

      {answer && (
        <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'primary.50' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" color="primary">
              🤖 Answer
            </Typography>
            <Chip 
              label="Latest" 
              size="small" 
              color="primary" 
              sx={{ ml: 2 }} 
            />
          </Box>
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            {answer}
          </Typography>
        </Paper>
      )}

      {questionHistory.length > 0 && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Questions
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {questionHistory.map((item, index) => (
            <Card key={index} sx={{ mb: 2, bgcolor: 'grey.50' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Question #{questionHistory.length - index}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatTimestamp(item.timestamp)}
                  </Typography>
                </Box>
                
                <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                  Q: {item.question}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  A: {item.answer}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Paper>
      )}
    </Container>
  );
}

export default UserDashboard;