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
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        ABOUT
      </motion.h2>
      
      <motion.h4
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        CodeConnect is a vibrant developer community where programmers of all levels connect, collaborate, and grow. Share knowledge, explore new technologies, and build innovative solutions together.
      </motion.h4>
      
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        QUICK LINKS
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
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
      <br/>
      <br/>
      <br/>
      <br/>
      <h4>Copyright © 2025 Swathi Priya. All Rights Reserved.</h4>
    </motion.div>
  );
};

export default About;
