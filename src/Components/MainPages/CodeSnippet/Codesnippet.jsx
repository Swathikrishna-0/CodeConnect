import React, { useState } from "react";
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
import ShareIcon from "@mui/icons-material/Share";
import CommentIcon from "@mui/icons-material/Comment";
import { useUser } from "@clerk/clerk-react";
import { db } from "../../../firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const CodeSnippet = ({ snippet }) => {
  const { user } = useUser();
  const [likes, setLikes] = useState(snippet.likes.length);
  const [comments, setComments] = useState(snippet.comments);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(snippet.likes.includes(user.id));
  const [alertMessage, setAlertMessage] = useState('');

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

  const handleComment = () => {
    if (commentText.trim() === '') {
      setAlertMessage('Review required');
      setTimeout(() => setAlertMessage(''), 3000);
      return;
    }
    setComments([...comments, commentText]);
    setCommentText('');
  };

  const handleShare = () => {
    // Implement share functionality
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
        <Box sx={{ overflowY: "scroll", maxHeight: "250px", backgroundColor: "#424769", p: 2, mt: 2 }}>
          <Typography
            variant="body2"
            color="textSecondary"
            component="pre"
            sx={{ whiteSpace: "pre-wrap", color: "#ffffff" }}
          >
            {snippet.code}
          </Typography>
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

        <IconButton onClick={handleShare}>
          <ShareIcon sx={{ color: "#ffffff" }} />
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
          <Typography
            key={index}
            variant="body2"
            sx={{ mt: 2, color: "#ffffff" }}
          >
            {comment}
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
};

export default CodeSnippet;
