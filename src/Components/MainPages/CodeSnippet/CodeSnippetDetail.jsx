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

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const CodeSnippetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [snippet, setSnippet] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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

  if (!snippet) return <Typography sx="{color: '#ffffff'}">Loading...</Typography>;

  return (
    <>
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
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                src={snippet.userProfilePic || "/default-avatar.png"} // Use Gmail profile picture or fallback
                sx={{
                  mr: 2,
                  cursor: "pointer",
                  display: { xs: "block", sm: "block", md: "block" },
                }}
                onClick={() => navigate(`/profile/${snippet.userId}`)} // Navigate to user's public profile
              />
              <Box>
                <Typography
                  variant="h6"
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate(`/profile/${snippet.userId}`)} // Redirect to public profile
                >
                  {snippet.userName || snippet.userEmail?.split("@")[0]} {/* Extract username from email */}
                </Typography>
                <Typography variant="body2" sx={{ color: "#676f9d", fontSize: "0.9rem" }}>
                  {new Date(snippet.createdAt.seconds * 1000).toLocaleString()}
                </Typography>
              </Box>
            </Box>
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
                    border: "1px solid #676f9d", p: 2, borderRadius: "4px" }}
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
              </Box>
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  ml: 4,
                }}
              >
                <IconButton onClick={handleLike}>
                  <FavoriteIcon sx={{ color: liked ? "#ffb17a" : "#ffffff" }} />
                </IconButton>
                <Typography sx={{ mt: 1, mb: 2 }}>
                  {Array.isArray(snippet.likes) ? snippet.likes.length : 0} Likes
                </Typography>
                <IconButton onClick={handleSave}>
                  <BookmarkIcon sx={{ color: saved ? "#ffb17a" : "#ffffff" }} />
                </IconButton>
                <Typography sx={{ mt: 1 }}>
                  {Array.isArray(snippet.bookmarks) ? snippet.bookmarks.length : 0} Bookmarks
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: { xs: "block", md: "none" }, mt: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <IconButton onClick={handleLike}>
                  <FavoriteIcon sx={{ color: liked ? "#ffb17a" : "#ffffff" }} />
                </IconButton>
                <Typography sx={{ ml: 1 }}>
                  {Array.isArray(snippet.likes) ? snippet.likes.length : 0} Likes
                </Typography>
                <IconButton onClick={handleSave} sx={{ ml: 2 }}>
                  <BookmarkIcon sx={{ color: saved ? "#ffb17a" : "#ffffff" }} />
                </IconButton>
                <Typography sx={{ ml: 1 }}>
                  {Array.isArray(snippet.bookmarks) ? snippet.bookmarks.length : 0} Bookmarks
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Code Reviews
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
              {alertMessage && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {alertMessage}
                </Alert>
              )}
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
