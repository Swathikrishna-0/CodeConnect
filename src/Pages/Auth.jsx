import React from "react";
import { Routes, Route } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./Login";
import SignUp from "./SignUp";
import Landing from "./Landing";
import Feed from "../Components/MainPages/Feed/Feed";
import Profile from "../Components/MainPages/Profile/Profile";
import Myaccount from "../Components/MainPages/MyAccount/Myaccount";

const Auth = () => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Routes>
      <Route path="/" element={user ? <Landing /> : <Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/feed" element={user ? <Feed /> : <Login />} />
      <Route path="/profile" element={user ? <Profile /> : <Login />} />
      <Route path="/myaccount" element={user ? <Myaccount /> : <Login />} />
    </Routes>
  );
};

export default Auth;