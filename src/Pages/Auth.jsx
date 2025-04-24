import React from "react";
import { Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Login from "./Login";
import SignUp from "./SignUp";
import Landing from "./Landing";
import Feed from "../Components/MainPages/Feed/Feed";
import Profile from "../Components/MainPages/Profile/Profile";
import Myaccount from "../Components/MainPages/MyAccount/Myaccount";

const Auth = () => {
  return (
    <Routes>
      <Route path="/" element={<SignedIn><Landing /></SignedIn>} />
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
      <Route path="/myaccount" element={<Myaccount />} />
    </Routes>
  );
};

export default Auth;