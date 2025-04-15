import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { db } from "../../../firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";

const BlogPostEditor = () => {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [hashtags, setHashtags] = useState("");
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
    setContent(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      try {
        await addDoc(collection(db, "posts"), {
          userId: user.id,
          userName: user.fullName,
          userProfilePic: profilePic || "", // Ensure profilePic is set correctly
          title: title.trim(),
          content: content.trim(),
          tags: tags.split(",").map((tag) => tag.trim()).filter(tag => tag),
          hashtags: hashtags.split(",").map((hashtag) => hashtag.trim()).filter(hashtag => hashtag),
          createdAt: new Date(),
          likes: [],
          comments: [],
          shares: 0,
          reviews: [],
        });
        setTitle("");
        setContent("");
        setTags("");
        setHashtags("");
        setMessage("Post created successfully!");
        setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
      } catch (error) {
        console.error("Error adding document: ", error);
        setMessage("Error creating post. Please try again.");
      }
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, color: "#ffb17a" }}>
        Create a Post
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          value={content}
          init={{
            height: 500,
            menubar: true,
            plugins: [
              "advlist autolink lists link image charmap print preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table paste code help wordcount",
              "codesample emoticons table advtable",
              "textcolor colorpicker",
              "fullscreen hr pagebreak save template",
            ],
            toolbar:
              "undo redo | formatselect | fontsizeselect | fontselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | codesample emoticons | hr pagebreak | preview fullscreen",
            fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
            font_formats: "Arial=arial,helvetica,sans-serif; Times New Roman=times new roman,times; Verdana=verdana,geneva;",
            content_style: "body { font-family:Arial,sans-serif; font-size:14px; background-color:#f4f4f4; padding:10px; }",
            image_title: true,
            automatic_uploads: true,
            file_picker_types: 'image',
            file_picker_callback: function (cb, value, meta) {
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');
              input.onchange = function () {
                const file = this.files[0];
                const reader = new FileReader();
                reader.onload = function () {
                  const id = 'blobid' + new Date().getTime();
                  const blobCache = tinymce.activeEditor.editorUpload.blobCache;
                  const base64 = reader.result.split(',')[1];
                  const blobInfo = blobCache.create(id, file, base64);
                  blobCache.add(blobInfo);
                  cb(blobInfo.blobUri(), { title: file.name });
                };
                reader.readAsDataURL(file);
              };
              input.click();
            },
          }}
          onEditorChange={handleEditorChange}
        />
        <TextField
          fullWidth
          label="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          InputLabelProps={{ style: { color: "#C17B49" } }}
          InputProps={{ style: { color: "#ffffff", borderColor: "#ffb17a" } }}
          sx={{
            mt: 2,
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#676f9d" },
              "&:hover fieldset": { borderColor: "#ffb17a" },
              "&.Mui-focused fieldset": { borderColor: "#ffb17a" },
            },
          }}
        />
        <TextField
          fullWidth
          label="Hashtags (comma separated)"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
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
        <Button
          type="submit"
          variant="contained"
          sx={{ backgroundColor: "#ffb17a", color: "#000000" }}
        >
          Post
        </Button>
      </form>
      {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
    </Box>
  );
};

export default BlogPostEditor;
