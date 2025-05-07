import React, { useState, useEffect } from "react";
import { getDatabase, ref, push, onValue } from "firebase/database";
import { Box, TextField, Button, Typography, Avatar } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";
import CommentIcon from "@mui/icons-material/Comment";

const CommentSection = ({ questionId, groupId }) => {
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const fetchProfile = async () => {
          const docRef = doc(db, "profiles", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const profileData = docSnap.data();
            if (!currentUser.displayName) {
              currentUser.displayName = profileData.firstName; // Use first name if displayName is not available
            }
            currentUser.photoURL =
              profileData.profilePic || currentUser.photoURL; // Use profilePic if available
          }
        };
        fetchProfile();
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const commentsRef = ref(
      db,
      `groups/${groupId}/questions/${questionId}/comments`
    ); // Use groupId and questionId for scoping

    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const commentsList = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setComments(commentsList);
      } else {
        setComments([]);
      }
    });

    return () => unsubscribe();
  }, [groupId, questionId]); // Re-fetch data when groupId or questionId changes

  const handlePostComment = async () => {
    if (!comment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const db = getDatabase();
      const commentsRef = ref(
        db,
        `groups/${groupId}/questions/${questionId}/comments`
      );

      const newComment = {
        text: comment,
        createdAt: new Date().toISOString(),
        userName: user.displayName || user.email.split("@")[0], // Extract username from email
        userAvatar: user.photoURL || "/default-avatar.png", // Use updated photoURL
      };

      console.log("Posting Comment:", newComment);
      await push(commentsRef, newComment);
      setComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment. Please try again.");
    }
  };

  return (
    <Box sx={{ marginTop: "10px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          justifyContent: "center",
        }}
      >
        <TextField
          fullWidth
          label="Write a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          InputLabelProps={{ style: { color: "#ffffff" } }}
          InputProps={{
            style: { color: "#ffffff", borderColor: "#ffb17a" },
          }}
          sx={{
            marginRight: 3,
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": { borderColor: "#676f9d" },
              "&.Mui-focused fieldset": { borderColor: "#676f9d" },
              backgroundColor: "#202338",
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handlePostComment}
          startIcon={<CommentIcon />}
          sx={{
            backgroundColor: "#ffb17a",
            color: "#000000",
            height: 50,
            width: 150,
          }}
        >
          Comment
        </Button>
      </Box>

      <Box sx={{ marginTop: "20px" }}>
        <Typography
          variant="h6"
          sx={{ color: "#ffffff", marginBottom: "10px" }}
        >
          Comments
        </Typography>
        {comments.map((comment) => (
          <Box
            key={comment.id}
            sx={{
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "10px",
              color: "#ffffff",
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ marginRight: "10px" }}>
              <Avatar
                src={comment.userAvatar || "/default-avatar.png"}
                alt={comment.userName}
                sx={{ width: 40, height: 40 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.png";
                }}
              />
            </Box>
            <Box>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", marginBottom: "5px" }}
              >
                {comment.userName || comment.userEmail?.split("@")[0]} {/* Extract username from email */}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: "5px" }}>
                {comment.text}
              </Typography>
              <Typography variant="body2" sx={{ color: "#676f9d" }}>
                Posted on: {new Date(comment.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CommentSection;
