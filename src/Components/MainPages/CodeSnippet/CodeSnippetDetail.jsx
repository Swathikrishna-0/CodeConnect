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
import { useUser } from "@clerk/clerk-react";
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
  const { user } = useUser();
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

  useEffect(() => {
    const fetchSnippet = async () => {
      const docRef = doc(db, "codeSnippets", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const snippetData = docSnap.data();
        setSnippet(snippetData);
        setLiked(snippetData.likes?.includes(user.id));
        setSaved(snippetData.bookmarks?.includes(user.id));
      }
    };
    fetchSnippet();
  }, [id, user.id]);

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
        const docRef = doc(db, "profiles", user.id);
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
      await updateDoc(snippetRef, { likes: arrayRemove(user.id) });
      setSnippet((prev) => ({
        ...prev,
        likes: prev.likes.filter((like) => like !== user.id),
      }));
    } else {
      await updateDoc(snippetRef, { likes: arrayUnion(user.id) });
      setSnippet((prev) => ({
        ...prev,
        likes: [...(prev.likes || []), user.id],
      }));
    }
    setLiked(!liked);
  };

  const handleSave = async () => {
    if (!snippet) return;
    const snippetRef = doc(db, "codeSnippets", id);
    if (saved) {
      await updateDoc(snippetRef, { bookmarks: arrayRemove(user.id) });
      setSnippet((prev) => ({
        ...prev,
        bookmarks: prev.bookmarks.filter((bookmark) => bookmark !== user.id),
      }));
    } else {
      await updateDoc(snippetRef, { bookmarks: arrayUnion(user.id) });
      setSnippet((prev) => ({
        ...prev,
        bookmarks: [...(prev.bookmarks || []), user.id],
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

  if (!snippet) return <Typography>Loading...</Typography>;

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          sx={{ backgroundColor: "#202338", zIndex: 1201 }}
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, cursor: "pointer" }}
              onClick={() => navigate("/feed")}
            >
              <span style={{ color: "#ffffff" }}>Code</span>
              <span style={{ color: "#ffb17a" }}>Connect</span>
            </Typography>
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                {profilePic ? <Avatar src={profilePic} /> : <AccountCircle />}
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
        <Drawer
          variant="permanent"
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerOpen ? 240 : 60,
              backgroundColor: "#424769",
              color: "#ffffff",
              overflowX: "hidden",
              transition: "width 0.3s",
              position: "fixed",
              height: "100vh",
            },
          }}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerToggle}>
              {drawerOpen ? (
                <ChevronLeftIcon sx={{ color: "#ffffff" }} />
              ) : (
                <ChevronRightIcon sx={{ color: "#ffffff" }} />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            <ListItem button onClick={() => navigate("/feed")}>
              <ListItemIcon>
                <PostAddIcon sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Write a Blog" />}
            </ListItem>
            <ListItem button onClick={() => navigate("/feed")}>
              <ListItemIcon>
                <CodeIcon sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Write a Code Snippet" />}
            </ListItem>
            <ListItem button onClick={() => navigate("/feed")}>
              <ListItemIcon>
                <PodcastsIcon sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Podcasts" />}
            </ListItem>
            <ListItem button onClick={() => navigate("/feed")}>
              <ListItemIcon>
                <ForumIcon sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Forums" />}
            </ListItem>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, mt: 8, ml: drawerOpen ? 30 : 10 }}
        >
          <Box sx={{ backgroundColor: "#202338", color: "#ffffff", p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar src={snippet.userProfilePic} sx={{ mr: 2 }} />
              <Box>
                <Typography variant="h6">{snippet.userName}</Typography>
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
                  sx={{ backgroundColor: "#424769", p: 2, borderRadius: "4px" }}
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
                      backgroundColor: "#424769",
                      color: "#ffffff",
                      border: "1px solid #676f9d",
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
                  {Array.isArray(snippet.likes) ? snippet.likes.length : 0}{" "}
                  Likes
                </Typography>
                <IconButton onClick={handleSave}>
                  <BookmarkIcon sx={{ color: saved ? "#ffb17a" : "#ffffff" }} />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ display: { xs: "block", md: "none" }, mt: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <IconButton onClick={handleLike}>
                  <FavoriteIcon sx={{ color: liked ? "#ffb17a" : "#ffffff" }} />
                </IconButton>
                <Typography sx={{ ml: 1 }}>
                  {Array.isArray(snippet.likes) ? snippet.likes.length : 0}{" "}
                  Likes
                </Typography>
                <IconButton onClick={handleSave} sx={{ ml: 2 }}>
                  <BookmarkIcon sx={{ color: saved ? "#ffb17a" : "#ffffff" }} />
                </IconButton>
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
                    marginRight: "10px",
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
                        {comment.userName}: <strong>{comment.text}</strong>
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
