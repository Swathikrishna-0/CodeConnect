import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { db } from "../../../firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/themes/prism.css";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";

// CodeSnippet component displays a code snippet card with like/bookmark actions
const CodeSnippet = ({ snippet }) => {
  const navigate = useNavigate();
  // State for like and bookmark status
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const user = auth.currentUser;

  // Set like and bookmark state based on user and snippet data
  useEffect(() => {
    if (user) {
      setLiked(snippet.likes?.includes(user.uid));
      setSaved(snippet.bookmarks?.includes(user.uid));
    }
  }, [user, snippet]);

  // Handle like button click
  const handleLike = async () => {
    if (!user) return;
    const snippetRef = doc(db, "codeSnippets", snippet.id);
    if (liked) {
      await updateDoc(snippetRef, { likes: arrayRemove(user.uid) });
    } else {
      await updateDoc(snippetRef, { likes: arrayUnion(user.uid) });
    }
    setLiked(!liked);
  };

  // Handle bookmark button click
  const handleSave = async () => {
    if (!user) return;
    const snippetRef = doc(db, "codeSnippets", snippet.id);
    if (saved) {
      await updateDoc(snippetRef, { bookmarks: arrayRemove(user.uid) });
    } else {
      await updateDoc(snippetRef, { bookmarks: arrayUnion(user.uid) });
    }
    setSaved(!saved);
  };

  // Navigate to snippet detail page
  const handleViewSnippet = () => {
    navigate(`/feed/codesnippets/${snippet.id}`);
  };

  return (
    // Card for code snippet
    <Card
      sx={{
        mb: 4,
        p: 3,
        borderRadius: "12px",
        background: "linear-gradient(145deg, #2c2f48, #1a1a2e)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
        },
      }}
    >
      {/* Card header: user avatar, name, and date */}
      <CardHeader
        avatar={
          <Avatar
            src={snippet.userProfilePic || "/default-avatar.png"} // Use Gmail profile picture or fallback
            sx={{
              width: 50,
              height: 50,
              border: "2px solid #ffb17a",
              transition: "box-shadow 0.3s",
              "&:hover": {
                boxShadow: "0 0 10px #ffb17a",
              },
            }}
          />
        }
        title={
          <Typography
            sx={{
              color: "#ffffff",
              fontWeight: "bold",
              cursor: "pointer",
              "&:hover": { color: "#ffb17a" },
            }}
          >
            {snippet.userName || snippet.userEmail?.split("@")[0]} {/* Extract username from email */}
          </Typography>
        }
        subheader={
          <Typography sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.9rem" }}>
            {new Date(snippet.createdAt.seconds * 1000).toLocaleString()}
          </Typography>
        }
      />
      <CardContent>
        {/* Snippet description/title */}
        <Typography
          variant="h6"
          sx={{
            color: "#ffffff",
            cursor: "pointer",
            fontWeight: "bold",
            textDecoration: "underline",
            mb: 2,
            "&:hover": { color: "#ffb17a" },
          }}
          onClick={handleViewSnippet}
        >
          {snippet.description}
        </Typography>
        {/* Code preview (first 5 lines only) */}
        <Box
          sx={{
            backgroundColor: "#424769",
            p: 2,
            borderRadius: "8px",
            overflow: "hidden",
            maxHeight: "150px", // Limit the height for preview
            position: "relative",
          }}
        >
          <Editor
            value={snippet.code.split("\n").slice(0, 5).join("\n")} // Show only the first 5 lines
            onValueChange={() => {}}
            highlight={(code) =>
              highlight(
                code,
                languages[snippet.language] || languages.javascript,
                snippet.language
              )
            }
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 14,
              backgroundColor: "#424769",
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              pointerEvents: "none",
            }}
            readOnly
          />
          {/* Gradient overlay for code preview */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "30px",
              background: "linear-gradient(to top, #424769, transparent)",
            }}
          />
        </Box>
      </CardContent>
      {/* Like and bookmark actions */}
      <CardActions
        disableSpacing
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={handleLike} sx={{ color: liked ? "#ffb17a" : "#ffffff" }}>
            <FavoriteIcon />
          </IconButton>
          <Typography sx={{ color: "#ffffff", ml: 1 }}>
            {snippet.likes?.length || 0} Likes
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={handleSave} sx={{ color: saved ? "#ffb17a" : "#ffffff" }}>
            <BookmarkIcon />
          </IconButton>
          <Typography sx={{ color: "#ffffff", ml: 1 }}>
            {snippet.bookmarks?.length || 0} Bookmarks
          </Typography>
        </Box>
      </CardActions>
    </Card>
  );
};

export default CodeSnippet;
