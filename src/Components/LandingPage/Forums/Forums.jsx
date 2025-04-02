import React from "react";
import { motion } from "framer-motion";
import "./Forums.scss";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EastIcon from "@mui/icons-material/East";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import forums from "../../../assets/forums.svg";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const Forums = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  const handleExploreForumsClick = () => {
    if (isSignedIn) {
      navigate("/feed");
    } else {
      navigate("/login", { state: { from: "/feed" } });
    }
  };

  return (
    <motion.div
      id="forums"
      className="forums-container"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Left Section */}
      <motion.div
        className="forums-left"
        initial={{ x: -50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <p className="forums-tag">Forums</p>
        <h2 className="forums-heading">Community Forums</h2>
        <p className="forums-description">
          Join the vibrant CodeConnect Community Forums, where developers of all
          levels come together to share knowledge, solve coding challenges, and
          discuss the latest trends in technology. Connect with like-minded
          peers, ask questions, and collaborate on innovative ideas to grow your
          skills and advance your projects.
        </p>
        <div className="forums-buttons-container">
          <motion.button
            className="forums-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExploreForumsClick}
          >
            Explore Forums
            <EastIcon className="arrow-icon" />
          </motion.button>
        </div>
      </motion.div>

      {/* Right Section */}
      <motion.div
        className="forums-right"
        initial={{ x: 50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {[{ name: "Swathi", upvotes: "1.5k", downvotes: "10", comments: "15" },
          { name: "Priya", upvotes: "2.5k", downvotes: "1.5k", comments: "40" }].map((post, index) => (
          <motion.div
            key={index}
            className="forums-card-container"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="forums-card-name-container">
              <div className="forums-card-name">
                <AccountCircleIcon className="avatar-icon" fontSize="large" />
                <p>{post.name}</p>
              </div>
              <p className="time-stamp">2 hrs ago</p>
            </div>
            <h2>Check out the trending tech stacks</h2>
            <h4>
              Explore the most popular tech stacks shaping the future of
              development. Stay ahead with insights into trending...
            </h4>
            <div className="forums-card-footer">
              <div className="forums-card-left">
                <div className="icon-div">
                  <ArrowCircleUpIcon fontSize="large" style={{ color: "green" }} />
                  {post.upvotes}
                </div>
                <div className="icon-div icon-right">
                  <ArrowCircleDownIcon fontSize="large" style={{ color: "red" }} />
                  {post.downvotes}
                </div>
              </div>
              <div className="icon-div">
                <ChatBubbleOutlineIcon fontSize="large" />
                {post.comments}
              </div>
            </div>
          </motion.div>
        ))}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <img src={forums} alt="forums" className="image-forums" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Forums;
