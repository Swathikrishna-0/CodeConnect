import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { Box, Typography, Avatar, Button, Divider, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BlogPost from '../BlogPosts/BlogPost';
import DeleteIcon from '@mui/icons-material/Delete';
import CodeSnippet from '../CodeSnippet/Codesnippet';
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Myaccount = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [codeSnippets, setCodeSnippets] = useState([]); // State for code snippets
  const [likedCodeSnippets, setLikedCodeSnippets] = useState([]); // State for liked code snippets
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]); // State for bookmarked posts
  const [bookmarkedCodeSnippets, setBookmarkedCodeSnippets] = useState([]); // State for bookmarked code snippets
  const [showPosts, setShowPosts] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [showCodeSnippets, setShowCodeSnippets] = useState(false); // State for toggling code snippets
  const [showLikedCodeSnippets, setShowLikedCodeSnippets] = useState(false); // State for toggling liked code snippets
  const [showBookmarkedPosts, setShowBookmarkedPosts] = useState(false); // State for toggling bookmarked posts
  const [showBookmarkedCodeSnippets, setShowBookmarkedCodeSnippets] = useState(false); // State for toggling bookmarked code snippets
  const [following, setFollowing] = useState([]); // State for following users
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const postsQuery = query(collection(db, 'posts'), where('userId', '==', user.uid));
        const postsSnapshot = await getDocs(postsQuery);
        setPosts(postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const likesQuery = query(collection(db, 'posts'), where('likes', 'array-contains', user.uid));
        const likesSnapshot = await getDocs(likesQuery);
        setLikes(likesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const reviewsQuery = query(collection(db, 'posts'), where('reviews', 'array-contains', { userId: user.uid }));
        const reviewsSnapshot = await getDocs(reviewsQuery);
        setReviews(reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const codeSnippetsQuery = query(collection(db, 'codeSnippets'), where('userId', '==', user.uid));
        const codeSnippetsSnapshot = await getDocs(codeSnippetsQuery);
        setCodeSnippets(codeSnippetsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const likedCodeSnippetsQuery = query(
          collection(db, 'codeSnippets'),
          where('likes', 'array-contains', user.uid)
        );
        const likedCodeSnippetsSnapshot = await getDocs(likedCodeSnippetsQuery);
        setLikedCodeSnippets(
          likedCodeSnippetsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

        const bookmarkedPostsQuery = query(
          collection(db, 'posts'),
          where('bookmarks', 'array-contains', user.uid)
        );
        const bookmarkedPostsSnapshot = await getDocs(bookmarkedPostsQuery);
        setBookmarkedPosts(
          bookmarkedPostsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

        const bookmarkedCodeSnippetsQuery = query(
          collection(db, 'codeSnippets'),
          where('bookmarks', 'array-contains', user.uid)
        );
        const bookmarkedCodeSnippetsSnapshot = await getDocs(bookmarkedCodeSnippetsQuery);
        setBookmarkedCodeSnippets(
          bookmarkedCodeSnippetsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      };
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchFollowing = async () => {
        const q = query(
          collection(db, "followers"),
          where("followerId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const followingList = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const followData = doc.data();
            const profileRef = doc(db, "profiles", followData.followingId);
            const profileSnap = await getDoc(profileRef);
            return {
              followingId: followData.followingId,
              followingName: profileSnap.exists() ? profileSnap.data().firstName : "Unknown",
              followingProfilePic: profileSnap.exists() ? profileSnap.data().profilePic : "/default-avatar.png",
            };
          })
        );
        setFollowing(followingList);
      };
      fetchFollowing();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const docRef = doc(db, "profiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const profileData = docSnap.data();
          user.displayName = profileData.firstName || user.displayName; // Update displayName
          user.photoURL = profileData.profilePic || user.photoURL; // Update photoURL
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleDeleteCodeSnippet = async (snippetId) => {
    try {
      await deleteDoc(doc(db, 'codeSnippets', snippetId));
      setCodeSnippets((prevSnippets) => prevSnippets.filter((snippet) => snippet.id !== snippetId));
    } catch (error) {
      console.error('Error deleting code snippet:', error);
    }
  };

  const handleShowPostsClick = () => {
    setShowPosts(!showPosts);
  };

  const handleShowLikesClick = () => {
    setShowLikes(!showLikes);
  };

  const handleShowCodeSnippetsClick = () => {
    setShowCodeSnippets(!showCodeSnippets);
  };

  const handleShowLikedCodeSnippetsClick = () => {
    setShowLikedCodeSnippets(!showLikedCodeSnippets);
  };

  const handleShowBookmarkedPostsClick = () => {
    setShowBookmarkedPosts(!showBookmarkedPosts);
  };

  const handleShowBookmarkedCodeSnippetsClick = () => {
    setShowBookmarkedCodeSnippets(!showBookmarkedCodeSnippets);
  };

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: "#202338",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        maxWidth: "800px",
        margin: "auto",
        color: "#ffffff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
          backgroundColor: "#2c2f48",
          p: 2,
          borderRadius: "8px",
        }}
       
      >
        <Avatar
          src={user?.photoURL || "/default-avatar.png"}
          sx={{ width: 80, height: 80, mr: 3, border: "2px solid #ffb17a" }}
        />
        <Box>
          <Typography variant="h5" sx={{ color: "#ffb17a", fontWeight: "bold" }}>
            {user?.displayName || user?.email.split("@")[0] || "Anonymous"} {/* Extract username from email */}
          </Typography>
          <Typography variant="body2" sx={{ color: "#d1d1e0" }}>
            {user?.email}
          </Typography>
        </Box>
      </Box>

      {[
        {
          title: "My Posts",
          count: posts.length,
          show: showPosts,
          toggle: handleShowPostsClick,
          items: posts,
          component: BlogPost,
          deleteHandler: handleDeletePost,
        },
        {
          title: "Posts I Liked",
          count: likes.length,
          show: showLikes,
          toggle: handleShowLikesClick,
          items: likes,
          component: BlogPost,
        },
        {
          title: "My Code Snippets",
          count: codeSnippets.length,
          show: showCodeSnippets,
          toggle: handleShowCodeSnippetsClick,
          items: codeSnippets,
          component: CodeSnippet,
          deleteHandler: handleDeleteCodeSnippet,
        },
        {
          title: "Code Snippets I Liked",
          count: likedCodeSnippets.length,
          show: showLikedCodeSnippets,
          toggle: handleShowLikedCodeSnippetsClick,
          items: likedCodeSnippets,
          component: CodeSnippet,
        },
        {
          title: "Bookmarked Posts",
          count: bookmarkedPosts.length,
          show: showBookmarkedPosts,
          toggle: handleShowBookmarkedPostsClick,
          items: bookmarkedPosts,
          component: BlogPost,
        },
        {
          title: "Bookmarked Code Snippets",
          count: bookmarkedCodeSnippets.length,
          show: showBookmarkedCodeSnippets,
          toggle: handleShowBookmarkedCodeSnippetsClick,
          items: bookmarkedCodeSnippets,
          component: CodeSnippet,
        },
      ].map((section, index) => (
        <Box
          key={index}
          sx={{
            mb: 4,
            backgroundColor: "#2c2f48",
            p: 3,
            borderRadius: "8px",
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "#ffb17a", fontWeight: "bold", mb: 2 }}
          >
            {section.title} ({section.count})
          </Typography>
          <Button
            onClick={section.toggle}
            sx={{
              color: "#000000",
              backgroundColor: "#ffb17a",
              "&:hover": { backgroundColor: "#e6a963" },
              mb: 2,
            }}
          >
            {section.show ? `Hide ${section.title}` : `Show ${section.title}`}
          </Button>
          {section.show && (
            <Box>
              {section.items.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    position: "relative",
                    borderRadius: "8px",
                    p: 1, // Add padding for better layout
                  }}
                >
                  {section.deleteHandler && (
                    <IconButton
                      onClick={() => section.deleteHandler(item.id)}
                      sx={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                        color: "#fff",
                        p:2,
                        m:2,
                        backgroundColor: "#424769",
                        "&:hover": { color: "#ffb17a",backgroundColor: "#424769", },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                  <Box sx={{ mt: 4 }}>
                    <section.component {...{ [section.component === BlogPost ? "post" : "snippet"]: item }} />
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default Myaccount;