import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';

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
}) => {
  return (
    <Box
      id="dev-card"
      sx={{
        width: 600,
        p: 4,
        borderRadius: 3,
        backgroundColor: "#202338",
        color: "#ffffff",
        textAlign: "center",
      }}
    >
      <Avatar
        src=""
        alt={`${firstName} ${lastName}`}
        sx={{ width: 80, height: 80, mb: 2, mx: "auto" }}
      />
      <Typography variant="h5" sx={{ color: "#ffb17a" }}>
        {firstName} {lastName}
      </Typography>
      <Typography variant="subtitle1">
        {role} @ {company}
      </Typography>
      <Typography variant="body2" sx={{ mt: 2 }}>
        <strong>University:</strong> {university}
      </Typography>
      <Typography variant="body2">
        <strong>Education:</strong> {education}
      </Typography>
      <Typography variant="body2">
        <strong>Languages:</strong> {primaryLanguages}
      </Typography>
      <Typography variant="body2">
        <strong>Stack:</strong> {frameworks} + {tools}
      </Typography>
      <Typography variant="body2">
        <strong>Databases:</strong> {databases}
      </Typography>
      <Typography variant="body2">
        <strong>Years of Experience:</strong> {yearsOfExperience}
      </Typography>
      <Typography variant="body2">
        <strong>Current Position:</strong> {currentPosition}
      </Typography>
      <Typography variant="body2" sx={{ mt: 2 }}>
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
      <Typography variant="body2">
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
  );
};

export default DevCard;
