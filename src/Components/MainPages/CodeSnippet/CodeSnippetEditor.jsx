import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { db } from "../../../firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { TextField, Button, Box, Typography, Alert, Menu, MenuItem } from "@mui/material";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/themes/prism.css";

const CodeSnippetEditor = () => {
  const { user } = useUser();
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for the dropdown

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

  const handleDropdownOpen = (event) => {
    setAnchorEl(event.currentTarget); // Open the dropdown
  };

  const handleDropdownClose = () => {
    setAnchorEl(null); // Close the dropdown
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang); // Set the selected language
    handleDropdownClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setMessage("Description is required.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    if (user) {
      try {
        await addDoc(collection(db, "codeSnippets"), {
          userId: user.id,
          userName: user.fullName,
          userProfilePic: profilePic || "",
          code: code.trim(),
          description: description.trim(),
          language,
          createdAt: new Date(),
          likes: [],
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
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, color: "#ffffff" }}>
        Create a Code Snippet
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
          {["javascript", "python", "java", "html", "css", "c", "cpp", "typescript", "ruby", "go", "php", "swift", "kotlin", "r"].map((lang) => (
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
        <Editor
          value={code}
          onValueChange={(code) => setCode(code)}
          highlight={(code) => highlight(code, languages[language] || languages.javascript, language)}
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
        <Button
          type="submit"
          variant="contained"
          sx={{ backgroundColor: "#ffb17a", color: "#000000", marginTop: "10px" }}
        >
          Post
        </Button>
      </form>
      {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
    </Box>
  );
};

export default CodeSnippetEditor;
