import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, addDoc, doc, getDoc, query, onSnapshot } from "firebase/firestore";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useParams } from "react-router-dom";
import BlogPost from "./BlogPost";

const BlogPostEditor = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [message, setMessage] = useState("");
  const [post, setPost] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const docRef = doc(db, "profiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const profileData = docSnap.data();
          if (user.providerData[0].providerId === "google.com") {
            user.displayName = user.displayName || profileData.firstName;
            setProfilePic(user.photoURL);
          } else {
            user.displayName = profileData.firstName || user.displayName;
            setProfilePic(profileData.profilePic);
          }
        }
      };
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost(docSnap.data());
        }
      };
      fetchPost();
    }
  }, [id]);

  useEffect(() => {
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

  const handleEditorChange = (content) => {
    setContent(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setMessage("Title is required.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    if (user) {
      try {
        await addDoc(collection(db, "posts"), {
          userId: user.uid,
          userName: user.displayName,
          userProfilePic: profilePic || "",
          title: title.trim(),
          content: content.trim(),
          hashtags: hashtags.split(",").map((hashtag) => hashtag.trim()).filter((hashtag) => hashtag),
          createdAt: new Date(),
          likes: [],
          bookmarks: [],
          comments: [],
          shares: 0,
          reviews: [],
        });
        setTitle("");
        setContent("");
        setHashtags("");
        setMessage("Post created successfully!");
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        console.error("Error adding document: ", error);
        setMessage("Error creating post. Please try again.");
      }
    }
  };

  if (id && post) {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, color: "#ffffff" }}>
          {post.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "#ffb17a", mb: 2 }}>
          {post.hashtags && post.hashtags.length > 0
            ? post.hashtags.map((hashtag) => `#${hashtag}`).join(" ")
            : ""}
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "#ffffff" }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, color: "#ffffff" }}>
        Create a Blog Post
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
        <Editor
          apiKey="wqheav2fbolvt7xe3m7fsnt5o9u29p25j51j3q2jd7lygpzh"
          value={content}
          init={{
            height: 200,
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
        <br />
        <TextField
          fullWidth
          label="Hashtags (comma separated)"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
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
          type="submit"
          variant="contained"
          sx={{ backgroundColor: "#ffb17a", color: "#000000" }}
        >
          Post
        </Button>
      </form>
      {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#ffffff" }}>
          All Blog Posts
        </Typography>
        {posts.map((post) => (
          <BlogPost key={post.id} post={post} />
        ))}
      </Box>
    </Box>
  );
};

export default BlogPostEditor;
