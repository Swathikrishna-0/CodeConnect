import React, { useState, useEffect } from "react";
import { Container, Button, Typography } from "@mui/material";
import DevCard from "../Profile/DevCard";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";

// DevCardPage component displays the user's Dev Card and export options
const DevCardPage = () => {
  // State for user and profile data
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch user profile data from Firestore
  useEffect(() => {
    if (user) {
      const fetchProfileData = async () => {
        try {
          const docRef = doc(db, "profiles", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfileData(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      };
      fetchProfileData();
    }
  }, [user]);

  // Export Dev Card as PDF using html2canvas and jsPDF
  const exportToPDF = () => {
    const input = document.getElementById("dev-card");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save("CodeConnect_DevCard.pdf");
    });
  };

  // Export Dev Card as PNG image using html2canvas
  const exportToImage = () => {
    const input = document.getElementById("dev-card");
    html2canvas(input).then((canvas) => {
      const link = document.createElement("a");
      link.download = "CodeConnect_DevCard.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  // Show loading state if profile data is not loaded yet
  if (!profileData) {
    return (
      <Container
        maxWidth="md"
        sx={{ mt: 4, textAlign: "center", color: "#ffffff" }}
      >
        <Typography variant="h5" sx={{ color: "#ffb17a" }}>
          Loading Dev Card...
        </Typography>
      </Container>
    );
  }

  return (
    // Main container for Dev Card and export buttons
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        textAlign: "center",
        color: "#ffffff",
        backgroundColor: "#424769",
        borderRadius: 2,
        padding: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Heading */}
      <Typography
        variant="h4"
        sx={{ mb: 4, color: "#ffb17a", fontWeight: "bold" }}
      >
        Your Dev Card
      </Typography>

      {/* DevCard component displays user profile info */}
      <DevCard
        firstName={profileData.firstName}
        lastName={profileData.lastName}
        company={profileData.company}
        university={profileData.university}
        education={profileData.education}
        role={profileData.role}
        primaryLanguages={profileData.primaryLanguages}
        frameworks={profileData.frameworks}
        databases={profileData.databases}
        tools={profileData.tools}
        yearsOfExperience={profileData.yearsOfExperience}
        currentPosition={profileData.currentPosition}
        github={profileData.github}
        linkedin={profileData.linkedin}
        portfolio={profileData.portfolio}
        stackOverflow={profileData.stackOverflow}
        blog={profileData.blog}
        twitter={profileData.twitter}
        favoriteTechStack={profileData.favoriteTechStack}
        learningGoals={profileData.learningGoals}
        certifications={profileData.certifications}
        achievements={profileData.achievements}
        preferredIDE={profileData.preferredIDE}
        openToWork={profileData.openToWork ? "Yes" : "No"}
        openSource={profileData.openSource ? "Yes" : "No"}
      />
      {/* Export buttons */}
      <Container>
        <Button
          onClick={exportToPDF}
          variant="contained"
          sx={{
            mt: 3,
            backgroundColor: "#ffb17a",
            color: "#000000",
            fontWeight: "bold",
          }}
        >
          Download Dev Card (PDF)
        </Button>
        <Button
          onClick={exportToImage}
          variant="contained"
          sx={{
            mt: 2,
            ml: 2,
            backgroundColor: "#676f9d",
            color: "#ffffff",
            fontWeight: "bold",
          }}
        >
          Download Dev Card (Image)
        </Button>
      </Container>
    </Container>
  );
};

export default DevCardPage;
