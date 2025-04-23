import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { Box, Typography, IconButton, Avatar, TextField, Button, Alert, Menu, MenuItem } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useUser } from "@clerk/clerk-react";
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
  const { user } = useUser();
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
    <>
      <Box sx={{ display: "flex" }}>
        <AppBar position="fixed" sx={{ backgroundColor: "#202338", zIndex: 1201 }}>
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
              {drawerOpen ? <ChevronLeftIcon sx={{ color: "#ffffff" }} /> : <ChevronRightIcon sx={{ color: "#ffffff" }} />}
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
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8,  ml: drawerOpen ? 30 : 10 }}>
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
        </Box>
      </Box>
    </>
  );
};

export default BlogPostDetail;
