import React from "react";
import "./Forums.scss";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EastIcon from "@mui/icons-material/East";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import forums from "../../../assets/forums.svg";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const Forums = () => {
  return (
    <div className="forums-container">
      <div className="forums-left">
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
          <button className="forums-button">
            Explore Forums
            <EastIcon className="arrow-icon" />
          </button>
        </div>
      </div>
      <div className="forums-right">
        <div className="forums-card-container">
          <div className="forums-card-name-container">
            <div className="forums-card-name">
              <AccountCircleIcon className="avatar-icon" fontSize="large" />
              <p>Swathi</p>
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
                <ArrowCircleUpIcon fontSize="large" style={{color: "green"}}/>
                1.5k
              </div>
              <div className="icon-div icon-right">
                <ArrowCircleDownIcon fontSize="large" style={{color: "red"}}/>
                10
              </div>
            </div>
            <div className="icon-div">
              <ChatBubbleOutlineIcon fontSize="large" />
              15
            </div>
          </div>
        </div>
        <div className="forums-card-container">
          <div className="forums-card-name-container">
            <div className="forums-card-name">
              <AccountCircleIcon className="avatar-icon" fontSize="large" />
              <p>Priya</p>
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
                <ArrowCircleUpIcon fontSize="large"style={{color: "green"}} />
                2.5k
              </div>
              <div className="icon-div icon-right">
                <ArrowCircleDownIcon fontSize="large" style={{color: "red"}}/>
                1.5k
              </div>
            </div>
            <div className="icon-div">
              <ChatBubbleOutlineIcon fontSize="large"/>
              40
            </div>
          </div>
        </div>
        <div>
          <img src={forums} alt="forums" className="image-forums" />
        </div>
      </div>
    </div>
  );
};

export default Forums;
