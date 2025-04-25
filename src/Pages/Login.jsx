import React, { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); // Change email to username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    try {
      // Convert username to email format
      const email = `${username}@example.com`;
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/feed");
    } catch (error) {
      setError("Invalid username or password.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/feed");
    } catch (error) {
      setError("Google Sign-In failed. Please try again.");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#202338" }}>
      <Card sx={{ maxWidth: 400, padding: 3, backgroundColor: "#2c2f48", color: "#ffffff", borderRadius: "12px" }}>
        <CardContent>
          <Typography variant="h4" sx={{ textAlign: "center", color: "#fffff", mb: 3, fontWeight: "bold" }}>
            Code<span style={{ color: "#ffb17a" }}>Connect</span>
          </Typography>
          <form onSubmit={handleEmailPasswordLogin}>
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
              Login
            </Button>
          </form>
          <Button fullWidth variant="outlined" onClick={handleGoogleSignIn} sx={{ color: "#ffffff", borderColor: "#ffb17a" }}>
            Sign in with Google
          </Button>
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
