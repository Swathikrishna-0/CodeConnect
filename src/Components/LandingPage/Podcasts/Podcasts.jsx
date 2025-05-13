import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Podcasts.scss";
import podcast from "../../../assets/podcast.svg";
import EastIcon from "@mui/icons-material/East";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase"; // Import Firebase auth

// Podcasts component for the landing page
const Podcasts = () => {
  const navigate = useNavigate();
  // State to track if user is signed in
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsSignedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Animation variants for the podcast image
  const podcastVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Animation variants for the content section
  const contentVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.3 } },
  };

  // Handle Listen Now button click
  // If signed in, go to /feed, else redirect to login
  const handleListenNowClick = () => {
    if (isSignedIn) {
      navigate("/feed");
    } else {
      navigate("/login", { state: { from: "/feed" } });
    }
  };

  return (
    // Main podcasts section
    <section id="podcasts" className="podcasts-section">
      {/* Animated podcast image */}
      <motion.div
        className="podcasts-image"
        initial="hidden"
        whileInView="visible"
        variants={podcastVariants}
        viewport={{ once: true }}
      >
        <img
          src={podcast} 
          alt="Podcasts"
          className="image"
        />
      </motion.div>

      {/* Animated content section */}
      <motion.div
        className="podcasts-content"
        initial="hidden"
        whileInView="visible"
        variants={contentVariants}
        viewport={{ once: true }}
      >
        <p className="section-tag">Podcasts</p>
        <h2 className="section-heading">Popular Podcasts</h2>
        <p className="section-description">
          Tune into CodeConnect Podcasts, where industry leaders and developers
          explore cutting-edge tech and real-world coding challenges. Get
          insights on React.js, AI, DevOps, and the open-source movement. Stay
          informed and empowered in your development journey.
        </p>
        <div className="cta-buttons">
          {/* Listen Now button */}
          <button className="cta-button" onClick={handleListenNowClick}>
            Listen Now <EastIcon className="arrow-icon" />
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Podcasts;
