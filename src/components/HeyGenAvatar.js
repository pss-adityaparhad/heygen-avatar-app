import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Tooltip,
  IconButton,
  Fade,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import styles from '../styles/HeyGenAvatar.module.css';

function HeyGenAvatar() {
  const [text, setText] = useState('');
  const [videoUrl, setVideoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setText(speechResult);
      generateAvatarVideo(speechResult); // Trigger video generation immediately
    };
    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  const generateAvatarVideo = async (inputText) => {
    if (!inputText) {
      alert('Please enter some text or use voice input!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://api.heygen.com/v2/video/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': `ZjdjYjhkYzgyYmI1NGM3ZGJmMWY2ZmM5OTU5YjRjMTQtMTczMTU2NTYxNw==`, // Replace with your HeyGen API key
        },
        body: JSON.stringify({
          text: inputText,
          avatar: 'nik_expressive_20240910', // Replace with your HeyGen avatar ID
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setVideoUrl(data.videoUrl); // Display video as soon as it's available
      } else {
        console.error('Error in API response:', data);
      }
    } catch (error) {
      console.error('Error generating avatar video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className={styles.box}>
      <Typography variant="h5" gutterBottom color="primary" className={styles.title}>
        Real-Time HeyGen Conversation
      </Typography>

      <TextField
        label="Type your question"
        variant="outlined"
        fullWidth
        multiline
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={styles.textField}
      />

      <Box className={styles.controls}>
        <Tooltip title="Record Voice" placement="top">
          <IconButton color="primary" onClick={handleVoiceInput} disabled={isRecording}>
            {isRecording ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
        </Tooltip>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => generateAvatarVideo(text)}
          className={styles.generateButton}
          disabled={isLoading || isRecording}
        >
          Generate Response
        </Button>
      </Box>

      {isLoading && (
        <Box display="flex" justifyContent="center" marginY={2}>
          <CircularProgress />
          <Typography variant="caption" color="textSecondary" className={styles.loadingText}>
            Generating Response...
          </Typography>
        </Box>
      )}

      {videoUrl && (
        <Fade in={!!videoUrl}>
          <Box className={styles.videoContainer}>
            <Typography variant="h6" color="primary">
              Avatar Response
            </Typography>
            <video width="400" controls className={styles.video}>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        </Fade>
      )}
    </Box>
  );
}

export default HeyGenAvatar;
