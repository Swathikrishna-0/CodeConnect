import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import "./Blogs.scss";
import EastIcon from "@mui/icons-material/East";
import Blog1 from "../../../assets/blog1.png";
import Blog2 from "../../../assets/blog2.png";
import Blog3 from "../../../assets/blog3.png";
import Blog4 from "../../../assets/blog4.png";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase"; // Import Firebase auth

// Blogs component for the landing page
const Blogs = () => {
  const navigate = useNavigate();
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsSignedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Refs to track the visibility of blog sections for animation
  const blogLeftRef = useRef(null);
  const blogRightRef = useRef(null);

  // Check if the blog sections are in view for animation
  const blogLeftInView = useInView(blogLeftRef, {
    once: true,
    margin: "-50px",
  });
  const blogRightInView = useInView(blogRightRef, {
    once: true,
    margin: "-50px",
  });

  // Animation variants for the left blog section
  const blogVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  };

  // Animation variants for the right content section
  const contentVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
  };

  // Transition settings for animations
  const transition = { duration: 0.8, ease: "easeInOut" };

  // Handle "Get Started" or "See all" button click
  const handleGetStartedClick = () => {
    if (isSignedIn) {
      navigate("/feed");
    } else {
      navigate("/login", { state: { from: "/feed" } });
    }
  };

  // Handle "See all" button click (same as above)
  const handleSeeAllClick = () => {
    if (isSignedIn) {
      navigate("/feed");
    } else {
      navigate("/login", { state: { from: "/feed" } });
    }
  };

  return (
    <div className="blog-section-main" id="blogs">
      {/* Left side: Blog post previews with animation */}
      <motion.div
        className="blog-left"
        ref={blogLeftRef}
        initial="hidden"
        animate={blogLeftInView ? "visible" : "hidden"}
        variants={blogVariants}
        transition={transition}
      >
        <div className="blogs-top">
          {/* Blog post 1 */}
          <div
            className="blog-post"
            style={{ backgroundColor: "#424769", marginRight: "20px" }}
          >
            <img src={Blog1} alt="Blog 1" />
            <div className="blog-title"> User Interfaces with Ease</div>
          </div>
          {/* Blog post 2 */}
          <div className="blog-post" style={{ backgroundColor: "#676f9d" }}>
            <img src={Blog2} alt="Blog 2" />
            <div className="blog-title">The Power of Open Source</div>
          </div>
        </div>
        <div className="blogs-bottom">
          {/* Blog post 3 */}
          <div
            className="blog-post"
            style={{ backgroundColor: "#676f9d", marginRight: "20px" }}
          >
            <img src={Blog3} alt="Blog 3" />
            <div className="blog-title">Streamlining Development</div>
          </div>
          {/* Blog post 4 */}
          <div className="blog-post" style={{ backgroundColor: "#424769" }}>
            <img src={Blog4} alt="Blog 4" />
            <div className="blog-title">Artificial Intelligence Revolution</div>
          </div>
        </div>
      </motion.div>

      {/* Right side: Blog section description and button with animation */}
      <motion.div
        className="blog-right"
        ref={blogRightRef}
        initial="hidden"
        animate={blogRightInView ? "visible" : "hidden"}
        variants={contentVariants}
        transition={transition}
      >
        <p>Blogs</p>
        <h2>Featured Blog Posts</h2>
        <h5>
          Discover a wealth of knowledge from fellow developers. Whether it's
          coding tips, tech tutorials, or insights into the latest industry
          trends, our community shares it all. Stay updated with cutting-edge
          solutions, real-world project experiences, and in-depth technical
          articles that empower you to level up your coding game.
        </h5>
        <button className="getstarted-button" onClick={handleSeeAllClick}>
          See all <EastIcon className="arrow-icon" />
        </button>
      </motion.div>
    </div>
  );
};

export default Blogs;
