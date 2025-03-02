import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { Box, Typography, Button, TextField, IconButton, Avatar, Alert } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { useUser } from '@clerk/clerk-react';

const BlogPost = ({ post }) => {
  const { user } = useUser();
  const [comment, setComment] = useState('');
  const [review, setReview] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfilePic = async () => {
      if (user) {
        const docRef = doc(db, 'profiles', user.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          user.profileImageUrl = data.profilePic || user.profileImageUrl;
        }
      }
    };
    fetchUserProfilePic();
  }, [user]);

  const handleLike = async () => {
    const postRef = doc(db, 'posts', post.id);
    if (Array.isArray(post.likes) && post.likes.includes(user.id)) {
      await updateDoc(postRef, {
        likes: arrayRemove(user.id)
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(user.id)
      });
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) {
      setError('Comment required');
      return;
    }
    const postRef = doc(db, 'posts', post.id);
    await updateDoc(postRef, {
      comments: arrayUnion({ userId: user.id, userName: user.fullName, userProfilePic: user.profileImageUrl, comment })
    });
    setComment('');
    setError('');
  };

  const handleShare = () => {
    // Implement share functionality
  };

  const handleReview = async () => {
    if (!review.trim()) {
      setError('Review required');
      return;
    }
    const postRef = doc(db, 'posts', post.id);
    await updateDoc(postRef, {
      reviews: arrayUnion({ userId: user.id, userName: user.fullName, userProfilePic: user.profileImageUrl, review })
    });
    setReview('');
    setError('');
  };

  return (
    <Box sx={{ mb: 4, p: 2, border: '1px solid #676f9d', borderRadius: '8px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar src={post.userProfilePic} sx={{ mr: 2 }} />
        <Typography variant="h6" sx={{ color: '#ffb17a' }}>{post.userName}</Typography>
      </Box>
      <Typography variant="h6" sx={{ color: '#ffb17a' }}>{post.title}</Typography>
      <Typography variant="body1" sx={{ color: '#ffffff' }} dangerouslySetInnerHTML={{ __html: post.content }} />
      <Typography variant="body2" sx={{ color: '#676f9d' }}>Tags: {post.tags.join(', ')}</Typography>
      <Typography variant="body2" sx={{ color: '#676f9d' }}>Hashtags: {post.hashtags.join(', ')}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <IconButton onClick={handleLike} sx={{ color: Array.isArray(post.likes) && post.likes.includes(user.id) ? '#ffb17a' : '#676f9d' }}>
          <ThumbUpIcon /> &nbsp; {Array.isArray(post.likes) ? post.likes.length : 0}
        </IconButton>
        <IconButton onClick={handleShare} sx={{ color: '#ffb17a' }}>
          <ShareIcon />
        </IconButton>
      </Box>
      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Add a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          InputLabelProps={{ style: { color: "#C17B49" } }}
          InputProps={{ style: { color: "#ffffff", borderColor: "#ffb17a" } }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#676f9d" },
              "&:hover fieldset": { borderColor: "#ffb17a" },
              "&.Mui-focused fieldset": { borderColor: "#ffb17a" },
            },
          }}
        />
        <Button onClick={handleComment} variant="contained" sx={{ backgroundColor: '#ffb17a', color: '#000000' }}>
          Comment
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Add a review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          InputLabelProps={{ style: { color: "#C17B49" } }}
          InputProps={{ style: { color: "#ffffff", borderColor: "#ffb17a" } }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#676f9d" },
              "&:hover fieldset": { borderColor: "#ffb17a" },
              "&.Mui-focused fieldset": { borderColor: "#ffb17a" },
            },
          }}
        />
        <Button onClick={handleReview} variant="contained" sx={{ backgroundColor: '#ffb17a', color: '#000000' }}>
          Review
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" sx={{ color: '#ffffff' }}>Comments:</Typography>
        {post.comments.map((comment, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar src={comment.userProfilePic} sx={{ mr: 2 }} />
            <Typography variant="body2" sx={{ color: '#676f9d' }}>
              <strong>{comment.userName}:</strong> {comment.comment}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" sx={{ color: '#ffffff' }}>Reviews:</Typography>
        {post.reviews.map((review, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar src={review.userProfilePic} sx={{ mr: 2 }} />
            <Typography variant="body2" sx={{ color: '#676f9d' }}>
              <strong>{review.userName}:</strong> {review.review}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default BlogPost;