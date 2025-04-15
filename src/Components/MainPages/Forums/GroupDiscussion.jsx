import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import { useUser } from '@clerk/clerk-react';
import { Box, TextField, Button, Typography, Avatar, Alert } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommentSection from './CommentSection';

const GroupDiscussion = ({ groupId, groupName }) => {
  const { user } = useUser();
  const [topic, setTopic] = useState('');
  const [details, setDetails] = useState('');
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const db = getDatabase();
    const questionsRef = ref(db, `groups/${groupId}/questions`);

    // Fetch questions from Firebase
    const unsubscribe = onValue(
      questionsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const questionsList = Object.entries(data).map(([id, value]) => ({ id, ...value }));
          setQuestions(questionsList);
        } else {
          setQuestions([]); // Clear questions if no data exists
        }
        setError(null); // Clear any previous errors
      },
      (error) => {
        console.error('Error fetching questions:', error);
        setError('Failed to fetch questions. Please check your database connection.');
      }
    );

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [groupId]);

  const handlePostQuestion = async () => {
    if (!topic.trim() || !details.trim()) {
      toast.error('Both fields are required.', { position: 'top-right', autoClose: 3000 });
      return;
    }

    if (!user) {
      toast.error('You must be logged in to post a question.', { position: 'top-right', autoClose: 3000 });
      return;
    }

    try {
      const db = getDatabase();
      const questionsRef = ref(db, `groups/${groupId}/questions`);

      // Push the new question to Firebase
      const newQuestion = {
        userId: user.id,
        userName: user.fullName,
        userProfilePic: user.profileImageUrl || '',
        topic,
        details,
        createdAt: new Date().toISOString(),
      };

      await push(questionsRef, newQuestion);

      // Clear input fields
      setTopic('');
      setDetails('');
      toast.success('Question posted successfully!', { position: 'top-right', autoClose: 3000 });
    } catch (error) {
      console.error('Error posting question:', error);
      toast.error('Failed to post question. Please try again.', { position: 'top-right', autoClose: 3000 });
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <ToastContainer />
      <Typography variant="h4" sx={{ color: '#ffb17a', marginBottom: '20px' }}>
        Group Discussion: {groupName}
      </Typography>
      <Box
        component="form"
        sx={{
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handlePostQuestion();
        }}
      >
        <Typography variant="h5" sx={{ color: '#ffb17a', marginBottom: '10px' }}>
          Post a Question
        </Typography>
        <TextField
          fullWidth
          label="Topic of your question"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          InputLabelProps={{ style: { color: '#C17B49' } }}
          InputProps={{ style: { color: '#ffffff', borderColor: '#ffb17a' } }}
          sx={{
            marginBottom: '20px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#676f9d' },
              '&:hover fieldset': { borderColor: '#ffb17a' },
              '&.Mui-focused fieldset': { borderColor: '#ffb17a' },
            },
          }}
        />
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Write your question in detail"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          InputLabelProps={{ style: { color: '#C17B49' } }}
          InputProps={{ style: { color: '#ffffff', borderColor: '#ffb17a' } }}
          sx={{
            marginBottom: '20px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#676f9d' },
              '&:hover fieldset': { borderColor: '#ffb17a' },
              '&.Mui-focused fieldset': { borderColor: '#ffb17a' },
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ backgroundColor: '#ffb17a', color: '#000000' }}
        >
          Post Question
        </Button>
      </Box>
      <Box>
        <Typography variant="h5" sx={{ color: '#ffb17a', marginBottom: '20px' }}>
          Questions
        </Typography>
        {error && <Alert severity="error" sx={{ marginBottom: '20px' }}>{error}</Alert>}
        {questions.map((question) => (
          <Box
            key={question.id}
            sx={{
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              color: '#fff', borderColor: "#676f9d", borderWidth: "1px", borderStyle: "solid",
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <Avatar
                src={question.userProfilePic}
                alt="User"
                sx={{ width: '40px', height: '40px', marginRight: '10px' }}
              />
              <Typography variant="h6" sx={{ color: '#ffb17a' }}>
                {question.userName}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ color: '#ffb17a' }}>
              {question.topic}
            </Typography>
            <Typography variant="body1" sx={{ color: '#ffffff', marginBottom: '10px' }}>
              {question.details}
            </Typography>
            <Typography variant="body2" sx={{ color: '#676f9d' }}>
              Posted on: {new Date(question.createdAt).toLocaleString()}
            </Typography>

            {/* Add Comment Section */}
            <CommentSection questionId={question.id} groupId={groupId} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default GroupDiscussion;