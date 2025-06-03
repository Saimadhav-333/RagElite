import { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Alert,
  LinearProgress,
  Card,
  CardContent,
  Chip
} from '@mui/material';
// Icons removed - install @mui/icons-material if you want to use them

function AdminDashboard() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError('');
    setSuccess('');
  };

  const removeFile = () => {
    setFile(null);
    setError('');
    setSuccess('');
  };

  const uploadPdf = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    
    setUploading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:5000/api/model/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSuccess('PDF uploaded and processed successfully!');
      setFile(null);
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Admin Dashboard
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            PDF Upload & Processing
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <input
              accept=".pdf"
              style={{ display: 'none' }}
              id="pdf-upload-input"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="pdf-upload-input">
              <Button
                variant="outlined"
                component="span"
                sx={{ mr: 2 }}
                disabled={uploading}
              >
                📁 Select PDF File
              </Button>
            </label>
          </Box>

          {file && (
            <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    📄 
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {file.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatFileSize(file.size)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label="PDF" size="small" color="error" />
                    <Button 
                      onClick={removeFile} 
                      size="small" 
                      disabled={uploading}
                      color="error"
                      variant="text"
                    >
                      🗑️
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {uploading && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Uploading and processing PDF...
              </Typography>
              <LinearProgress />
            </Box>
          )}

          <Button
            variant="contained"
            onClick={uploadPdf}
            disabled={!file || uploading}
            size="large"
          >
            {uploading ? 'Processing...' : '⬆️ Upload & Process PDF'}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}

export default AdminDashboard;