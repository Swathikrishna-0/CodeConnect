import * as React from "react";
import { useNavigate, Link, Routes, Route } from "react-router-dom";
import { styled, alpha, useTheme } from "@mui/material/styles";
import PostAddIcon from '@mui/icons-material/PostAdd';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import MoreIcon from "@mui/icons-material/MoreVert";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../../../firebase";
import { doc, getDoc, collection, query, onSnapshot, orderBy, where } from "firebase/firestore";
import BlogPostEditor from "../BlogPosts/BlogPostEditor";
import BlogPost from "../BlogPosts/BlogPost";
import BlogPostDetail from "../BlogPosts/BlogPostDetail";
import CodeSnippetEditor from "../CodeSnippet/CodeSnippetEditor";
import CodeSnippet from "../CodeSnippet/Codesnippet";
import CodeSnippetDetail from "../CodeSnippet/CodeSnippetDetail"; // Import CodeSnippetDetail
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import CodeIcon from '@mui/icons-material/Code';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import PodcastPage from "../Podcasts/PodcastPage";
import ForumIcon from '@mui/icons-material/Forum'; // Import Forums icon
import Forums from '../Forums/Forums'; // Import Forums component
import GroupDiscussion from '../Forums/GroupDiscussion'; // Import GroupDiscussion component
import BookmarkIcon from '@mui/icons-material/Bookmark'; // Import Bookmark icon
import SavedPosts from "../SavedPosts/SavedPosts"; // Import SavedPosts component
import { signOut } from "firebase/auth";
import ClearIcon from "@mui/icons-material/Clear"; // Import Clear icon

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBarStyled = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: "#202338",
  boxShadow: "none",
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  backgroundColor: "#424769",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      backgroundColor: "#424769",
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      backgroundColor: "#424769",
    },
  }),
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ClearButtonWrapper = styled("div")(({ theme }) => ({
  position: "absolute",
  right: 0,
  top: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0, 2),
  cursor: "pointer",
  color: theme.palette.common.white,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingRight: `calc(1em + ${theme.spacing(4)})`, // Add space for the clear button
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function Feed() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [profilePic, setProfilePic] = React.useState(null);
  const [posts, setPosts] = React.useState([]);
  const [snippets, setSnippets] = React.useState([]);
  const [showBlogPage, setShowBlogPage] = React.useState(false);
  const [showSnippetPage, setShowSnippetPage] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [showPodcastPage, setShowPodcastPage] = React.useState(false);
  const [showForumsPage, setShowForumsPage] = React.useState(false);
  const [activeGroup, setActiveGroup] = React.useState(null);
  const [showSavedPostsPage, setShowSavedPostsPage] = React.useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = React.useState([]);
  const [bookmarkedSnippets, setBookmarkedSnippets] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState(""); // State for search query
  const [searchResults, setSearchResults] = React.useState([]); // State for search results
  const [isSearching, setIsSearching] = React.useState(false); // State to track if a search is active

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
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

  React.useEffect(() => {
    const q = query(collection(db, "posts"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = [];
      querySnapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() });
      });
      setPosts(postsData);
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    const q = query(collection(db, 'codeSnippets'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const snippetsData = [];
      querySnapshot.forEach((doc) => {
        snippetsData.push({ id: doc.id, ...doc.data() });
      });
      setSnippets(snippetsData);
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if (user) {
      const fetchBookmarkedPosts = async () => {
        const q = query(collection(db, "posts"), where("bookmarks", "array-contains", user.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const bookmarksData = [];
          querySnapshot.forEach((doc) => {
            bookmarksData.push({ id: doc.id, ...doc.data() });
          });
          setBookmarkedPosts(bookmarksData);
        });
        return () => unsubscribe();
      };
      fetchBookmarkedPosts();
    }
  }, [user]);

  React.useEffect(() => {
    if (user) {
      const fetchBookmarkedSnippets = async () => {
        const q = query(
          collection(db, "codeSnippets"),
          where("bookmarks", "array-contains", user.uid)
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const snippetsData = [];
          querySnapshot.forEach((doc) => {
            snippetsData.push({ id: doc.id, ...doc.data() });
          });
          setBookmarkedSnippets(snippetsData);
        });
        return () => unsubscribe();
      };
      fetchBookmarkedSnippets();
    }
  }, [user]);

  const handleSearch = () => {
    const lowerCaseQuery = searchQuery.toLowerCase();

    // Filter posts and snippets based on the search query
    const filteredPosts = posts.filter(
      (post) =>
        (post.title && post.title.toLowerCase().includes(lowerCaseQuery)) ||
        (post.content && post.content.toLowerCase().includes(lowerCaseQuery)) ||
        (post.hashtags || []).some(
          (hashtag) => hashtag && hashtag.toLowerCase().includes(lowerCaseQuery)
        )
    );

    const filteredSnippets = snippets.filter(
      (snippet) =>
        (snippet.description &&
          snippet.description.toLowerCase().includes(lowerCaseQuery)) ||
        (snippet.code && snippet.code.toLowerCase().includes(lowerCaseQuery)) ||
        (snippet.language &&
          snippet.language.toLowerCase().includes(lowerCaseQuery))
    );

    // Combine results
    setSearchResults([...filteredPosts, ...filteredSnippets]);
    setIsSearching(true); // Set search state to true

    // Hide all other pages when searching
    setShowBlogPage(false);
    setShowSnippetPage(false);
    setShowPodcastPage(false);
    setShowForumsPage(false);
    setActiveGroup(null);
    setShowSavedPostsPage(false);
  };

  const handleClearSearch = () => {
    setSearchQuery(""); // Clear the search query
    setSearchResults([]); // Clear the search results
    setIsSearching(false); // Reset search state
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const isPopoverOpen = Boolean(anchorEl);

  const handleProfileClick = () => {
    handlePopoverClose();
    navigate("/profile");
  };

  const handleAccountClick = () => {
    handlePopoverClose();
    navigate("/myaccount");
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleCreatePostClick = () => {
    navigate("/feed/blogposts"); // Navigate to /feed/blogposts
  };

  const handleCreateSnippetClick = () => {
    navigate("/feed/codesnippets"); // Navigate to /feed/codesnippets
  };

  const handleCreatePodcastClick = () => {
    navigate("/feed/podcasts"); // Navigate to the Podcasts page
  };

  const handleCreateForumsClick = () => {
    setActiveGroup(null); // Reset active group
    setShowForumsPage((prevShowForumsPage) => !prevShowForumsPage);
    if (!showForumsPage) {
      setShowBlogPage(false);
      setShowSnippetPage(false);
      setShowPodcastPage(false);
      setShowSavedPostsPage(false);
    }
  };

  const handleSavedPostsClick = () => {
    setActiveGroup(null); // Reset active group
    setShowSavedPostsPage((prevShowSavedPostsPage) => !prevShowSavedPostsPage);
    if (!showSavedPostsPage) {
      setShowBlogPage(false);
      setShowSnippetPage(false);
      setShowPodcastPage(false);
      setShowForumsPage(false);
    }
  };

  const handleLogoClick = () => {
    navigate("/feed"); // Navigate to /feed
    setActiveGroup(null); // Reset active group
    setShowBlogPage(false);
    setShowSnippetPage(false);
    setShowPodcastPage(false);
    setShowForumsPage(false);
    setShowSavedPostsPage(false);
  };

  const handleOpenGroup = (groupId, groupName) => {
    setActiveGroup({ groupId, groupName });
    setShowForumsPage(false);
  };

  const handleBackToForums = () => {
    setActiveGroup(null);
    setShowForumsPage(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to the home page after sign-out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "#202338" }} className="feed-container">
      <CssBaseline />
      <AppBarStyled position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
              color: "#ffffff",
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          >
            <span style={{ color: "#ffffff" }}>Code</span>
            <span style={{ color: "#ffb17a" }}>Connect</span>
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search blogs or snippets..."
              inputProps={{ "aria-label": "search" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSearch(); // Trigger search on Enter key
              }}
            />
            {searchQuery && (
              <ClearButtonWrapper onClick={handleClearSearch}>
                <ClearIcon />
              </ClearButtonWrapper>
            )}
          </Search>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleAvatarClick}
              color="inherit"
            >
              {profilePic ? <Avatar src={profilePic} /> : <AccountCircle />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBarStyled>
      <Popover
        open={isPopoverOpen}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "#424769", // Tooltip background color
            color: "#ffffff", // Text color
            borderRadius: "8px", // Rounded corners
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
            padding: "10px", // Padding inside the tooltip
          },
        }}
      >
        <MenuItem onClick={handleProfileClick} sx={{ "&:hover": { backgroundColor: "#676f9d" } }}>
          My Profile
        </MenuItem>
        <MenuItem onClick={handleAccountClick} sx={{ "&:hover": { backgroundColor: "#676f9d" } }}>
          My Account
        </MenuItem>
        <MenuItem onClick={handleSignOut} sx={{ "&:hover": { backgroundColor: "#676f9d" } }}>
          Sign Out
        </MenuItem>
      </Popover>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <MenuIcon sx={{ color: "#ffffff" }} />
            ) : (
              <MenuIcon sx={{ color: "#ffffff" }} />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem button onClick={handleCreatePostClick} sx={{ cursor: 'pointer' }}>
            <ListItemIcon>
              <PostAddIcon sx={{ color: showBlogPage ? "#ffb17a" : "#ffffff" }} />
            </ListItemIcon>
            <ListItemText primary="Write a Blog" sx={{ color: "#ffffff" }} />
          </ListItem>
          <ListItem button onClick={handleCreateSnippetClick} sx={{ cursor: 'pointer' }}>
            <ListItemIcon>
              <CodeIcon sx={{ color: showSnippetPage ? "#ffb17a" : "#ffffff" }} />
            </ListItemIcon>
            <ListItemText primary="Write a Code Snippet" sx={{ color: "#ffffff" }} />
          </ListItem>
          <ListItem button onClick={handleCreatePodcastClick} sx={{ cursor: 'pointer' }}>
            <ListItemIcon>
              <PodcastsIcon sx={{ color: showPodcastPage ? "#ffb17a" : "#ffffff" }} />
            </ListItemIcon>
            <ListItemText primary="Podcasts" sx={{ color: "#ffffff" }} />
          </ListItem>
          <ListItem button onClick={handleCreateForumsClick} sx={{ cursor: 'pointer' }}>
            <ListItemIcon>
              <ForumIcon sx={{ color: showForumsPage ? "#ffb17a" : "#ffffff" }} />
            </ListItemIcon>
            <ListItemText primary="Forums" sx={{ color: "#ffffff" }} />
          </ListItem>
          <ListItem button onClick={handleSavedPostsClick} sx={{ cursor: 'pointer' }}>
            <ListItemIcon>
              <BookmarkIcon sx={{ color: showSavedPostsPage ? "#ffb17a" : "#ffffff" }} />
            </ListItemIcon>
            <ListItemText primary="Saved Posts" sx={{ color: "#ffffff" }} />
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Routes>
            {/* Default Feed Content */}
            <Route
              path="/"
              element={
                !showBlogPage &&
                !showSnippetPage &&
                !showForumsPage &&
                !activeGroup &&
                !showSavedPostsPage && (
                  <Box sx={{ textAlign: "center", color: "#ffffff" }}>
                    <Typography variant="h4" sx={{ mb: 4 }}>
                      Welcome to <span style={{ color: "#ffb17a" }}>CodeConnect</span>
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Explore the latest content from our community:
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 4 }}>
                      <Box sx={{ width: "300px", backgroundColor: "#424769", p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ color: "#ffb17a", mb: 2 }}>
                          Podcasts
                        </Typography>
                        <Typography variant="body2">
                          Discover insightful podcasts created by our community members.
                        </Typography>
                      </Box>
                      <Box sx={{ width: "300px", backgroundColor: "#424769", p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ color: "#ffb17a", mb: 2 }}>
                          Groups
                        </Typography>
                        <Typography variant="body2">
                          Join discussions and collaborate with like-minded individuals.
                        </Typography>
                      </Box>
                      <Box sx={{ width: "300px", backgroundColor: "#424769", p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ color: "#ffb17a", mb: 2 }}>
                          Blogs
                        </Typography>
                        <Typography variant="body2">
                          Read and share blogs on various topics written by our users.
                        </Typography>
                      </Box>
                      <Box sx={{ width: "300px", backgroundColor: "#424769", p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ color: "#ffb17a", mb: 2 }}>
                          Code Snippets
                        </Typography>
                        <Typography variant="body2">
                          Explore and contribute useful code snippets for the community.
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )
              }
            />
            {/* Nested BlogPosts Route */}
            <Route path="blogposts" element={<BlogPostEditor />} />
            <Route path="blogposts/:id" element={<BlogPostDetail />} />
            {/* Nested CodeSnippets Route */}
            <Route path="codesnippets" element={<CodeSnippetEditor />} />
            <Route path="codesnippets/:id" element={<CodeSnippetDetail />} />
            {/* Nested Podcasts Route */}
            <Route path="podcasts" element={<PodcastPage />} />
            {/* Other nested routes can be added here */}
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}
