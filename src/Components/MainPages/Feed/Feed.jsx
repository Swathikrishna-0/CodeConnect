import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { useUser } from "@clerk/clerk-react";
import { db } from "../../../firebase";
import { doc, getDoc, collection, query, onSnapshot, orderBy, where } from "firebase/firestore";
import BlogPostEditor from "../BlogPosts/BlogPostEditor";
import BlogPost from "../BlogPosts/BlogPost";
import CodeSnippetEditor from "../CodeSnippet/CodeSnippetEditor";
import CodeSnippet from "../CodeSnippet/Codesnippet";
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

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
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
  const { user } = useUser();
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
        const q = query(collection(db, "posts"), where("bookmarks", "array-contains", user.id));
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
          where("bookmarks", "array-contains", user.id)
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
  };

  const handleClearSearch = () => {
    setSearchQuery(""); // Clear the search query
    setSearchResults([]); // Clear the search results
    setIsSearching(false); // Reset search state
  };

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

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleCreatePostClick = () => {
    setActiveGroup(null); // Reset active group
    setShowBlogPage((prevShowBlogPage) => !prevShowBlogPage);
    if (!showBlogPage) {
      setShowSnippetPage(false);
      setShowPodcastPage(false);
      setShowForumsPage(false);
      setShowSavedPostsPage(false);
    }
  };

  const handleCreateSnippetClick = () => {
    setActiveGroup(null); // Reset active group
    setShowSnippetPage((prevShowSnippetPage) => !prevShowSnippetPage);
    if (!showSnippetPage) {
      setShowBlogPage(false);
      setShowPodcastPage(false);
      setShowForumsPage(false);
      setShowSavedPostsPage(false);
    }
  };

  const handleCreatePodcastClick = () => {
    setActiveGroup(null); // Reset active group
    setShowPodcastPage((prevShowPodcastPage) => !prevShowPodcastPage);
    if (!showPodcastPage) {
      setShowBlogPage(false);
      setShowSnippetPage(false);
      setShowForumsPage(false);
      setShowSavedPostsPage(false);
    }
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

  return (
    <Box
      sx={{ display: "flex", backgroundColor: "#202338" }}
      className="feed-container"
    >
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
          </Search>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#ffb17a",
              color: "#000",
              marginLeft: "10px",
              "&:hover": { backgroundColor: "#e6a963" },
            }}
            onClick={handleSearch}
          >
            Search
          </Button>
          {isSearching && (
            <Button
              variant="outlined"
              sx={{
                marginLeft: "10px",
                color: "#ffffff",
                borderColor: "#ffb17a",
                "&:hover": { borderColor: "#e6a963" },
              }}
              onClick={handleClearSearch}
            >
              Clear
            </Button>
          )}
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
      </AppBarStyled>
      {renderMobileMenu}
      {renderMenu}
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
          {isSearching ? (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ color: "#ffb17a", mb: 2 }}>
                Search Results ({searchResults.length})
              </Typography>
              {searchResults.length > 0 ? (
                searchResults.map((result) =>
                  result.title ? (
                    <BlogPost key={result.id} post={result} />
                  ) : (
                    <CodeSnippet key={result.id} snippet={result} />
                  )
                )
              ) : (
                <Typography variant="body1" sx={{ color: "#ffffff" }}>
                  No results found for "{searchQuery}".
                </Typography>
              )}
            </Box>
          ) : (
            !showBlogPage &&
            !showSnippetPage &&
            !showPodcastPage &&
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
          )}
          {showBlogPage && (
            <>
              <BlogPostEditor />
              {posts.map((post) => (
                <BlogPost key={post.id} post={post} />
              ))}
            </>
          )}
          {showSnippetPage && (
            <>
              <CodeSnippetEditor />
              {snippets.map((snippet) => (
                <CodeSnippet key={snippet.id} snippet={snippet} />
              ))}
            </>
          )}
          {showPodcastPage && <PodcastPage />}
          {showForumsPage && <Forums onOpenGroup={handleOpenGroup} />}
          {activeGroup && (
            <>
              <button
                onClick={handleBackToForums}
                style={{
                  marginBottom: "20px",
                  padding: "10px 20px",
                  backgroundColor: "#ffb17a",
                  color: "#000",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Back to Forums
              </button>
              <GroupDiscussion groupId={activeGroup.groupId} groupName={activeGroup.groupName} />
            </>
          )}
          {showSavedPostsPage && <SavedPosts bookmarkedPosts={bookmarkedPosts} bookmarkedSnippets={bookmarkedSnippets} />}
        </Container>
      </Box>
    </Box>
  );
}
