import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { db } from "../../../firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { TextField, Button, Box, Typography, Alert, MenuItem, Select } from "@mui/material";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      <Typography variant="h5" sx={{ mb: 2, color: "#ffb17a" }}>
        Create a Code Snippet
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          InputLabelProps={{ style: { color: "#C17B49" } }}
          InputProps={{ style: { color: "#ffffff", borderColor:"#ffb17a" } }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#676f9d" },
              "&:hover fieldset": { borderColor: "#ffb17a" },
              "&.Mui-focused fieldset": { borderColor: "#ffb17a" },
            },
          }}
        />
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          fullWidth
          sx={{
            mb: 2,
            color: "#ffffff",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#676f9d" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#ffb17a" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#ffb17a" },
          }}
        >
          <MenuItem value="javascript">JavaScript</MenuItem>
          <MenuItem value="python">Python</MenuItem>
          <MenuItem value="java">Java</MenuItem>
          <MenuItem value="html">HTML</MenuItem>
          <MenuItem value="css">CSS</MenuItem>
          <MenuItem value="c">C</MenuItem>
          <MenuItem value="cpp">C++</MenuItem>
          <MenuItem value="typescript">TypeScript</MenuItem>
          <MenuItem value="ruby">Ruby</MenuItem>
          <MenuItem value="go">Go</MenuItem>
          <MenuItem value="php">PHP</MenuItem>
          <MenuItem value="swift">Swift</MenuItem>
          <MenuItem value="kotlin">Kotlin</MenuItem>
          <MenuItem value="r">R</MenuItem>
        </Select>
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
