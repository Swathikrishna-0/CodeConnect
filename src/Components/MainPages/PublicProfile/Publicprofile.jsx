import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../firebase';
import { doc, getDoc, query, where, getDocs, collection } from 'firebase/firestore';
import { Box, Typography, Avatar, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BlogPost from '../BlogPosts/BlogPost';
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import CodeSnippet from "../CodeSnippet/Codesnippet"; // Import CodeSnippet component

const Publicprofile = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [codeSnippets, setCodeSnippets] = useState([]); // State for user's code snippets
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const docRef = doc(db, 'profiles', userId); // Fetch profile of the user whose post was clicked
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const profileData = docSnap.data();

        // Fetch userName from blog posts or code snippets
        let userName = null;
        const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
        const postsSnapshot = await getDocs(postsQuery);
        if (!postsSnapshot.empty) {
          userName = postsSnapshot.docs[0].data().userName; // Use userName from the first blog post
        } else {
          const snippetsQuery = query(collection(db, 'codeSnippets'), where('userId', '==', userId));
          const snippetsSnapshot = await getDocs(snippetsQuery);
          if (!snippetsSnapshot.empty) {
            userName = snippetsSnapshot.docs[0].data().userName; // Use userName from the first code snippet
          }
        }

        // Set profile data
        setProfile({
          firstName: userName || profileData.firstName || profileData.fullName || profileData.email,
          profilePic: profileData.profilePic,
          role: profileData.role || "User",
        });
      }
    };

    const fetchPosts = async () => {
      const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
      const postsSnapshot = await getDocs(postsQuery);
      setPosts(postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchCodeSnippets = async () => {
      const snippetsQuery = query(collection(db, 'codeSnippets'), where('userId', '==', userId));
      const snippetsSnapshot = await getDocs(snippetsQuery);
      setCodeSnippets(snippetsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchProfile();
    fetchPosts();
    fetchCodeSnippets();
  }, [userId]);

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (!profile) {
    return <Typography sx="{color: '#ffffff'}">Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar src={profile.profilePic} sx={{ mr: 2, width: 100, height: 100 }} />
        <Box>
          <Typography variant="h4" sx={{ color: '#ffb17a' }}>
            {profile.firstName}
          </Typography>
          <Typography variant="h6" sx={{ color: '#676f9d' }}>
            {profile.role}
          </Typography>
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
      <Typography variant="h6" sx={{ color: '#ffb17a', mt: 4, mb: 2 }}>Code Snippets</Typography>
      <Box>
        {codeSnippets.map(snippet => (
          <React.Fragment key={snippet.id}>
            <CodeSnippet snippet={snippet} />
            <Divider />
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default Publicprofile;