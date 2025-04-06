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
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import { useUser } from "@clerk/clerk-react";
import { db } from "../../../firebase";
import { doc, getDoc, collection, query, onSnapshot, orderBy } from "firebase/firestore";
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
    setShowBlogPage((prevShowBlogPage) => !prevShowBlogPage);
    if (!showBlogPage) {
      setShowSnippetPage(false);
      setShowPodcastPage(false);
      setShowForumsPage(false);
    }
  };

  const handleCreateSnippetClick = () => {
    setShowSnippetPage((prevShowSnippetPage) => !prevShowSnippetPage);
    if (!showSnippetPage) {
      setShowBlogPage(false);
      setShowPodcastPage(false);
      setShowForumsPage(false);
    }
  };

  const handleCreatePodcastClick = () => {
    setShowPodcastPage((prevShowPodcastPage) => !prevShowPodcastPage);
    if (!showPodcastPage) {
      setShowBlogPage(false);
      setShowSnippetPage(false);
      setShowForumsPage(false);
    }
  };

  const handleCreateForumsClick = () => {
    setShowForumsPage((prevShowForumsPage) => !prevShowForumsPage);
    if (!showForumsPage) {
      setShowBlogPage(false);
      setShowSnippetPage(false);
      setShowPodcastPage(false);
    }
  };

  const handleLogoClick = () => {
    setShowBlogPage(false);
    setShowSnippetPage(false);
    setShowPodcastPage(false);
    setShowForumsPage(false);
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
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 0 new notifications"
          color="inherit"
        >
          <Badge badgeContent={0} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
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
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              aria-label="show 0 new notifications"
              color="inherit"
            >
              <Badge badgeContent={0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
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
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Container maxWidth="md" sx={{ mt: 4 }}>
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
                  marginBottom: '20px',
                  padding: '10px 20px',
                  backgroundColor: '#ffb17a',
                  color: '#000',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Back to Forums
              </button>
              <GroupDiscussion groupId={activeGroup.groupId} groupName={activeGroup.groupName} />
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
}
