import React, { useRef } from "react";
import { motion, useInView } from "framer-motion"; // Import motion and useInView
import "./CodeSnippets.scss";
import EastIcon from "@mui/icons-material/East";
import profile1 from "../../../assets/profile1.jpg";
import profile2 from "../../../assets/profile2.jpeg";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import codesnippet1 from "../../../assets/code snippet 1.png";
import codesnippet2 from "../../../assets/code snippet 2.png";

const CodeSnippets = () => {
  // Ref to track when the section comes into view
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  // Framer motion variants for animations
  const leftVariant = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeInOut" } }
  };

  const rightVariant = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeInOut" } }
  };

  return (
    // Ref to track section visibility
    <div className="code-section-main" ref={sectionRef}>
      {/* Animate the left side */}
      <motion.div
        className="code-left"
        variants={leftVariant}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <p>Code Snippets</p>
        <h2>Shared Code Snippets</h2>
        <h5>
          Shared Code Snippets on CodeConnect enable developers to quickly
          share, discover, and learn from valuable, reusable code. Contribute
          and collaborate with others to streamline coding and accelerate
          innovation.
        </h5>
        <button>
          See all <EastIcon className="arrow-icon" />
        </button>
      </motion.div>

      {/* Animate the right side */}
      <motion.div
        className="code-right"
        variants={rightVariant}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="code-snippet1">
          <img src={profile1} alt="blog1" className="profile-img" />
          <div className="snippet-card">
            <FormatQuoteIcon className="quote-icon" />
            <p className="snippet-name">Johnny Five</p>
            <p className="snippet-content">Check out new React templates...</p>
            <img src={codesnippet1} alt="blog1" className="snippet-img" />
          </div>
        </div>
        <div className="code-snippet2">
          <img src={profile2} alt="blog1" className="profile-img" />
          <div className="snippet-card">
            <FormatQuoteIcon className="quote-icon" />
            <p className="snippet-name">Hannah Smith</p>
            <p className="snippet-content">Have a look a new trends...</p>
            <img src={codesnippet2} alt="blog1" className="snippet-img" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CodeSnippets;
