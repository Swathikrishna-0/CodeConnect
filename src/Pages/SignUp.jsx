import React, { useState } from "react";
import { auth, googleProvider, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, Card, CardContent } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleEmailPasswordSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, username + "@example.com", password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username,
        createdAt: new Date(),
      });

      await setDoc(doc(db, "profiles", user.uid), {
        username,
        profilePic: null,
      });

      navigate("/feed");
    } catch (error) {
      setError("Signup failed. Please try again.");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        username: user.displayName || "Google User",
        email: user.email,
        createdAt: new Date(),
      }, { merge: true });

      navigate("/feed");
    } catch (error) {
      setError("Google Sign-Up failed. Please try again.");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#202338" }}>
      <Card sx={{ maxWidth: 400, padding: 3, backgroundColor: "#2c2f48", color: "#ffffff", borderRadius: "12px" }}>
        <CardContent>
          <Typography variant="h4" sx={{ textAlign: "center", color: "#ffb17a", mb: 3 }}>
            CodeConnect
          </Typography>
          <form onSubmit={handleEmailPasswordSignUp}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputLabelProps={{ style: { color: "#ffffff" } }}
              InputProps={{
                style: { color: "#ffffff", borderColor: "#ffb17a" },
              }}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#676f9d" },
                  "&:hover fieldset": { borderColor: "#ffb17a" },
                  "&.Mui-focused fieldset": { borderColor: "#ffb17a" },
                },
              }}
            />
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ style: { color: "#ffffff" } }}
              InputProps={{
                style: { color: "#ffffff", borderColor: "#ffb17a" },
                endAdornment: (
                  <IconButton onClick={togglePasswordVisibility} sx={{ color: "#ffffff" }}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#676f9d" },
                  "&:hover fieldset": { borderColor: "#ffb17a" },
                  "&.Mui-focused fieldset": { borderColor: "#ffb17a" },
                },
              }}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ backgroundColor: "#ffb17a", color: "#000", mb: 2 }}>
              Sign Up
            </Button>
          </form>
          <Button fullWidth variant="outlined" onClick={handleGoogleSignUp} sx={{ color: "#ffffff", borderColor: "#ffb17a" }}>
            Sign up with Google
          </Button>
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SignUp;