import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Menu,
  MenuItem,
} from "@mui/material";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/themes/prism.css";
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import CodeSnippet from "./Codesnippet"; // Import CodeSnippet
import SendIcon from '@mui/icons-material/Send';

// CodeSnippetEditor component for creating and displaying code snippets
const CodeSnippetEditor = () => {
  // State variables
  const [user, setUser] = useState(null);
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for the dropdown
  const [snippets, setSnippets] = useState([]); // State for all code snippets

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch user profile and set display name/profile picture
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const docRef = doc(db, "profiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const profileData = docSnap.data();
          if (user.providerData[0].providerId === "google.com") {
            // Use Google account details
            user.displayName = user.displayName || profileData.firstName;
            setProfilePic(user.photoURL);
          } else {
            // Use profile details from Firestore
            user.displayName = profileData.firstName || user.displayName;
            setProfilePic(profileData.profilePic);
          }
        }
      };
      fetchProfile();
    }
  }, [user]);

  // Fetch all code snippets and listen for updates
  useEffect(() => {
    const q = query(
      collection(db, "codeSnippets"),
      orderBy("createdAt", "desc")
    ); // Sort code snippets by createdAt
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const snippetsData = [];
      querySnapshot.forEach((doc) => {
        snippetsData.push({ id: doc.id, ...doc.data() });
      });
      setSnippets(snippetsData); // Update the snippets state
    });
    return () => unsubscribe();
  }, []);

  // Open the language dropdown
  const handleDropdownOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the language dropdown
  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  // Set the selected language
  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    handleDropdownClose();
  };

  // Handle code snippet submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate fields
    if (!description.trim()) {
      setMessage("Error: Description is required.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    if (!code.trim()) {
      setMessage("Error: Code is required.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    // Add code snippet to Firestore
    if (user) {
      try {
        await addDoc(collection(db, "codeSnippets"), {
          userId: user.uid,
          userName: user.displayName, // Use updated displayName
          userProfilePic: profilePic || "",
          code: code.trim(),
          description: description.trim(),
          language,
          createdAt: new Date(),
          likes: [],
          bookmarks: [], // Initialize bookmarks
          comments: [],
          shares: 0,
        });
        setCode("");
        setDescription("");
        setLanguage("javascript");
        setMessage("Code snippet created successfully!");
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        console.error("Error adding document: ", error);
        setMessage("Error creating code snippet. Please try again.");
      }
    }
  };

  return (
    // Main code snippet editor and list
    <Box sx={{ padding: "20px", color: "#ffffff" }}>
      {/* Page heading */}
      <Typography
        variant="h4"
        sx={{ marginBottom: "10px", fontWeight: "bold" }}
      >
        Code Snippets
      </Typography>
      <Typography
        variant="h6"
        sx={{ marginBottom: "50px", fontSize: "16px", color: "#d1d1e0" }}
      >
        Share, showcase, and explore reusable code for every developer need.
      </Typography>
      {/* Code snippet creation form */}
      <Box
        sx={{
          backgroundColor: "#2c2f48",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "40px",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, color: "#ffffff" }}>
          Create a Code Snippet
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* Description input */}
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            InputLabelProps={{ style: { color: "#ffffff" } }}
            InputProps={{ style: { color: "#ffffff", borderColor: "#ffb17a" } }}
            sx={{
              marginBottom: "20px",
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": { borderColor: "#676f9d" },
                "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                backgroundColor: "#202338",
              },
            }}
          />
          {/* Language dropdown */}
          <Button
            variant="outlined"
            onClick={handleDropdownOpen}
            sx={{
              mb: 2,
              color: "#ffffff",
              borderColor: "#676f9d",
              "&:hover": { borderColor: "#ffb17a" },
            }}
          >
            {language.toUpperCase()}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleDropdownClose}
            PaperProps={{
              style: {
                maxHeight: 200, // Limit the height of the dropdown
                backgroundColor: "#424769",
                color: "#ffffff",
              },
            }}
          >
            {[
              "javascript",
              "python",
              "java",
              "html",
              "css",
              "c",
              "cpp",
              "typescript",
              "ruby",
              "go",
              "php",
              "swift",
              "kotlin",
              "r",
            ].map((lang) => (
              <MenuItem
                key={lang}
                onClick={() => handleLanguageSelect(lang)}
                sx={{
                  "&:hover": { backgroundColor: "#ffb17a", color: "#000000" },
                }}
              >
                {lang.toUpperCase()}
              </MenuItem>
            ))}
          </Menu>
          {/* Code editor */}
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) =>
              highlight(
                code,
                languages[language] || languages.javascript,
                language
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
              marginBottom: "20px",
            }}
          />
          {/* Publish button */}
          <Button
            type="submit"
            variant="contained"
            startIcon={<SendIcon />}
            sx={{
              backgroundColor: "#ffb17a",
              color: "#000000",
              marginTop: "10px",
            }}
          >
           Publish Code
          </Button>
        </form>
      </Box>
      {/* Success or error message */}
      {message && (
        <Alert severity={message.startsWith("Error") ? "error" : "success"} sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
      {/* List of all code snippets */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#ffffff" }}>
          All Code Snippets
        </Typography>
        {snippets.map((snippet) => (
          <CodeSnippet key={snippet.id} snippet={snippet} />
        ))}
      </Box>
    </Box>
  );
};

export default CodeSnippetEditor;
