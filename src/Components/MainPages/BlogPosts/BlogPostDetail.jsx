import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  TextField,
  Button,
  Alert,
  Menu,
  MenuItem,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { auth } from "../../../firebase"; // Import Firebase auth
import { ref, onValue, push } from "firebase/database";
import { realtimeDb } from "../../../firebase";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PostAddIcon from "@mui/icons-material/PostAdd";
import CodeIcon from "@mui/icons-material/Code";
import PodcastsIcon from "@mui/icons-material/Podcasts";
import ForumIcon from "@mui/icons-material/Forum";
import { styled } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const BlogPostDetail = () => {
  const { id } = useParams();
  const user = auth.currentUser; // Get the current user from Firebase
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  useEffect(() => {
    if (user) {
      const fetchProfilePic = async () => {
        const docRef = doc(db, "profiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfilePic(docSnap.data().profilePic);
        }
      };
      fetchProfilePic();
    }
  }, [user]);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const handleAccountClick = () => {
    handleMenuClose();
    navigate("/myaccount");
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfileClick}>My Profile</MenuItem>
      <MenuItem onClick={handleAccountClick}>My Account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          {profilePic ? <Avatar src={profilePic} /> : <AccountCircle />}
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const handleLike = async () => {
    const postRef = doc(db, "posts", id);
    if (Array.isArray(post.likes) && post.likes.includes(user.uid)) {
      await updateDoc(postRef, { likes: arrayRemove(user.uid) });
      setPost((prevPost) => ({
        ...prevPost,
        likes: prevPost.likes.filter((like) => like !== user.uid),
      }));
    } else {
      await updateDoc(postRef, { likes: arrayUnion(user.uid) });
      setPost((prevPost) => ({
        ...prevPost,
        likes: [...(prevPost.likes || []), user.uid],
      }));
    }
  };

  const handleBookmark = async () => {
    const postRef = doc(db, "posts", id);
    if (Array.isArray(post.bookmarks) && post.bookmarks.includes(user.uid)) {
      await updateDoc(postRef, { bookmarks: arrayRemove(user.uid) });
      setPost((prevPost) => ({
        ...prevPost,
        bookmarks: prevPost.bookmarks.filter(
          (bookmark) => bookmark !== user.uid
        ),
      }));
    } else {
      await updateDoc(postRef, { bookmarks: arrayUnion(user.uid) });
      setPost((prevPost) => ({
        ...prevPost,
        bookmarks: [...(prevPost.bookmarks || []), user.uid],
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

  if (!post)
    return (
      <Typography variant="h5" sx={{ color: "#ffb17a" }}>
        Loading...
      </Typography>
    );

  return (
    <>
      <Box
        sx={{
          mb: 4,
          p: 3,
          borderRadius: "12px",
          background: "linear-gradient(145deg,#424769,#202338)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
          },
        }}
      >
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Box sx={{ color: "#ffffff", p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                src={post.userProfilePic || "/default-avatar.png"} // Use Gmail profile picture or fallback
                sx={{
                  mr: 2,
                  cursor: "pointer",
                  display: { xs: "block", sm: "block", md: "block" },
                }}
              />
              <Box>
                <Typography variant="h6" sx={{ cursor: "pointer" }}>
                  {post.userName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#676f9d", fontSize: "0.9rem" }}
                >
                  {new Date(post.createdAt.seconds * 1000).toLocaleString()}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  backgroundColor: "#202338",
                  padding: 2,
                  borderRadius: 2,
                  maxWidth: 700,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    mb: 1,
                    color: "#ffffff",
                  }}
                >
                  {post.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#ffb17a", mb: 2 }}>
                  {post.hashtags && post.hashtags.length > 0
                    ? post.hashtags.map((hashtag) => `#${hashtag}`).join(" ")
                    : ""}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: 4 }}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}> 
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
              <Typography sx={{ ml: 1, color: "#ffffff" }}>
                {Array.isArray(post.likes) ? post.likes.length : 0} Likes
              </Typography></Box><Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}> 
              <IconButton
                onClick={handleBookmark}
                sx={{
                  ml: 2,
                  color:
                    Array.isArray(post.bookmarks) &&
                    post.bookmarks.includes(user.uid)
                      ? "#ffb17a"
                      : "#ffffff",
                }}
              >
                <BookmarkIcon />
              </IconButton>
              <Typography sx={{ ml: 1, color: "#ffffff" }}>
                {Array.isArray(post.bookmarks) ? post.bookmarks.length : 0}{" "}
                Bookmarks
              </Typography>
              </Box>
            </Box>
            <Box sx={{ display: { xs: "block", md: "none" }, mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
                <Typography sx={{ ml: 1 }}>
                  {Array.isArray(post.likes) ? post.likes.length : 0} Likes
                </Typography>
                <IconButton
                  onClick={handleBookmark}
                  sx={{
                    ml: 2,
                    color:
                      Array.isArray(post.bookmarks) &&
                      post.bookmarks.includes(user.uid)
                        ? "#ffb17a"
                        : "#ffffff",
                  }}
                >
                  <BookmarkIcon />
                </IconButton>
                <Typography sx={{ ml: 1 }}>
                  {Array.isArray(post.bookmarks) ? post.bookmarks.length : 0}{" "}
                  Bookmarks
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
                Comments
              </Typography>
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
                  label="Add a comment"
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
                  onClick={handleComment}
                  variant="contained"
                  startIcon={<CommentIcon />}
                  sx={{
                    backgroundColor: "#ffb17a",
                    color: "#000000",
                    p: 1,
                    pl: 3,
                    pr: 3,
                    height: 50,
                  }}
                >
                  Comment
                </Button>
              </Box>
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              <Box sx={{ mt: 2, mb: 2 }}>
                {comments.map((comment, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", mb: 2 }}
                  >
                    <Avatar src={comment.userProfilePic} sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: "#ffffff" }}>
                        {comment.userName}: <strong>{comment.comment}</strong>
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#676f9d", fontSize: "0.8rem" }}
                      >
                        {new Date(comment.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default BlogPostDetail;
