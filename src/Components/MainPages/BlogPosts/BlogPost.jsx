import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { db } from "../../../firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Avatar,
  Alert,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import { ref, onValue, push } from "firebase/database";
import { realtimeDb } from "../../../firebase";
import { auth } from "../../../firebase"; // Import Firebase auth

const BlogPost = ({ post }) => {
  const user = auth.currentUser; // Get the current user from Firebase
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchUserProfilePic = async () => {
      if (user) {
        const docRef = doc(db, "profiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          user.profileImageUrl = data.profilePic || user.profileImageUrl;
        }
      }
    };
    fetchUserProfilePic();
  }, [user]);

  useEffect(() => {
    const checkFollowing = async () => {
      if (user && user.uid !== post.userId) {
        const followRef = doc(db, "followers", `${user.uid}_${post.userId}`);
        const followSnap = await getDoc(followRef);
        setIsFollowing(followSnap.exists());
      }
    };
    checkFollowing();
  }, [user, post.userId]);

  useEffect(() => {
    if (!post.id) return;

    const commentsRef = ref(realtimeDb, `blogPosts/${post.id}/comments`);
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      const commentsArray = data ? Object.values(data) : [];
      setComments(commentsArray); // Update comments state with real-time data
    });

    return () => unsubscribe(); // Clean up the listener
  }, [post.id]);

  const handleLike = async () => {
    const postRef = doc(db, "posts", post.id);
    if (Array.isArray(post.likes) && post.likes.includes(user.uid)) {
      await updateDoc(postRef, { likes: arrayRemove(user.uid) });
    } else {
      await updateDoc(postRef, { likes: arrayUnion(user.uid) });
    }
  };

  const handleBookmark = async () => {
    const postRef = doc(db, "posts", post.id);
    if (Array.isArray(post.bookmarks) && post.bookmarks.includes(user.uid)) {
      await updateDoc(postRef, { bookmarks: arrayRemove(user.uid) });
    } else {
      await updateDoc(postRef, { bookmarks: arrayUnion(user.uid) });
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) {
      setError("Comment required");
      return;
    }

    const commentsRef = ref(realtimeDb, `blogPosts/${post.id}/comments`);
    const newComment = {
      userId: user.uid,
      userName: user.displayName || "Anonymous",
      userProfilePic: user.photoURL || "/default-avatar.png",
      comment,
      createdAt: new Date().toISOString(),
    };

    try {
      await push(commentsRef, newComment);
      setComment("");
      setError("");
    } catch (error) {
      console.error("Error adding comment: ", error);
      setError("Failed to add comment. Please try again.");
    }
  };

  const handleFollow = async () => {
    if (!user || user.uid === post.userId) return; // Prevent following self
    const followRef = doc(db, "followers", `${user.uid}_${post.userId}`);
    if (isFollowing) {
      await deleteDoc(followRef);
      setIsFollowing(false);
    } else {
      await setDoc(followRef, {
        followerId: user.uid,
        followingId: post.userId,
      });
      setIsFollowing(true);
    }
  };

  const handleProfileClick = () => {
    navigate(`/profile/${post.userId}`);
  };

  const handleViewPost = () => {
    navigate(`/feed/blogposts/${post.id}`); // Navigate to BlogPostDetail
  };

  return (
    <Box sx={{ mb: 4, p: 2, border: "0.5px solid #676f9d", borderRadius: "8px", backgroundColor: "#1a1a2e" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar
          src={post.userProfilePic}
          sx={{ mr: 2, cursor: "pointer" }}
          onClick={() => navigate(`/profile/${post.userId}`)} // Redirect to public profile
        />
        <Box>
          <Typography
            variant="body1"
            sx={{ color: "#ffffff", cursor: "pointer" }}
            onClick={() => navigate(`/profile/${post.userId}`)} // Redirect to public profile
          >
            {post.userName}
          </Typography>
          <Typography variant="body2" sx={{ color: "#676f9d", fontSize: "0.9rem" }}>
            {new Date(post.createdAt.seconds * 1000).toLocaleString()}
          </Typography>
        </Box>
      </Box>
      <Typography
        variant="h6"
        sx={{
          color: "#ffffff",
          cursor: "pointer",
          textDecoration: "underline",
          mb: 1,
          "&:hover": {
            color: "#ffb17a",
          },
        }}
        onClick={handleViewPost}
      >
        {post.title}
      </Typography>
      <Typography variant="body2" sx={{ color: "#ffb17a", mb: 2 }}>
        {post.hashtags && post.hashtags.length > 0
          ? post.hashtags.map((hashtag) => `#${hashtag}`).join(" ")
          : ""}
      </Typography>
      <hr style={{ height: "1px", border: "none", backgroundColor: "#676f9d" }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Typography sx={{ ml: 1, color: "#ffffff" }}>
          <IconButton
            onClick={handleLike}
            sx={{
              color:
                Array.isArray(post.likes) && post.likes.includes(user.uid)
                  ? "#ffb17a"
                  : "#ffffff",
            }}
          >
            <FavoriteIcon />
          </IconButton>
          {Array.isArray(post.likes) ? post.likes.length : 0} Likes
        </Typography>
        <Typography sx={{ ml: 1, color: "#ffffff" }}>
          <IconButton
            onClick={handleBookmark}
            sx={{
              ml: 2,
              color:
                Array.isArray(post.bookmarks) && post.bookmarks.includes(user.uid)
                  ? "#ffb17a"
                  : "#ffffff",
            }}
          >
            <BookmarkIcon />
          </IconButton>
          {Array.isArray(post.bookmarks) ? post.bookmarks.length : 0} Bookmarks
        </Typography>
      </Box>
    </Box>
  );
};

export default BlogPost;
