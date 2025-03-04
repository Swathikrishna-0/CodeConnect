import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { db } from '../../../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Box, Typography, Avatar, List, ListItem, ListItemText, Divider } from '@mui/material';

const Myaccount = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

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

        const followersQuery = query(collection(db, 'followers'), where('followingId', '==', user.id));
        const followersSnapshot = await getDocs(followersQuery);
        const followersData = await Promise.all(followersSnapshot.docs.map(async doc => {
          const userDoc = await getDoc(doc(db, 'profiles', doc.data().followerId));
          return userDoc.exists() ? userDoc.data().fullName || userDoc.data().email : doc.data().followerId;
        }));
        setFollowers(followersData);

        const followingQuery = query(collection(db, 'followers'), where('followerId', '==', user.id));
        const followingSnapshot = await getDocs(followingQuery);
        const followingData = await Promise.all(followingSnapshot.docs.map(async doc => {
          const userDoc = await getDoc(doc(db, 'profiles', doc.data().followingId));
          return userDoc.exists() ? userDoc.data().fullName || userDoc.data().email : doc.data().followingId;
        }));
        setFollowing(followingData);
      };
      fetchUserData();
    }
  }, [user]);

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar src={user.profileImageUrl} sx={{ mr: 2 }} />
        <Typography variant="h5" sx={{ color: '#ffb17a' }}>{user.fullName}</Typography>
      </Box>
      <Typography variant="h6" sx={{ color: '#ffb17a', mb: 2 }}>My Posts</Typography>
      <List>
        {posts.map(post => (
          <React.Fragment key={post.id}>
            <ListItem>
              <ListItemText 
                primary={post.title} 
                secondary={<span dangerouslySetInnerHTML={{ __html: post.content }} />} 
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Typography variant="h6" sx={{ color: '#ffb17a', mt: 4, mb: 2 }}>Posts I Liked</Typography>
      <List>
        {likes.map(post => (
          <React.Fragment key={post.id}>
            <ListItem>
              <ListItemText 
                primary={post.title} 
                secondary={<span dangerouslySetInnerHTML={{ __html: post.content }} />} 
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Typography variant="h6" sx={{ color: '#ffb17a', mt: 4, mb: 2 }}>Followers</Typography>
      <List>
        {followers.map(follower => (
          <React.Fragment key={follower}>
            <ListItem>
              <ListItemText primary={follower} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Typography variant="h6" sx={{ color: '#ffb17a', mt: 4, mb: 2 }}>Following</Typography>
      <List>
        {following.map(following => (
          <React.Fragment key={following}>
            <ListItem>
              <ListItemText primary={following} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default Myaccount;