import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../firebase';
import { doc, getDoc, query, where, getDocs, collection, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { Box, Typography, Avatar, Button, Divider } from '@mui/material';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import BlogPost from '../BlogPosts/BlogPost';

const Publicprofile = () => {
  const { userId } = useParams();
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

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

    const fetchFollowers = async () => {
      const followersQuery = query(collection(db, 'followers'), where('followingId', '==', userId));
      const followersSnapshot = await getDocs(followersQuery);
      const followersData = await Promise.all(followersSnapshot.docs.map(async doc => {
        const userDoc = await getDoc(doc(db, 'profiles', doc.data().followerId));
        return userDoc.exists() ? { id: doc.data().followerId, name: userDoc.data().fullName || userDoc.data().email } : { id: doc.data().followerId, name: doc.data().followerId };
      }));
      setFollowers(followersData);
    };

    const fetchFollowing = async () => {
      const followingQuery = query(collection(db, 'followers'), where('followerId', '==', userId));
      const followingSnapshot = await getDocs(followingQuery);
      const followingData = await Promise.all(followingSnapshot.docs.map(async doc => {
        const userDoc = await getDoc(doc(db, 'profiles', doc.data().followingId));
        return userDoc.exists() ? { id: doc.data().followingId, name: userDoc.data().fullName || userDoc.data().email } : { id: doc.data().followingId, name: doc.data().followingId };
      }));
      setFollowing(followingData);
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
    fetchFollowers();
    fetchFollowing();
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


  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
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
      <Box>
        {posts.map(post => (
          <React.Fragment key={post.id}>
            <BlogPost post={post} />
            <Divider />
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default Publicprofile;