import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from "@mui/icons-material/Favorite";
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
import { ref, onValue, push } from "firebase/database"; // Import Realtime Database functions
import { realtimeDb } from "../../../firebase"; // Import the Realtime Database instance

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

  return (
    <Box sx={{ mb: 4, p: 2, border: "1px solid #676f9d", borderRadius: "8px" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar src={post.userProfilePic} sx={{ mr: 2 }} onClick={handleProfileClick} style={{ cursor: 'pointer' }} />
        <Typography variant="h6" sx={{ color: "#ffffff", cursor: 'pointer' }} onClick={handleProfileClick}>
          {post.userName}
        </Typography>
        {user.id !== post.userId && (
          <Button
            onClick={handleFollow}
            variant="contained"
            sx={{
              ml: 2,
              backgroundColor: isFollowing ? "#ffb17a" : "#676f9d",
              color: "#000000",
            }}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        )}
      </Box>
      <Typography variant="h6" sx={{ color: "#ffffff" }}>
        {post.title}
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "#ffffff" }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <Typography variant="body2" sx={{ color: "#ffffff" }}>
        Tags: {post.tags.join(", ")}
      </Typography>
      <Typography variant="body2" sx={{ color: "#ffffff" }}>
        Hashtags: {post.hashtags.join(", ")}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <IconButton
          onClick={handleLike}
          sx={{
            color:
              Array.isArray(post.likes) && post.likes.includes(user.id)
                ? "#ffb17a"
                : "#ffffff",
          }}
        >
          <FavoriteIcon /> <Typography sx={{ color: "#ffffff" }}>&nbsp;{" "}
          {Array.isArray(post.likes) ? post.likes.length : 0}</Typography>
        </IconButton>
      </Box>
      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Add a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          InputLabelProps={{ style: { color: "#ffffff" } }}
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
        <Button
          onClick={handleComment}
          variant="contained"
          startIcon={<CommentIcon />}
          sx={{ backgroundColor: "#ffb17a", color: "#000000" }}
        >
          Comment
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" sx={{ color: "#ffffff" }}>
          Comments:
        </Typography>
        {comments.map((comment, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Avatar src={comment.userProfilePic} sx={{ mr: 2 }} />
            <Typography variant="body2" sx={{ color: "#676f9d" }}>
              <strong>{comment.userName}:</strong> {comment.comment}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default BlogPost;
