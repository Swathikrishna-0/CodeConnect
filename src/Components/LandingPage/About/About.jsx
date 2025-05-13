import React from "react";
import { motion } from "framer-motion";
import "./About.scss";

// About component for the landing page
const About = () => {
  // Handles smooth scrolling to a section by id
  const handleLinkClick = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  return (
    // Main container with animation
    <motion.div
      className="about-container"
      id="about"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      {/* ABOUT heading with animation */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        ABOUT
      </motion.h2>
      
      {/* Description of CodeConnect */}
      <motion.h4
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        CodeConnect is a vibrant developer community where programmers of all levels connect, collaborate, and grow. Share knowledge, explore new technologies, and build innovative solutions together.
      </motion.h4>
      
      {/* QUICK LINKS heading with animation */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        QUICK LINKS
      </motion.h2>
      
      {/* Quick links section with animation */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
      >
        {/* Render each quick link */}
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
      {/* Spacing and copyright */}
      <br/>
      <br/>
      <br/>
      <br/>
      <h4>Copyright © 2025 Swathi Priya. All Rights Reserved.</h4>
    </motion.div>
  );
};

export default About;
