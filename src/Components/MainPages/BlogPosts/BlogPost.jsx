import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { Box, Typography, IconButton, Avatar } from "@mui/material";
import { auth, db } from "../../../firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const BlogPost = ({ post }) => {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (user) {
      setLiked(post.likes?.includes(user.uid));
      setBookmarked(post.bookmarks?.includes(user.uid));
    }
  }, [user, post]);

  const handleLike = async () => {
    if (!user) return;
    const postRef = doc(db, "posts", post.id);
    if (liked) {
      await updateDoc(postRef, { likes: arrayRemove(user.uid) });
    } else {
      await updateDoc(postRef, { likes: arrayUnion(user.uid) });
    }
    setLiked(!liked);
  };

  const handleBookmark = async () => {
    if (!user) return;
    const postRef = doc(db, "posts", post.id);
    if (bookmarked) {
      await updateDoc(postRef, { bookmarks: arrayRemove(user.uid) });
    } else {
      await updateDoc(postRef, { bookmarks: arrayUnion(user.uid) });
    }
    setBookmarked(!bookmarked);
  };

  const handleViewPost = () => {
    navigate(`/feed/blogposts/${post.id}`);
  };

  return (
    <Box
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
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar
          src={post.userProfilePic || "/default-avatar.png"} // Use Gmail profile picture or fallback
          sx={{
            width: 50,
            height: 50,
            mr: 2,
            border: "2px solid #ffb17a",
            transition: "box-shadow 0.3s",
            "&:hover": {
              boxShadow: "0 0 10px #ffb17a",
            },
          }}
        />
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: "#ffffff",
              cursor: "pointer",
              fontWeight: "bold",
              textDecoration: "underline",
              "&:hover": { color: "#ffb17a" },
            }}
            onClick={handleViewPost}
          >
            {post.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.9rem" }}
          >
            {post.userName} • {new Date(post.createdAt.seconds * 1000).toLocaleString()}
          </Typography>
        </Box>
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: "#ffb17a",
          mb: 2,
          fontSize: "0.9rem",
          whiteSpace: "pre-wrap",
        }}
      >
        {post.hashtags?.map((hashtag) => `#${hashtag}`).join(" ")}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={handleLike} sx={{ color: liked ? "#ffb17a" : "#ffffff" }}>
            <FavoriteIcon />
          </IconButton>
          <Typography sx={{ color: "#ffffff", ml: 1 }}>
            {post.likes?.length || 0} Likes
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={handleBookmark}
            sx={{ color: bookmarked ? "#ffb17a" : "#ffffff" }}
          >
            <BookmarkIcon />
          </IconButton>
          <Typography sx={{ color: "#ffffff", ml: 1 }}>
            {post.bookmarks?.length || 0} Bookmarks
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default BlogPost;
