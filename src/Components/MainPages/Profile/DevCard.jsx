import React from "react";
import { Box, Avatar, Typography } from "@mui/material";
import Bitbyte from "../../../assets/Bitbyte.png";

// DevCard component displays a developer's profile card with details and avatar
const DevCard = ({
  firstName,
  lastName,
  company,
  university,
  education,
  role,
  primaryLanguages,
  frameworks,
  databases,
  tools,
  yearsOfExperience,
  currentPosition,
  github,
  linkedin,
  portfolio,
  stackOverflow,
  blog,
  twitter,
  favoriteTechStack,
  learningGoals,
  certifications,
  achievements,
  preferredIDE,
  openToWork,
  openSource,
  profilePic, // Accept Gmail display picture
}) => {
  return (
    // Main card container
    <Box
      id="dev-card"
      sx={{
        width: 600,
        p: 4,
        borderRadius: 3,
        backgroundColor: "#202338",
        color: "#ffffff",
        textAlign: "center",
        position: "relative", // Enable positioning for the background image
        overflow: "hidden", // Ensure the image doesn't overflow the card
      }}
    >
      {/* Bitbyte mascot image as background */}
      <Box
        component="img"
        src={Bitbyte}
        alt="Bitbyte"
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "300px",
          opacity: 1,
          zIndex: 0,
        }}
      />
      {/* User avatar */}
      <Avatar
        src={profilePic || ""} // Use Gmail display picture or fallback to an empty string
        alt={`${firstName} ${lastName}`}
        sx={{
          width: 80,
          height: 80,
          mb: 2,
          mx: "auto",
          zIndex: 1,
        }}
      />
      {/* Main profile info */}
      <Box sx={{ textAlign: "center", mb: 2, zIndex: 1, position: "relative" }}>
        <Typography variant="h5" sx={{ color: "#ffb17a" }}>
          {firstName} {lastName}
        </Typography>
        <Typography variant="subtitle1">
          {role} @ {company}
        </Typography>
        {/* Education and language info */}
        <Box sx={{ textAlign: "left", mb: 2, display: "flex", mt: 2 }}>
          <Box>
            <Typography variant="body2">
              <strong>University:</strong> {university}
            </Typography>
            <Typography variant="body2">
              <strong>Education:</strong> {education}
            </Typography>
            <Typography variant="body2">
              <strong>Languages:</strong> {primaryLanguages}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">
              <strong>Databases:</strong> {databases}
            </Typography>
            <Typography variant="body2">
              <strong>Years of Experience:</strong> {yearsOfExperience}
            </Typography>
            <Typography variant="body2">
              <strong>Current Position:</strong> {currentPosition}
            </Typography>
          </Box>
        </Box>
        <hr/>
        {/* Tech stack, links, and other details */}
        <Box sx={{ textAlign: "left", mb: 2, display: "flex", maxWidth: "75%" }}>
          <Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              <strong>Stack:</strong> {frameworks} + {tools}
            </Typography>
            <Typography variant="body2">
              <strong>GitHub:</strong> {github}
            </Typography>
            <Typography variant="body2">
              <strong>LinkedIn:</strong> {linkedin}
            </Typography>
            <Typography variant="body2">
              <strong>Portfolio:</strong> {portfolio}
            </Typography>
            <Typography variant="body2">
              <strong>Stack Overflow:</strong> {stackOverflow}
            </Typography>
            <Typography variant="body2">
              <strong>Blog:</strong> {blog}
            </Typography>
            <Typography variant="body2">
              <strong>Twitter:</strong> {twitter}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              <strong>Favorite Tech Stack:</strong> {favoriteTechStack}
            </Typography>
            <Typography variant="body2">
              <strong>Learning Goals:</strong> {learningGoals}
            </Typography>
            <Typography variant="body2">
              <strong>Certifications:</strong> {certifications}
            </Typography>
            <Typography variant="body2">
              <strong>Achievements:</strong> {achievements}
            </Typography>
            <Typography variant="body2">
              <strong>Preferred IDE:</strong> {preferredIDE}
            </Typography>
            <Typography variant="body2">
              <strong>Open to Work:</strong> {openToWork}
            </Typography>
            <Typography variant="body2">
              <strong>Open Source Contributor:</strong> {openSource}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DevCard;
