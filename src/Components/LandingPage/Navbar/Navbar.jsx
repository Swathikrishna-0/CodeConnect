import React, { useState, useEffect } from "react";
import { useUser, SignedIn, SignedOut, SignOutButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../Navbar/Navbar.scss";

const Navbar = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Home");

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
            <span>Welcome, {user?.firstName}</span>
            <SignOutButton />
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
