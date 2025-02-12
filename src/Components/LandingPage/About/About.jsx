import React from "react";
import "./About.scss";

const About = () => {
  const handleLinkClick = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="about-container" id="about">
      <h2>ABOUT</h2>
      <h4>CodeConnect is a vibrant developer community where programmers of all levels connect, collaborate, and grow. Share knowledge, explore new technologies, and build innovative solutions together.</h4>
      <h2>QUICK LINKS</h2>
      <div>
        <h4 onClick={() => handleLinkClick("home")} className="quick-link">HOME</h4>
        <h4 onClick={() => handleLinkClick("blogs")} className="quick-link">BLOGS</h4>
        <h4 onClick={() => handleLinkClick("code-snippets")} className="quick-link">CODE SNIPPETS</h4>
        <h4 onClick={() => handleLinkClick("podcasts")} className="quick-link">PODCASTS</h4>
        <h4 onClick={() => handleLinkClick("forums")} className="quick-link">FORUMS</h4>
      </div>
      <h1 className="logo logo1">
        Code<span>Connect</span>
      </h1>
    </div>
  );
};

export default About;
