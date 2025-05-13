import React from "react";
import { Routes, Route } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./Login";
import SignUp from "./SignUp";
import Landing from "./Landing";
import Feed from "../Components/MainPages/Feed/Feed";
import Profile from "../Components/MainPages/Profile/Profile";
import Podcasts from "../Components/MainPages/Podcasts/PodcastPage"; // Import Podcasts component
import Myaccount from "../Components/MainPages/MyAccount/Myaccount";

// Auth component handles authentication and routing for the app
const Auth = () => {
  // State for the authenticated user
  const [user, setUser] = React.useState(null);

  // Listen for authentication state changes
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Define routes for login, signup, feed, profile, podcasts, etc.
  return (
    <Routes>
      {/* Show Landing if logged in, otherwise Login */}
      <Route path="/" element={user ? <Landing /> : <Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      {/* Feed and nested routes, protected by authentication */}
      <Route path="/feed/*" element={user ? <Feed /> : <Login />} /> {/* Allow nested routes */}
      <Route path="/profile" element={user ? <Profile /> : <Login />} />
      <Route path="/myaccount" element={user ? <Myaccount/> : <Login />} />
      {/* Podcasts route, protected by authentication */}
      <Route path="/podcasts" element={user ? <Podcasts /> : <Login />} /> {/* Add Podcasts route */}
      {/* Fallback feed route */}
      <Route path="/feed" element={<Feed />} />
    </Routes>
  );
};

export default Auth;