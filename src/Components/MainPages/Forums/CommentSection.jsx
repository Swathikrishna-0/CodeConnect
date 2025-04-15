import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import { Box, TextField, Button, Typography } from '@mui/material';

const CommentSection = ({ questionId, groupId }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const commentsRef = ref(db, `groups/${groupId}/questions/${questionId}/comments`);

    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const commentsList = Object.entries(data).map(([id, value]) => ({ id, ...value }));
        setComments(commentsList);
      } else {
        setComments([]);
      }
    });

    return () => unsubscribe();
  }, [groupId, questionId]);

  const handlePostComment = async () => {
    if (!comment.trim()) {
      alert('Comment cannot be empty.');
      return;
    }

    try {
      const db = getDatabase();
      const commentsRef = ref(db, `groups/${groupId}/questions/${questionId}/comments`);

      const newComment = {
        text: comment,
        createdAt: new Date().toISOString(),
      };

      await push(commentsRef, newComment);
      setComment('');
      alert('Comment posted successfully!');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    }
  };

  return (
    <Box sx={{ marginTop: '10px' }}>
      <TextField
        fullWidth
        label="Write a comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ marginBottom: '10px' }}
      />
      <Button
        variant="contained"
        onClick={handlePostComment}
        sx={{ backgroundColor: '#ffb17a', color: '#000000' }}
      >
        Post Comment
      </Button>

      {/* Display Comments */}
      <Box sx={{ marginTop: '20px' }}>
        <Typography variant="h6" sx={{ color: '#ffb17a', marginBottom: '10px' }}>
          Comments
        </Typography>
        {comments.map((comment) => (
          <Box
            key={comment.id}
            sx={{
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '10px',
              backgroundColor: '#2c2c2c',
              color: '#ffffff',
            }}
          >
            <Typography variant="body1" sx={{ marginBottom: '5px' }}>
              {comment.text}
            </Typography>
            <Typography variant="body2" sx={{ color: '#676f9d' }}>
              Posted on: {new Date(comment.createdAt).toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CommentSection;