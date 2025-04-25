import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { db } from "../../../firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { ref, onValue, push } from "firebase/database";
import { realtimeDb } from "../../../firebase";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/themes/prism.css";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";

const CodeSnippet = ({ snippet }) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(snippet.likes.length);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false); // Initialize with false
  const [saved, setSaved] = useState(false); // Initialize with false
  const [alertMessage, setAlertMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setLiked(snippet.likes.includes(currentUser.uid)); // Use `uid` instead of `id`
        setSaved(snippet.bookmarks?.includes(currentUser.uid)); // Use `uid` instead of `id`
      }
    });
    return () => unsubscribe();
  }, [snippet]);

  useEffect(() => {
    if (!snippet.id) return;

    const commentsRef = ref(realtimeDb, `codeSnippets/${snippet.id}/comments`);
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      const commentsArray = data ? Object.values(data) : [];
      setComments(commentsArray);
    });

    return () => unsubscribe();
  }, [snippet.id]);

  const handleLike = async () => {
    if (!user) return; // Ensure user is logged in
    const snippetRef = doc(db, "codeSnippets", snippet.id);
    if (liked) {
      await updateDoc(snippetRef, {
        likes: arrayRemove(user.uid), // Use `uid` instead of `id`
      });
      setLikes(likes - 1);
    } else {
      await updateDoc(snippetRef, {
        likes: arrayUnion(user.uid), // Use `uid` instead of `id`
      });
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  const handleSave = async () => {
    if (!user) return; // Ensure user is logged in
    const snippetRef = doc(db, "codeSnippets", snippet.id);
    if (saved) {
      await updateDoc(snippetRef, {
        bookmarks: arrayRemove(user.uid), // Use `uid` instead of `id`
      });
      setSaved(false);
    } else {
      await updateDoc(snippetRef, {
        bookmarks: arrayUnion(user.uid), // Use `uid` instead of `id`
      });
      setSaved(true);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) {
      setAlertMessage("Review required");
      setTimeout(() => setAlertMessage(""), 3000);
      return;
    }

    const commentsRef = ref(realtimeDb, `codeSnippets/${snippet.id}/comments`);
    const newComment = {
      userId: user.id,
      userName: user.fullName,
      userAvatar: user.profileImageUrl,
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    try {
      await push(commentsRef, newComment);
      setCommentText("");
      setAlertMessage("");
    } catch (error) {
      console.error("Error adding comment: ", error);
      setAlertMessage("Failed to add comment. Please try again.");
    }
  };

  const handleViewSnippet = () => {
    navigate(`/snippet/${snippet.id}`);
  };

  return (
    <Card
      sx={{
        marginBottom: 2,
        backgroundColor: "transparent",
        border: "1px solid #676f9d",
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            src={snippet.userProfilePic}
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(`/profile/${snippet.userId}`)} // Redirect to public profile
          />
        }
        title={
          <Typography
            sx={{ color: "#ffffff", cursor: "pointer" }}
            onClick={() => navigate(`/profile/${snippet.userId}`)} // Redirect to public profile
          >
            {snippet.userName}
          </Typography>
        }
        subheader={
          <Typography sx={{ color: "#ffffff" }}>
            {new Date(snippet.createdAt.seconds * 1000).toLocaleString()}
          </Typography>
        }
      />
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            color: "#ffffff",
            cursor: "pointer",
            textDecoration: "underline",
            mb: 2,
            "&:hover": {
              color: "#ffb17a",
            },
          }}
          onClick={handleViewSnippet}
        >
          {snippet.description}
        </Typography>
        <hr style={{ height: "1px", border: "none", backgroundColor: "#676f9d" }} />
      </CardContent>
      
      <CardActions
        disableSpacing
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <IconButton onClick={handleLike}>
          <FavoriteIcon sx={{ color: liked ? "#ffb17a" : "#ffffff" }} />
          <Typography sx={{ color: "#ffffff" }}>&nbsp; {likes} Likes</Typography>
        </IconButton>
        <IconButton onClick={handleSave}>
          <BookmarkIcon sx={{ color: saved ? "#ffb17a" : "#ffffff" }} />
          <Typography sx={{ color: "#ffffff" }}>
            &nbsp; {snippet.bookmarks?.length || 0} Bookmarks
          </Typography>
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default CodeSnippet;
