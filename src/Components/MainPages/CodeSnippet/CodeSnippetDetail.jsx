import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, realtimeDb } from "../../../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { ref, onValue, push } from "firebase/database";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/themes/prism.css";
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import CommentIcon from "@mui/icons-material/Comment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import AccountCircle from "@mui/icons-material/AccountCircle";
import PostAddIcon from "@mui/icons-material/PostAdd";
import CodeIcon from "@mui/icons-material/Code";
import PodcastsIcon from "@mui/icons-material/Podcasts";
import ForumIcon from "@mui/icons-material/Forum";
import { styled } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Styled component for Drawer header
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

// CodeSnippetDetail component displays a single code snippet and its reviews/comments
const CodeSnippetDetail = () => {
  const { id } = useParams(); // Get the snippet ID from the URL parameters
  const navigate = useNavigate(); // Navigation hook for redirecting
  // State variables
  const [snippet, setSnippet] = useState(null); // Stores the code snippet data
  const [comments, setComments] = useState([]); // Stores the list of comments
  const [commentText, setCommentText] = useState(""); // Stores the text of the new comment
  const [alertMessage, setAlertMessage] = useState(""); // Stores alert messages for errors
  const [liked, setLiked] = useState(false); // Tracks if the snippet is liked by the user
  const [saved, setSaved] = useState(false); // Tracks if the snippet is bookmarked by the user
  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for desktop menu
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null); // Anchor element for mobile menu
  const [profilePic, setProfilePic] = useState(null); // Stores the user's profile picture
  const [drawerOpen, setDrawerOpen] = useState(false); // Tracks the state of the drawer
  const [user, setUser] = useState(null); // Stores the authenticated user

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch the code snippet from Firestore and set like/bookmark state
  useEffect(() => {
    const fetchSnippet = async () => {
      const docRef = doc(db, "codeSnippets", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const snippetData = docSnap.data();
        setSnippet(snippetData);
        setLiked(snippetData.likes?.includes(user.uid));
        setSaved(snippetData.bookmarks?.includes(user.uid));
      }
    };
    if (user) fetchSnippet();
  }, [id, user]);

  // Listen for comments in Realtime Database
  useEffect(() => {
    if (!id) return;
    const commentsRef = ref(realtimeDb, `codeSnippets/${id}/comments`);
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      const commentsArray = data ? Object.values(data) : [];
      setComments(commentsArray);
    });

    return () => unsubscribe();
  }, [id]);

  // Fetch user profile picture from Firestore
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

  // Menu state helpers
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // Menu open/close handlers
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

  // Render desktop menu
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

  // Render mobile menu
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

  // Handle like button click
  const handleLike = async () => {
    if (!snippet) return;
    const snippetRef = doc(db, "codeSnippets", id);
    if (liked) {
      await updateDoc(snippetRef, { likes: arrayRemove(user.uid) });
      setSnippet((prev) => ({
        ...prev,
        likes: prev.likes.filter((like) => like !== user.uid),
      }));
    } else {
      await updateDoc(snippetRef, { likes: arrayUnion(user.uid) });
      setSnippet((prev) => ({
        ...prev,
        likes: [...(prev.likes || []), user.uid],
      }));
    }
    setLiked(!liked);
  };

  // Handle bookmark button click
  const handleSave = async () => {
    if (!snippet) return;
    const snippetRef = doc(db, "codeSnippets", id);
    if (saved) {
      await updateDoc(snippetRef, { bookmarks: arrayRemove(user.uid) });
      setSnippet((prev) => ({
        ...prev,
        bookmarks: prev.bookmarks.filter((bookmark) => bookmark !== user.uid),
      }));
    } else {
      await updateDoc(snippetRef, { bookmarks: arrayUnion(user.uid) });
      setSnippet((prev) => ({
        ...prev,
        bookmarks: [...(prev.bookmarks || []), user.uid],
      }));
    }
    setSaved(!saved);
  };

  // Handle adding a code review/comment
  const handleComment = async () => {
    if (!commentText.trim()) {
      setAlertMessage("Review required");
      setTimeout(() => setAlertMessage(""), 3000);
      return;
    }

    const commentsRef = ref(realtimeDb, `codeSnippets/${id}/comments`);
    const newComment = {
      userId: user.uid,
      userName: user.displayName,
      userAvatar: user.photoURL,
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

  // Show loading state if snippet is not loaded yet
  if (!snippet) return <Typography variant="h5" sx={{ color: "#ffb17a" }}>Loading...</Typography>;

  return (
    <>
      {/* Main snippet card */}
      <Box  sx={{
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
        }}>
        
        {renderMobileMenu}
        {renderMenu}
        
        <Box
          component="main"
          sx={{ flexGrow: 1, width:"100%"}}
        >
          <Box sx={{ color: "#ffffff", p: 3 }}>
            {/* Author info */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                src={snippet.userProfilePic || "/default-avatar.png"} // Use Gmail profile picture or fallback
                sx={{
                  mr: 2,
                  cursor: "pointer",
                  display: { xs: "block", sm: "block", md: "block" },
                }}
              />
              <Box>
                <Typography
                  variant="h6"
                  sx={{ cursor: "pointer" }}
                >
                  {snippet.userName || snippet.userEmail?.split("@")[0]} {/* Extract username from email */}
                </Typography>
                <Typography variant="body2" sx={{ color: "#676f9d", fontSize: "0.9rem" }}>
                  {new Date(snippet.createdAt.seconds * 1000).toLocaleString()}
                </Typography>
              </Box>
            </Box>
            {/* Snippet content and code */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  {snippet.description}
                </Typography>
                <Typography variant="body2" sx={{ color: "#C17B49", mb: 2 }}>
                  Language: {snippet.language || "Unknown"}
                </Typography>
                <Box
                  sx={{ backgroundColor: "#202338",
                    border: "1px solid #676f9d", p: 2, borderRadius: "4px", mb: 2 }}
                >
                  <Editor
                    value={snippet.code}
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
                      color: "#ffffff",
                      borderRadius: "4px",
                      minHeight: "200px",
                    }}
                    readOnly
                  />
                </Box>
                {/* Like and bookmark actions */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                    mb: 4,
                  }}
                > <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}> 
                  <IconButton onClick={handleLike}>
                    <FavoriteIcon sx={{ color: liked ? "#ffb17a" : "#ffffff" }} />
                  </IconButton>
                  <Typography sx={{ ml: 1, color: "#ffffff" }}>
                    {Array.isArray(snippet.likes) ? snippet.likes.length : 0} Likes
                  </Typography>
                  </Box>
                   <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}> 
                  <IconButton onClick={handleSave} sx={{ ml: 2 }}>
                    <BookmarkIcon sx={{ color: saved ? "#ffb17a" : "#ffffff" }} />
                  </IconButton>
                  <Typography sx={{ ml: 1, color: "#ffffff" }}>
                    {Array.isArray(snippet.bookmarks) ? snippet.bookmarks.length : 0} Bookmarks
                  </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            {/* Code reviews/comments section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Code Reviews
              </Typography>
              {/* Add review input */}
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
                  label="Add a code review..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
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
                  startIcon={<CommentIcon />}
                  variant="contained"
                  sx={{
                    backgroundColor: "#ffb17a",
                    color: "#000000",
                    pl: 2,
                    pr: 2,
                    width: 220,
                    height: 50,
                  }}
                >
                  Review Code
                </Button>
              </Box>
              {/* Error alert for review */}
              {alertMessage && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {alertMessage}
                </Alert>
              )}
              {/* List of reviews/comments */}
              <Box sx={{ mt: 2 }}>
                {comments.map((comment, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: 2,
                      p: 1,
                      borderRadius: "4px",
                    }}
                  >
                    <Avatar src={comment.userAvatar} sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: "#ffffff" }}>
                        {comment.userName || comment.userEmail?.split("@")[0]}: {/* Extract username from email */}
                        <strong>{comment.text}</strong>
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

export default CodeSnippetDetail;
