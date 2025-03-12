import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { db } from '../../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Box, Typography, Avatar, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BlogPost from '../BlogPosts/BlogPost';

const Myaccount = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showPosts, setShowPosts] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const postsQuery = query(collection(db, 'posts'), where('userId', '==', user.id));
        const postsSnapshot = await getDocs(postsQuery);
        setPosts(postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const likesQuery = query(collection(db, 'posts'), where('likes', 'array-contains', user.id));
        const likesSnapshot = await getDocs(likesQuery);
        setLikes(likesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const reviewsQuery = query(collection(db, 'posts'), where('reviews', 'array-contains', { userId: user.id }));
        const reviewsSnapshot = await getDocs(reviewsQuery);
        setReviews(reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      };
      fetchUserData();
    }
  }, [user]);

  const handleShowPostsClick = () => {
    setShowPosts(!showPosts);
  };

  const handleShowLikesClick = () => {
    setShowLikes(!showLikes);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar src={user.profileImageUrl} sx={{ mr: 2 }} />
        <Typography variant="h5" sx={{ color: '#ffb17a' }}>{user.fullName}</Typography>
      </Box>
      <Typography variant="h6" sx={{ color: '#ffb17a', mb: 2 }}>My Posts ({posts.length})</Typography>
      <Button onClick={handleShowPostsClick} sx={{ color: '#ffb17a' }}>
        {showPosts ? 'Hide Posts' : 'Show Posts'}
      </Button>
      {showPosts && (
        <Box>
          {posts.map(post => (
            <React.Fragment key={post.id}>
              <BlogPost post={post} />
              <Divider />
            </React.Fragment>
          ))}
        </Box>
      )}
      <Typography variant="h6" sx={{ color: '#ffb17a', mt: 4, mb: 2 }}>Posts I Liked ({likes.length})</Typography>
      <Button onClick={handleShowLikesClick} sx={{ color: '#ffb17a' }}>
        {showLikes ? 'Hide Liked Posts' : 'Show Liked Posts'}
      </Button>
      {showLikes && (
        <Box>
          {likes.map(post => (
            <React.Fragment key={post.id}>
              <BlogPost post={post} />
              <Divider />
            </React.Fragment>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Myaccount;