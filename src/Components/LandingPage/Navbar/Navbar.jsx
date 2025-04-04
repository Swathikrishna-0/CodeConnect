import React, { useState, useEffect } from "react";
import { useUser, SignedIn, SignedOut, SignOutButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Avatar } from "@mui/material";
import { db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import "../Navbar/Navbar.scss";

const Navbar = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Home");
  const [profilePic, setProfilePic] = useState(null);

  const tabs = [
    { name: "HOME", id: "home" },
    { name: "BLOGS", id: "blogs" },
    { name: "CODE SNIPPETS", id: "code-snippets" },
    { name: "PODCASTS", id: "podcasts" },
    { name: "FORUMS", id: "forums" },
    { name: "ABOUT", id: "about" },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab.name);
    document.getElementById(tab.id).scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = tabs.map(tab => document.getElementById(tab.id));
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach(section => {
        if (section.offsetTop <= scrollPosition && section.offsetTop + section.offsetHeight > scrollPosition) {
          setActiveTab(section.id.replace("-", " ").toUpperCase());
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [tabs]);

  useEffect(() => {
    if (user) {
      const fetchProfilePic = async () => {
        const docRef = doc(db, 'profiles', user.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfilePic(docSnap.data().profilePic);
        }
      };
      fetchProfilePic();
    }
  }, [user]);

  return (
    <motion.div className="navbar-container-main">
      <h1 className="logo">
        Code<span>Connect</span>
      </h1>

      <div className="navbar-main">
        <nav className="navbar">
          {tabs.map((tab) => (
            <motion.div
              key={tab.name}
              className={`nav-tab ${activeTab === tab.name ? "active" : ""}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab.name}
            </motion.div>
          ))}
        </nav>

        <div className="auth-buttons">
          {/* If user is signed in, show Sign Out button */}
          <SignedIn>
            <span style={{ marginRight: "10px", color: "#ffb17a", textDecoration: "underline" }}>Hi, {user?.firstName}!</span>
            {profilePic && <Avatar src={profilePic} sx={{ width: 30, height: 30, marginRight: "10px" }} />}
            <SignOutButton className="login-button" />
          </SignedIn>

          {/* If user is signed out, show login/signup buttons */}
          <SignedOut>
            <motion.button
              className="login-button"
              onClick={() => navigate("/login")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>

            <motion.button
              className="signup-button"
              onClick={() => navigate("/signup")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
          </SignedOut>
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
