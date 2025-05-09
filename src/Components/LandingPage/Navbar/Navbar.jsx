import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Avatar } from "@mui/material";
import { auth, db } from "../../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "../Navbar/Navbar.scss";
import logo from "../../../assets/codeconnect_logo2.png"; // Import the logo image

const Navbar = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Home");
  const [profilePic, setProfilePic] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const fetchProfilePic = async () => {
          const docRef = doc(db, "profiles", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfilePic(docSnap.data().profilePic);
          }
        };
        fetchProfilePic();
      } else {
        setProfilePic(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/login");
  };

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
      const sections = tabs.map((tab) => document.getElementById(tab.id));
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((section) => {
        if (
          section.offsetTop <= scrollPosition &&
          section.offsetTop + section.offsetHeight > scrollPosition
        ) {
          setActiveTab(section.id.replace("-", " ").toUpperCase());
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [tabs]);

  return (
    <motion.div className="navbar-container-main">
      <div className="logo" style={{ display: "flex", alignItems: "center", gap: "10px" ,mb: "10px"}}>
        <img src={logo} alt="CodeConnect Logo" height={40} /> {/* Logo image */}
        <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#fff" }}>
          Code<span style={{ color: "#ffb17a" }}>Connect</span>
        </span>
      </div>

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
          {user ? (
            <>
              <span
                style={{
                  marginRight: "10px",
                  color: "#ffb17a",
                  textDecoration: "underline",
                }}
              >
                Hi, {user.displayName || "User"}!
              </span>
              {profilePic && (
                <Avatar
                  src={profilePic}
                  sx={{ width: 30, height: 30, marginRight: "10px" }}
                />
              )}
              <motion.button
                className="signup-button"
                onClick={handleSignOut}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Out
              </motion.button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
