import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { Box, Typography, IconButton, Avatar, TextField, Button, Alert } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useUser } from "@clerk/clerk-react";
import { ref, onValue, push } from "firebase/database";
import { realtimeDb } from "../../../firebase";

const BlogPostDetail = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPost(docSnap.data());
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const commentsRef = ref(realtimeDb, `blogPosts/${id}/comments`);
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      const commentsArray = data ? Object.values(data) : [];
      setComments(commentsArray);
    });

    return () => unsubscribe();
  }, [id]);

  const handleLike = async () => {
    const postRef = doc(db, "posts", id);
    if (Array.isArray(post.likes) && post.likes.includes(user.id)) {
      await updateDoc(postRef, { likes: arrayRemove(user.id) });
      setPost((prevPost) => ({
        ...prevPost,
        likes: prevPost.likes.filter((like) => like !== user.id),
      }));
    } else {
      await updateDoc(postRef, { likes: arrayUnion(user.id) });
      setPost((prevPost) => ({
        ...prevPost,
        likes: [...(prevPost.likes || []), user.id],
      }));
    }
  };

  const handleBookmark = async () => {
    const postRef = doc(db, "posts", id);
    if (Array.isArray(post.bookmarks) && post.bookmarks.includes(user.id)) {
      await updateDoc(postRef, { bookmarks: arrayRemove(user.id) });
      setPost((prevPost) => ({
        ...prevPost,
        bookmarks: prevPost.bookmarks.filter((bookmark) => bookmark !== user.id),
      }));
    } else {
      await updateDoc(postRef, { bookmarks: arrayUnion(user.id) });
      setPost((prevPost) => ({
        ...prevPost,
        bookmarks: [...(prevPost.bookmarks || []), user.id],
      }));
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) {
      setError("Comment required");
      return;
    }

    const commentsRef = ref(realtimeDb, `blogPosts/${id}/comments`);
    const newComment = {
      userId: user.id,
      userName: user.fullName,
      userProfilePic: user.profileImageUrl,
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

  if (!post) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ backgroundColor: "#202338", color: "#ffffff", p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {post.title}
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 4 }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar src={post.userProfilePic} sx={{ mr: 2 }} />
        <Typography variant="h6">{post.userName}</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <IconButton
          onClick={handleLike}
          sx={{
            color: Array.isArray(post.likes) && post.likes.includes(user.id)
              ? "#ffb17a"
              : "#ffffff",
          }}
        >
          <FavoriteIcon />
        </IconButton>
        <Typography sx={{ ml: 1 }}>
          {Array.isArray(post.likes) ? post.likes.length : 0} Likes
        </Typography>
        <IconButton
          onClick={handleBookmark}
          sx={{
            ml: 2,
            color: Array.isArray(post.bookmarks) && post.bookmarks.includes(user.id)
              ? "#ffb17a"
              : "#ffffff",
          }}
        >
          <BookmarkIcon />
        </IconButton>
      </Box>
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Comments
        </Typography>
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
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ mt: 2 }}>
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
    </Box>
  );
};

export default BlogPostDetail;
