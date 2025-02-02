import React, { useState } from "react";
import { motion } from "framer-motion"; // Import motion from framer-motion
import "../Navbar/Navbar.scss";

const Navbar = () => {
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

  // Framer Motion animation variants for the navbar
  const navbarVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  };

  // Animation for individual tabs
  const tabVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    click: { scale: 1.05, transition: { duration: 0.1 } },
  };

  return (
    // Wrap the entire navbar container with motion.div for animation
    <motion.div
      className="navbar-container-main"
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <h1 className="logo">
        Code<span>Connect</span>
      </h1>

      <div className="navbar-main">
        <div className="navbar-container">
          <nav className="navbar">
            {tabs.map((tab) => (
              // Wrap each tab in a motion.div to animate hover and click events
              <motion.div
                key={tab.name}
                className={`nav-tab ${activeTab === tab.name ? "active" : ""}`}
                onClick={() => handleTabClick(tab)}
                whileHover="hover"
                whileTap="click"
                variants={tabVariants}
              >
                {tab.name}
              </motion.div>
            ))}
          </nav>
        </div>

        <div className="login-btn-container">
          <motion.button
            className="login-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Login
          </motion.button>

          <motion.button
            className="signup-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Sign Up
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
