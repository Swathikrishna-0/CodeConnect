import React, { useState } from "react";
import { auth, googleProvider, db } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          username: user.displayName || "Google User",
          email: user.email,
          createdAt: new Date(),
        },
        { merge: true }
      );

      navigate("/feed");
    } catch (error) {
      setError("Google Sign-Up failed. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#202338",
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          padding: 3,
          backgroundColor: "#2c2f48",
          color: "#ffffff",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            sx={{
              color: "#ffb17a",
              mb: 3,
              fontWeight: "bold",
            }}
          >
            Join CodeConnect
          </Typography>
          <Button
            fullWidth
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignUp}
            sx={{
              backgroundColor: "#ffb17a",
              color: "#000",
              fontWeight: "bold",
              p: 1.5,
              "&:hover": {
                backgroundColor: "#e6a965",
              },
            }}
          >
            Sign up with Google
          </Button>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SignUp;