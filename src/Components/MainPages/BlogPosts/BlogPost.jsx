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
import { useUser } from "@clerk/clerk-react";
import { ref, onValue, push } from "firebase/database";
import { realtimeDb } from "../../../firebase";

const BlogPost = ({ post }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchUserProfilePic = async () => {
      if (user) {
        const docRef = doc(db, "profiles", user.id);
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
      if (user) {
        const docRef = doc(db, "followers", `${user.id}_${post.userId}`);
        const docSnap = await getDoc(docRef);
        setIsFollowing(docSnap.exists());
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
    if (Array.isArray(post.likes) && post.likes.includes(user.id)) {
      await updateDoc(postRef, {
        likes: arrayRemove(user.id),
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(user.id),
      });
    }
  };

  const handleBookmark = async () => {
    const postRef = doc(db, "posts", post.id);
    if (Array.isArray(post.bookmarks) && post.bookmarks.includes(user.id)) {
      await updateDoc(postRef, {
        bookmarks: arrayRemove(user.id),
      });
    } else {
      await updateDoc(postRef, {
        bookmarks: arrayUnion(user.id),
      });
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) {
      setError("Comment required");
      return;
    }

    const commentsRef = ref(realtimeDb, `blogPosts/${post.id}/comments`);
    const newComment = {
      userId: user.id,
      userName: user.fullName,
      userProfilePic: user.profileImageUrl,
      comment,
      createdAt: new Date().toISOString(), // Add a timestamp
    };

    try {
      await push(commentsRef, newComment); // Push the new comment to the Realtime Database
      setComment(""); // Clear the input field
      setError("");
    } catch (error) {
      console.error("Error adding comment: ", error);
      setError("Failed to add comment. Please try again.");
    }
  };

  const handleFollow = async () => {
    if (user.id === post.userId) {
      setError("You cannot follow yourself");
      return;
    }
    const followRef = doc(db, "followers", `${user.id}_${post.userId}`);
    if (isFollowing) {
      await deleteDoc(followRef);
    } else {
      await setDoc(followRef, {
        followerId: user.id,
        followingId: post.userId,
      });
    }
    setIsFollowing(!isFollowing);
  };

  const handleProfileClick = () => {
    navigate(`/profile/${post.userId}`);
  };

  const handleViewPost = () => {
    navigate(`/blog/${post.id}`);
  };

  return (
    <Box sx={{ mb: 4, p: 2, border: "1px solid #676f9d", borderRadius: "8px" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar src={post.userProfilePic} sx={{ mr: 2 }} />
        <Box>
          <Typography variant="body1" sx={{ color: "#ffffff" }}>
            {post.userName}
          </Typography>
          <Typography variant="body2" sx={{ color: "#676f9d" }}>
            {new Date(post.createdAt.seconds * 1000).toLocaleString()}
          </Typography>
        </Box>
      </Box>
      <Typography
        variant="h6"
        sx={{
          color: "#ffffff",
          cursor: "pointer",
          textDecoration: "underline",mb: 2,
        }}
        onClick={handleViewPost}
      >
        {post.title}
      </Typography>
      <hr style={{ height: "1px", border: "none", backgroundColor: "#676f9d" }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Typography sx={{ ml: 1, color: "#ffffff" }}>
          <IconButton
            onClick={handleLike}
            sx={{
              color:
                Array.isArray(post.likes) && post.likes.includes(user.id)
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
                Array.isArray(post.bookmarks) && post.bookmarks.includes(user.id)
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
