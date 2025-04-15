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
import { useUser } from "@clerk/clerk-react";
import { db } from "../../../firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { ref, onValue, push } from "firebase/database"; // Import Realtime Database functions
import { realtimeDb } from "../../../firebase"; // Import the Realtime Database instance
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/themes/prism.css";

const CodeSnippet = ({ snippet }) => {
  const { user } = useUser();
  const [likes, setLikes] = useState(snippet.likes.length);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(snippet.likes.includes(user.id));
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (!snippet.id) return;

    const commentsRef = ref(realtimeDb, `codeSnippets/${snippet.id}/comments`);
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      const commentsArray = data ? Object.values(data) : [];
      setComments(commentsArray); // Update comments state with real-time data
    });

    return () => unsubscribe(); // Clean up the listener
  }, [snippet.id]);

  const handleLike = async () => {
    const snippetRef = doc(db, "codeSnippets", snippet.id);
    if (liked) {
      await updateDoc(snippetRef, {
        likes: arrayRemove(user.id)
      });
      setLikes(likes - 1);
    } else {
      await updateDoc(snippetRef, {
        likes: arrayUnion(user.id)
      });
      setLikes(likes + 1);
    }
    setLiked(!liked);
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
      createdAt: new Date().toISOString(), // Add a timestamp
    };

    try {
      await push(commentsRef, newComment); // Push the new comment to the Realtime Database
      setCommentText(""); // Clear the input field
      setAlertMessage("");
    } catch (error) {
      console.error("Error adding comment: ", error);
      setAlertMessage("Failed to add comment. Please try again.");
    }
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
        avatar={<Avatar src={snippet.userProfilePic} />}
        title={
          <Typography sx={{ color: "#ffb17a" }}>{snippet.userName}</Typography>
        }
        subheader={
          <Typography sx={{ color: "#C17B49" }}>
            {new Date(snippet.createdAt.seconds * 1000).toLocaleDateString()}
          </Typography>
        }
      />
      <CardContent>
        <Typography variant="h6" sx={{ color: "#ffb17a" }}>
          {snippet.description}
        </Typography>
        <Typography variant="body2" sx={{ color: "#C17B49", mt: 1 }}>
          Language: {snippet.language || "Unknown"} {/* Display the language */}
        </Typography>
        <Box sx={{ overflowY: "scroll", maxHeight: "250px", backgroundColor: "#424769", p: 2, mt: 2 }}>
          <Editor
            value={snippet.code}
            onValueChange={() => {}}
            highlight={(code) => highlight(code, languages[snippet.language] || languages.javascript, snippet.language)}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 14,
              backgroundColor: "#424769",
              color: "#ffffff",
              border: "1px solid #676f9d",
              borderRadius: "4px",
              minHeight: "200px",
              whiteSpace: "collapse", 
            }}
            readOnly
          />
        </Box>
      </CardContent>
      <CardActions
        disableSpacing
        sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
      >
        <IconButton onClick={handleLike}>
          <FavoriteIcon sx={{ color: liked ? "#ffb17a" : "#ffffff" }} />
          <Typography sx={{ color: "#ffffff" }}>&nbsp; {likes}</Typography>
        </IconButton>
      </CardActions>
      <CardContent>
        <TextField
          label="Add a code review..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ style: { color: "#C17B49" } }}
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
          startIcon={<CommentIcon />}
          variant="contained"
          sx={{ backgroundColor: "#ffb17a", color: "#000000" }}
        >
          Review Code
        </Button>
        {alertMessage && <Alert severity="error" sx={{ mt: 2 }}>{alertMessage}</Alert>}
        {comments.map((comment, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 2,
              backgroundColor: "#424769",
              p: 1,
              borderRadius: "4px",
            }}
          >
            <Avatar src={comment.userAvatar} sx={{ mr: 2 }} />
            <Box>
              <Typography variant="body2" sx={{ color: "#ffb17a", fontWeight: "bold" }}>
                {comment.userName}
              </Typography>
              <Typography variant="body2" sx={{ color: "#ffffff" }}>
                {comment.text}
              </Typography>
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default CodeSnippet;
