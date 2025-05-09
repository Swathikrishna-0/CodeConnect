import * as React from "react";
import {
  useNavigate,
  Link,
  Routes,
  Route,
  useLocation,
} from "react-router-dom"; // Import useLocation
import { styled, alpha, useTheme } from "@mui/material/styles";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
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
import {
  doc,
  getDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
} from "firebase/firestore";
import BlogPostEditor from "../BlogPosts/BlogPostEditor";
import BlogPost from "../BlogPosts/BlogPost";
import BlogPostDetail from "../BlogPosts/BlogPostDetail";
import CodeSnippetEditor from "../CodeSnippet/CodeSnippetEditor";
import CodeSnippet from "../CodeSnippet/Codesnippet";
import CodeSnippetDetail from "../CodeSnippet/CodeSnippetDetail"; // Import CodeSnippetDetail
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import CodeIcon from "@mui/icons-material/Code";
import PodcastsIcon from "@mui/icons-material/Podcasts";
import PodcastPage from "../Podcasts/PodcastPage";
import ForumIcon from "@mui/icons-material/Forum"; // Import Forums icon
import Forums from "../Forums/Forums"; // Import Forums component
import GroupDiscussion from "../Forums/GroupDiscussion"; // Import GroupDiscussion component
import BookmarkIcon from "@mui/icons-material/Bookmark"; // Import Bookmark icon
import SavedPosts from "../SavedPosts/SavedPosts"; // Import SavedPosts component
import { signOut } from "firebase/auth";
import ClearIcon from "@mui/icons-material/Clear"; // Import Clear icon
import SearchResults from "../Search/SearchResults"; // Import the new SearchResults component
import Profile from "../Profile/Profile"; // Import the Profile component
import Myaccount from "../MyAccount/Myaccount";
import DevCardPage from "./DevCardPage";
import { motion } from "framer-motion"; // Import motion from framer-motion
import bitbyteImage from "../../../assets/bitbyte.png"; // Import BitByte image
import logo from "../../../assets/codeconnect_logo2.png"; // Import logo image

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
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  backgroundColor: "#424769",
  ...closedMixin(theme),
  "& .MuiDrawer-paper": {
    ...closedMixin(theme),
    backgroundColor: "#424769",
  },
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
      width: "20ch", // Default width for large devices
    },
    [theme.breakpoints.down("md")]: {
      width: "15ch", // Adjusted width for medium devices
    },
    [theme.breakpoints.down("sm")]: {
      width: "10ch", // Adjusted width for small devices
    },
  },
}));

export default function Feed() {
  const location = useLocation(); // Get the current route
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
      if (currentUser) {
        // Use Gmail profile picture if available
        setProfilePic(currentUser.photoURL || null);
      } else {
        setProfilePic(null); // Reset profilePic if user is not logged in
      }
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if (user && !profilePic) {
      const fetchProfilePic = async () => {
        const docRef = doc(db, "profiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().profilePic) {
          setProfilePic(docSnap.data().profilePic);
        }
      };
      fetchProfilePic();
    }
  }, [user, profilePic]);

  React.useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc")); // Sort blog posts by createdAt
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
    const q = query(
      collection(db, "codeSnippets"),
      orderBy("createdAt", "desc")
    ); // Sort code snippets by createdAt
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
        const q = query(
          collection(db, "posts"),
          where("bookmarks", "array-contains", user.uid)
        );
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
    const results = [...filteredPosts, ...filteredSnippets];

    // Navigate to the search results page with the results
    navigate("/feed/searchresults", { state: { results } });
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
    navigate("/feed/profile"); // Update the URL to include /feed
  };

  const handleAccountClick = () => {
    handlePopoverClose();
    navigate("/feed/myaccount"); // Update the URL to include /feed
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
    navigate("/feed/forums"); // Navigate to /feed/forums
  };

  const handleSavedPostsClick = () => {
    navigate("/feed/savedposts"); // Navigate to /feed/savedposts
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
    navigate(`/feed/forums/${groupId}`, { state: { groupName } }); // Navigate to the group discussion page
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

  const handleDevCardClick = () => {
    handlePopoverClose();
    navigate("/feed/devcard"); // Navigate to the Dev Card page
  };

  return (
    <Box
      sx={{ display: "flex", backgroundColor: "#202338" }}
      className="feed-container"
    >
      <CssBaseline />
      <AppBarStyled position="fixed" open={false}>
        <Toolbar>
          <div
            className="logo"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              mb: "10px",
              cursor: "pointer",
            }}
            onClick={handleLogoClick} // Navigate to /feed on logo click
          >
            <img src={logo} alt="CodeConnect Logo" height={40} />{" "}
            {/* Logo image */}
            <span
              style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#fff" }}
            >
              Code<span style={{ color: "#ffb17a" }}>Connect</span>
            </span>
          </div>
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
          <Box sx={{ display: "flex" }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleAvatarClick}
              color="inherit"
              sx={{
                display: { xs: "block", sm: "block", md: "block" }, // Ensure visibility on all devices
              }}
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
        <MenuItem
          onClick={handleProfileClick}
          sx={{ "&:hover": { backgroundColor: "#676f9d" } }}
        >
          My Profile
        </MenuItem>
        <MenuItem
          onClick={handleAccountClick}
          sx={{ "&:hover": { backgroundColor: "#676f9d" } }}
        >
          My Account
        </MenuItem>
        <MenuItem
          onClick={handleDevCardClick}
          sx={{ "&:hover": { backgroundColor: "#676f9d" } }}
        >
          Dev Card
        </MenuItem>
        <MenuItem
          onClick={handleSignOut}
          sx={{ "&:hover": { backgroundColor: "#676f9d" } }}
        >
          Sign Out
        </MenuItem>
      </Popover>
      <Drawer variant="permanent" open={false}>
        <DrawerHeader />
        <Divider />
        <List>
          <ListItem
            button
            onClick={handleCreatePostClick}
            sx={{ cursor: "pointer", flexDirection: "column" }}
          >
            <ListItemIcon
              sx={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PostAddIcon
                sx={{
                  color: location.pathname.includes("/feed/blogposts")
                    ? "#ffb17a"
                    : "#ffffff",
                }}
              />
            </ListItemIcon>
            <Typography
              variant="caption"
              sx={{
                color: location.pathname.includes("/feed/blogposts")
                  ? "#ffb17a"
                  : "#ffffff",
                fontSize: "10px",
                mt: 1,
              }}
            >
              Blogs
            </Typography>
          </ListItem>
          <ListItem
            button
            onClick={handleCreateSnippetClick}
            sx={{ cursor: "pointer", flexDirection: "column" }}
          >
            <ListItemIcon
              sx={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CodeIcon
                sx={{
                  color: location.pathname.includes("/feed/codesnippets")
                    ? "#ffb17a"
                    : "#ffffff",
                }}
              />
            </ListItemIcon>
            <Typography
              variant="caption"
              sx={{
                color: location.pathname.includes("/feed/codesnippets")
                  ? "#ffb17a"
                  : "#ffffff",
                fontSize: "10px",
                mt: 1,
              }}
            >
              Code
            </Typography>
          </ListItem>
          <ListItem
            button
            onClick={handleCreatePodcastClick}
            sx={{ cursor: "pointer", flexDirection: "column" }}
          >
            <ListItemIcon
              sx={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PodcastsIcon
                sx={{
                  color: location.pathname.includes("/feed/podcasts")
                    ? "#ffb17a"
                    : "#ffffff",
                }}
              />
            </ListItemIcon>
            <Typography
              variant="caption"
              sx={{
                color: location.pathname.includes("/feed/podcasts")
                  ? "#ffb17a"
                  : "#ffffff",
                fontSize: "10px",
                mt: 1,
              }}
            >
              Podcasts
            </Typography>
          </ListItem>
          <ListItem
            button
            onClick={handleCreateForumsClick}
            sx={{ cursor: "pointer", flexDirection: "column" }}
          >
            <ListItemIcon
              sx={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ForumIcon
                sx={{
                  color: location.pathname.includes("/feed/forums")
                    ? "#ffb17a"
                    : "#ffffff",
                }}
              />
            </ListItemIcon>
            <Typography
              variant="caption"
              sx={{
                color: location.pathname.includes("/feed/forums")
                  ? "#ffb17a"
                  : "#ffffff",
                fontSize: "10px",
                mt: 1,
              }}
            >
              Forums
            </Typography>
          </ListItem>
          <ListItem
            button
            onClick={handleSavedPostsClick}
            sx={{ cursor: "pointer", flexDirection: "column" }}
          >
            <ListItemIcon
              sx={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookmarkIcon
                sx={{
                  color: location.pathname.includes("/feed/savedposts")
                    ? "#ffb17a"
                    : "#ffffff",
                }}
              />
            </ListItemIcon>
            <Typography
              variant="caption"
              sx={{
                color: location.pathname.includes("/feed/savedposts")
                  ? "#ffb17a"
                  : "#ffffff",
                fontSize: "10px",
                mt: 1,
                textAlign: "center",
              }}
            >
              Saved
            </Typography>
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Container maxWidth="md">
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
                      Welcome to{" "}
                      <span style={{ color: "#ffb17a", fontWeight: "bold" }}>
                        CodeConnect
                      </span>
                    </Typography>
                    <Box
                      sx={{
                        position: "relative",
                        textAlign: "center",
                        mt: 4,
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                      }}
                    >
                      <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        style={{ display: "inline-block" }}
                      >
                        <img
                          src={bitbyteImage}
                          alt="BitByte - The CodeConnect Dev Mascot"
                          style={{
                            cursor: "pointer",
                            maxWidth: "100%",
                            objectFit: "contain",
                          }}
                          className="bitbyte-image"
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        style={{
                          maxWidth: "90%",
                          backgroundColor: "#ffb17a",
                          color: "#202338",
                          padding: "15px",
                          borderRadius: "15px",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          fontSize: "0.9rem",
                          fontFamily: "'Comic Sans MS', cursive, sans-serif",
                          whiteSpace: "normal",
                          textAlign: "left",
                          lineHeight: "1.5",
                          animation: "float 3s ease-in-out infinite",
                        }}
                      >
                        <strong>Character:</strong> “BitByte” – The CodeConnect
                        Dev Mascot
                        <br />
                        <strong>Name:</strong> BitByte
                        <br />
                        <strong>Species:</strong> Digital sprite (part pixel,
                        part code)
                        <br />
                        <strong>Role:</strong> Resident hacker, bug squasher,
                        and dev cheerleader
                        <br />
                        <strong>Personality:</strong> Curious, clever,
                        optimistic, always tinkering
                        <br />
                        <strong>Signature Look:</strong> Oversized glasses,
                        hoodie with <code>{`{}`}</code>, glowing laptop, USB
                        tail, loves coffee and rubber duck debugging
                      </motion.div>
                    </Box>
                    <Typography variant="h6" sx={{ mb: 3, mt: 5 }}>
                      Explore the latest content from our community:
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        flexWrap: "wrap",
                        gap: 4,
                      }}
                    >
                      <Box
                        sx={{
                          width: "300px",
                          backgroundColor: "#424769",
                          p: 3,
                          borderRadius: 2,
                          cursor: "pointer",
                          "&:hover": { backgroundColor: "#676f9d" },
                        }}
                        onClick={() => navigate("/feed/podcasts")} // Navigate to Podcasts page
                      >
                        <Typography
                          variant="h6"
                          sx={{ color: "#ffb17a", mb: 2 }}
                        >
                          Podcasts
                        </Typography>
                        <Typography variant="body2">
                          Discover insightful podcasts created by our community
                          members.
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "300px",
                          backgroundColor: "#424769",
                          p: 3,
                          borderRadius: 2,
                          cursor: "pointer",
                          "&:hover": { backgroundColor: "#676f9d" },
                        }}
                        onClick={() => navigate("/feed/forums")} // Navigate to Forums page
                      >
                        <Typography
                          variant="h6"
                          sx={{ color: "#ffb17a", mb: 2 }}
                        >
                          Groups
                        </Typography>
                        <Typography variant="body2">
                          Join discussions and collaborate with like-minded
                          individuals.
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "300px",
                          backgroundColor: "#424769",
                          p: 3,
                          borderRadius: 2,
                          cursor: "pointer",
                          "&:hover": { backgroundColor: "#676f9d" },
                        }}
                        onClick={() => navigate("/feed/blogposts")} // Navigate to BlogPosts page
                      >
                        <Typography
                          variant="h6"
                          sx={{ color: "#ffb17a", mb: 2 }}
                        >
                          Blogs
                        </Typography>
                        <Typography variant="body2">
                          Read and share blogs on various topics written by our
                          users.
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "300px",
                          backgroundColor: "#424769",
                          p: 3,
                          borderRadius: 2,
                          cursor: "pointer",
                          "&:hover": { backgroundColor: "#676f9d" },
                        }}
                        onClick={() => navigate("/feed/codesnippets")} // Navigate to CodeSnippets page
                      >
                        <Typography
                          variant="h6"
                          sx={{ color: "#ffb17a", mb: 2 }}
                        >
                          Code Snippets
                        </Typography>
                        <Typography variant="body2">
                          Explore and contribute useful code snippets for the
                          community.
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
            {/* Nested Forums Route */}
            <Route
              path="forums"
              element={<Forums onOpenGroup={handleOpenGroup} />}
            />{" "}
            {/* Pass handleOpenGroup */}
            <Route
              path="forums/:groupId"
              element={<GroupDiscussion />} // Render GroupDiscussion for specific group
            />
            <Route
              path="savedposts"
              element={
                <SavedPosts
                  bookmarkedPosts={bookmarkedPosts} // Pass bookmarked posts
                  bookmarkedSnippets={bookmarkedSnippets} // Pass bookmarked snippets
                />
              }
            />
            <Route
              path="searchresults"
              element={<SearchResults />} // Add the SearchResults route
            />
            {/* Add Profile Route */}
            <Route path="profile" element={<Profile />} />
            <Route path="myaccount" element={<Myaccount />} />{" "}
            {/* Add MyAccount route */}
            <Route path="devcard" element={<DevCardPage />} />{" "}
            {/* Add Dev Card route */}
            {/* Other nested routes can be added here */}
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}
