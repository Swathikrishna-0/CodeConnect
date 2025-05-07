import React, { useState, useEffect } from "react";
import { getDatabase, ref, push, onValue } from "firebase/database";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Alert,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommentSection from "./CommentSection";
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { color } from "framer-motion";
import SendIcon from "@mui/icons-material/Send";

const GroupDiscussion = () => {
  const { groupId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const groupName = location.state?.groupName || "Group";

  const [user, setUser] = useState(null);
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const fetchProfile = async () => {
          const docRef = doc(db, "profiles", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const profileData = docSnap.data();
            if (!currentUser.displayName) {
              currentUser.displayName = profileData.firstName;
            }
            currentUser.photoURL =
              profileData.profilePic || currentUser.photoURL;
          }
        };
        fetchProfile();
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const questionsRef = ref(db, `groups/${groupId}/questions`);

    const unsubscribe = onValue(
      questionsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const questionsList = Object.entries(data)
            .map(([id, value]) => ({ id, ...value }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt in descending order
          setQuestions(questionsList);
        } else {
          setQuestions([]);
        }
        setError(null);
      },
      (error) => {
        console.error("Error fetching questions:", error);
        setError(
          "Failed to fetch questions. Please check your database connection."
        );
      }
    );

    return () => unsubscribe();
  }, [groupId]);

  const handlePostQuestion = async () => {
    if (!topic.trim() || !details.trim()) {
      toast.error("Both fields are required.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!user) {
      toast.error("You must be logged in to post a question.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const db = getDatabase();
      const questionsRef = ref(db, `groups/${groupId}/questions`);

      const newQuestion = {
        userId: user.uid,
        userName: user.displayName || user.email.split("@")[0], // Extract username from email
        userProfilePic: user.photoURL || "/default-avatar.png", // Use updated photoURL
        topic,
        details,
        createdAt: new Date().toISOString(),
      };

      await push(questionsRef, newQuestion);

      setTopic("");
      setDetails("");
      toast.success("Question posted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error posting question:", error);
      toast.error("Failed to post question. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <ToastContainer />
      <Typography variant="h4" sx={{ color: "#676f9d", marginBottom: "20px" }}>
        Group:{" "}
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#fff" }}>
          {groupName}
        </Typography>
      </Typography>
      <Box
        component="form"
        sx={{
          backgroundColor: "#2c2f48",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "40px",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handlePostQuestion();
        }}
      >
        <Typography
          variant="h5"
          sx={{ color: "#ffffff", marginBottom: "10px" }}
        >
          Post a Question
        </Typography>
        <TextField
          fullWidth
          label="Topic of your question"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
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
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Write your question in detail"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
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
          Post Question
        </Button>
      </Box>
      <Box>
        <Typography
          variant="h5"
          sx={{
            color: "#fff",
            marginBottom: "25px",
            fontWeight: "bold",
            fontSize: "28px",
          }}
        >
          All Questions
        </Typography>
        {error && (
          <Alert severity="error" sx={{ marginBottom: "20px" }}>
            {error}
          </Alert>
        )}
        {questions.map((question) => (
          <Box
            key={question.id}
            sx={{
              mb: 4,
              p: 3,
              borderRadius: "12px",
              background: "linear-gradient(145deg, #2c2f48, #1a1a2e)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <Avatar
                src={question.userProfilePic || "/default-avatar.png"} // Fallback to default avatar
                alt="User"
                sx={{
                  width: "40px",
                  height: "40px",
                  marginRight: "10px",
                  cursor: "pointer", // Make the avatar clickable
                  transition: "box-shadow 0.3s",
                  "&:hover": {
                    boxShadow: "0 0 10px #ffb17a", // Add glowing effect on hover
                  },
                }}
                onClick={() => navigate(`/profile/${question.userId}`)} // Navigate to the user's public profile
              />
              <Typography variant="h6" sx={{ color: "#ffffff" }}>
                {question.userName || question.userEmail?.split("@")[0]} {/* Extract username from email */}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ color: "#ffb17a" }}>
              {question.topic}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#ffffff", marginBottom: "10px" }}
            >
              {question.details}
            </Typography>
            <Typography variant="body2" sx={{ color: "#676f9d" }}>
              Posted on: {new Date(question.createdAt).toLocaleString()}
            </Typography>

            <CommentSection questionId={question.id} groupId={groupId} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default GroupDiscussion;
