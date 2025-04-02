import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "./CodeSnippets.scss";
import EastIcon from "@mui/icons-material/East";
import profile1 from "../../../assets/profile1.jpg";
import profile2 from "../../../assets/profile2.jpeg";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import codesnippet1 from "../../../assets/code snippet 1.png";
import codesnippet2 from "../../../assets/code snippet 2.png";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const CodeSnippets = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  // Framer motion variants for animations
  const leftVariant = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeInOut" } },
  };

  const rightVariant = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeInOut" } },
  };

  const snippetVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } },
  };

  const handleSeeAllClick = () => {
    if (isSignedIn) {
      navigate("/feed");
    } else {
      navigate("/login", { state: { from: "/feed" } });
    }
  };

  return (
    <div className="code-section-main" ref={sectionRef} id="code-snippets">
      {/* Left Side */}
      <motion.div
        className="code-left"
        variants={leftVariant}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <p>Code Snippets</p>
        <h2>Shared Code Snippets</h2>
        <h5>
          Shared Code Snippets on CodeConnect enable developers to quickly share,
          discover, and learn from valuable, reusable code. Contribute and
          collaborate with others to streamline coding and accelerate innovation.
        </h5>
        <button onClick={handleSeeAllClick}>
          See all <EastIcon className="arrow-icon" />
        </button>
      </motion.div>

      {/* Right Side */}
      <motion.div
        className="code-right"
        variants={rightVariant}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Code Snippet 1 */}
        <motion.div
          className="code-snippet1"
          variants={snippetVariant}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.img
            src={profile1}
            alt="profile1"
            className="profile-img"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <div className="snippet-card">
            <FormatQuoteIcon className="quote-icon" />
            <p className="snippet-name">Johnny Five</p>
            <p className="snippet-content">Check out new React templates...</p>
            <img src={codesnippet1} alt="code snippet 1" className="snippet-img" />
          </div>
        </motion.div>

        {/* Code Snippet 2 */}
        <motion.div
          className="code-snippet2"
          variants={snippetVariant}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.img
            src={profile2}
            alt="profile2"
            className="profile-img"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <div className="snippet-card">
            <FormatQuoteIcon className="quote-icon" />
            <p className="snippet-name">Hannah Smith</p>
            <p className="snippet-content">Have a look at new trends...</p>
            <img src={codesnippet2} alt="code snippet 2" className="snippet-img" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CodeSnippets;