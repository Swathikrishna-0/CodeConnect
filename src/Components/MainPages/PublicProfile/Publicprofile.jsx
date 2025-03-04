import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../firebase';
import { doc, getDoc, query, where, getDocs, collection } from 'firebase/firestore';
import { Box, Typography, Avatar, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useUser } from '@clerk/clerk-react';

const Publicprofile = () => {
  const { userId } = useParams();
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const docRef = doc(db, 'profiles', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    };

    const fetchPosts = async () => {
      const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
      const postsSnapshot = await getDocs(postsQuery);
      setPosts(postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const checkFollowing = async () => {
      if (user) {
        const docRef = doc(db, 'followers', `${user.id}_${userId}`);
        const docSnap = await getDoc(docRef);
        setIsFollowing(docSnap.exists());
      }
    };

    fetchProfile();
    fetchPosts();
    checkFollowing();
  }, [userId, user]);

  const handleFollow = async () => {
    const followRef = doc(db, 'followers', `${user.id}_${userId}`);
    if (isFollowing) {
      await deleteDoc(followRef);
    } else {
      await setDoc(followRef, {
        followerId: user.id,
        followingId: userId,
      });
    }
    setIsFollowing(!isFollowing);
  };

  if (!profile) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar src={profile.profilePic} sx={{ mr: 2, width: 100, height: 100 }} />
        <Box>
          <Typography variant="h4" sx={{ color: '#ffb17a' }}>{profile.fullName || profile.email}</Typography>
          <Typography variant="h6" sx={{ color: '#676f9d' }}>{profile.role || 'User'}</Typography>
          {user.id !== userId && (
            <Button
              onClick={handleFollow}
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: isFollowing ? '#ffb17a' : '#676f9d',
                color: '#000000',
              }}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </Box>
      </Box>
      <Typography variant="h6" sx={{ color: '#ffb17a', mb: 2 }}>Posts</Typography>
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
    </Box>
  );
};

export default Publicprofile;