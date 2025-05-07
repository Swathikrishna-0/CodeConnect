import React, { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/feed");
    } catch (error) {
      setError("Google Sign-In failed. Please try again.");
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
            Welcome to CodeConnect
          </Typography>
          <Button
            fullWidth
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
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
            Sign in with Google
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

export default Login;
