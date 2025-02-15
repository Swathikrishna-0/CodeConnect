import React from "react";
import { motion } from "framer-motion";
import "./About.scss";

const About = () => {
  const handleLinkClick = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      className="about-container"
      id="about"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        ABOUT
      </motion.h2>
      
      <motion.h4
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        CodeConnect is a vibrant developer community where programmers of all levels connect, collaborate, and grow. Share knowledge, explore new technologies, and build innovative solutions together.
      </motion.h4>
      
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        QUICK LINKS
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {["home", "blogs", "code-snippets", "podcasts", "forums"].map((link, index) => (
          <motion.h4
            key={link}
            onClick={() => handleLinkClick(link)}
            className="quick-link"
            whileHover={{ scale: 1.1, color: "#007BFF" }}
            transition={{ duration: 0.2 }}
          >
            {link.toUpperCase()}
          </motion.h4>
        ))}
      </motion.div>
      
      <motion.h1
        className="logo logo1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
      >
        Code<span>Connect</span>
      </motion.h1>
    </motion.div>
  );
};

export default About;
