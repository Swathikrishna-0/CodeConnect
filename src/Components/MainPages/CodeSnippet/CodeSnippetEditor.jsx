import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { db } from "../../../firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";

const CodeSnippetEditor = () => {
  const { user } = useUser();
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [message, setMessage] = useState("");

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

  const handleEditorChange = (content) => {
    setCode(content);
  };

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
          createdAt: new Date(),
          likes: [],
          comments: [],
          shares: 0,
        });
        setCode("");
        setDescription("");
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
        <Editor
          apiKey="wqheav2fbolvt7xe3m7fsnt5o9u29p25j51j3q2jd7lygpzh"
          value={code}
          init={{
            height: 300,
            menubar: false,
            plugins: [
              "advlist autolink lists link image charmap print preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table paste code help wordcount",
              "codesample",
            ],
            toolbar:
              "undo redo | formatselect | bold italic backcolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | removeformat | help | \
              codesample",
          }}
          onEditorChange={handleEditorChange}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ backgroundColor: "#ffb17a", color: "#000000" ,marginTop:"10px" }}
        >
          Post
        </Button>
      </form>
      {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
    </Box>
  );
};

export default CodeSnippetEditor;
