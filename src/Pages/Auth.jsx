import React from "react";
import { Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Login from "./Login";
import SignUp from "./SignUp";
import Landing from "./Landing";
import Feed from "../Components/MainPages/Feed/Feed";
import Profile from "../Components/MainPages/Profile/Profile";

const Auth = () => {
  return (
    <Routes>
      {/* Protected Route: Only signed-in users can access */}
      <Route path="/" element={<SignedIn><Landing /></SignedIn>} />
      {/* Show login/signup page when user is signed out */}
      <Route
        path="/login"
        element={
          <SignedOut>
            <Login />
          </SignedOut>
        }
      />
      <Route
        path="/signup"
        element={
          <SignedOut>
            <SignUp />
          </SignedOut>
        }
      />
      <Route path="/feed" element={<Feed />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default Auth;
