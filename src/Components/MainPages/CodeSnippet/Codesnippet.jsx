import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardActions, Avatar, IconButton, Typography, TextField, Button, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from '@mui/icons-material/Comment';

const CodeSnippet = ({ snippet }) => {
  const [likes, setLikes] = useState(snippet.likes.length);
  const [comments, setComments] = useState(snippet.comments);
  const [commentText, setCommentText] = useState('');

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleComment = () => {
    setComments([...comments, commentText]);
    setCommentText('');
  };

  const handleShare = () => {
    // Implement share functionality
  };

  return (
    <Card sx={{ marginBottom: 2, backgroundColor: 'transparent', border: '1px solid #676f9d' }}>
      <CardHeader
        avatar={<Avatar src={snippet.userProfilePic} />}
        title={<Typography sx={{ color: '#ffb17a' }}>{snippet.userName}</Typography>}
        subheader={<Typography sx={{ color: '#C17B49' }}>{new Date(snippet.createdAt.seconds * 1000).toLocaleDateString()}</Typography>}
      />
      <CardContent>
        <Typography variant="h6" sx={{ color: '#ffb17a' }}>{snippet.description}</Typography>
        <Box sx={{ overflowY: 'scroll', maxHeight: '250px' }}>
          <Typography variant="body2" color="textSecondary" component="pre" sx={{ whiteSpace: 'pre-wrap', color: '#ffffff' }}>
            {snippet.code}
          </Typography>
        </Box>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={handleLike}>
          <FavoriteIcon sx={{ color: likes > 0 ? '#ffb17a' : '#ffffff' }} />
        </IconButton>
        <Typography sx={{ color: '#ffffff' }}>{likes}</Typography>
        <IconButton onClick={handleShare}>
          <ShareIcon sx={{ color: '#ffffff' }} />
        </IconButton>
      </CardActions>
      <CardContent>
        <TextField
          label="Add a comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ style: { color: '#C17B49' } }}
          InputProps={{ style: { color: '#ffffff', borderColor: '#ffb17a' } }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#676f9d' },
              '&:hover fieldset': { borderColor: '#ffb17a' },
              '&.Mui-focused fieldset': { borderColor: '#ffb17a' },
            },
          }}
        />
        <Button onClick={handleComment} startIcon={<CommentIcon />} variant="contained" sx={{ backgroundColor: '#ffb17a', color: '#000000' }}>
          Comment
        </Button>
        {comments.map((comment, index) => (
          <Typography key={index} variant="body2" sx={{ mt: 2, color: '#ffffff' }}>
            {comment}
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
};

export default CodeSnippet;