import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Alert,
  Grid,
  Avatar,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Stepper steps for the profile form
const steps = [
  "Personal Info",
  "Technical Skills",
  "Developer Presence",
  "Preferences & Recognition",
];

// Profile component for editing and saving user profile data
const Profile = () => {
  // State for user, feedback message, and stepper
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch profile data from Firestore and populate formik values
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const docRef = doc(db, "profiles", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            formik.setValues({
              ...formik.values,
              ...data, // Merge existing values with fetched data
            });
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      };
      fetchProfile();
    }
  }, [user]);

  // Formik for form state and validation
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      company: "",
      university: "",
      education: "",
      role: "",
      github: "",
      linkedin: "",
      primaryLanguages: "",
      frameworks: "",
      databases: "",
      tools: "",
      yearsOfExperience: "",
      employmentType: "",
      openToWork: false,
      currentPosition: "",
      portfolio: "",
      stackOverflow: "",
      blog: "",
      twitter: "",
      favoriteTechStack: "",
      learningGoals: "",
      openSource: false,
      preferredIDE: "",
      certifications: "",
      hackathonParticipation: false,
      achievements: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
    }),
    onSubmit: async (values) => {
      if (user) {
        try {
          await setDoc(doc(db, "profiles", user.uid), values);
          setMessage("Profile saved successfully!");
          setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
        } catch (error) {
          console.error("Error saving profile:", error);
        }
      }
    },
  });

  // Handle next step in stepper and save partial data
  const handleNext = async () => {
    if (user) {
      const stepData = {};
      // Save only the fields relevant to the current step
      if (activeStep === 0) {
        stepData.firstName = formik.values.firstName;
        stepData.lastName = formik.values.lastName;
        stepData.company = formik.values.company;
        stepData.university = formik.values.university;
        stepData.education = formik.values.education;
        stepData.role = formik.values.role;
      } else if (activeStep === 1) {
        stepData.primaryLanguages = formik.values.primaryLanguages;
        stepData.frameworks = formik.values.frameworks;
        stepData.databases = formik.values.databases;
        stepData.tools = formik.values.tools;
        stepData.yearsOfExperience = formik.values.yearsOfExperience;
        stepData.currentPosition = formik.values.currentPosition;
      } else if (activeStep === 2) {
        stepData.github = formik.values.github;
        stepData.linkedin = formik.values.linkedin;
        stepData.portfolio = formik.values.portfolio;
        stepData.stackOverflow = formik.values.stackOverflow;
        stepData.blog = formik.values.blog;
        stepData.twitter = formik.values.twitter;
      } else if (activeStep === 3) {
        stepData.favoriteTechStack = formik.values.favoriteTechStack;
        stepData.learningGoals = formik.values.learningGoals;
        stepData.certifications = formik.values.certifications;
        stepData.achievements = formik.values.achievements;
        stepData.preferredIDE = formik.values.preferredIDE;
        stepData.openToWork = formik.values.openToWork;
        stepData.openSource = formik.values.openSource;
      }

      try {
        await setDoc(doc(db, "profiles", user.uid), stepData, { merge: true });
        if (activeStep < steps.length - 1) {
          setActiveStep((prevStep) => prevStep + 1);
        } else {
          setMessage("Profile saved successfully!");
          setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
        }
      } catch (error) {
        console.error("Error saving step data:", error);
      }
    }
  };

  // Handle back step in stepper
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  // Handle full form submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user) {
      try {
        await setDoc(doc(db, "profiles", user.uid), formik.values);
        setMessage("Profile saved successfully!");
        setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
      } catch (error) {
        console.error("Error saving profile:", error);
      }
    }
  };

  // Export Dev Card as PDF
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

  // Export Dev Card as PNG image
  const exportToImage = () => {
    const input = document.getElementById("dev-card");
    html2canvas(input).then((canvas) => {
      const link = document.createElement("a");
      link.download = "CodeConnect_DevCard.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  return (
    // Main profile form container
    <Container
      maxWidth="md"
      sx={{ backgroundColor: "#424769", borderRadius: "8px", mt: 4, p: 3 }}
    >
      {/* Profile heading */}
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ color: "#ffb17a", textAlign: "center", fontWeight: "bold" }}
        >
          Profile
        </Typography>
      </Box>
      {/* User avatar */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Avatar
          src={user?.photoURL || ""}
          alt="User Avatar"
          sx={{ width: 100, height: 100, border: "2px solid #ffb17a" }}
        />
      </Box>
      {/* Stepper for multi-step form */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {/* Profile form fields for each step */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Step 0: Personal Info */}
          {activeStep === 0 && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.firstName && Boolean(formik.errors.firstName)
                  }
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.lastName && Boolean(formik.errors.lastName)
                  }
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="company"
                  name="company"
                  label="Company"
                  value={formik.values.company}
                  onChange={formik.handleChange}
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="university"
                  name="university"
                  label="University"
                  value={formik.values.university}
                  onChange={formik.handleChange}
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="education"
                  name="education"
                  label="Education"
                  value={formik.values.education}
                  onChange={formik.handleChange}
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="role"
                  name="role"
                  label="Role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                />
              </Grid>
            </>
          )}
          {/* Step 1: Technical Skills */}
          {activeStep === 1 && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="primaryLanguages"
                  name="primaryLanguages"
                  label="Primary Languages"
                  value={formik.values.primaryLanguages}
                  onChange={formik.handleChange}
                  helperText="e.g., JavaScript, Python"
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="frameworks"
                  name="frameworks"
                  label="Frameworks/Libraries"
                  value={formik.values.frameworks}
                  onChange={formik.handleChange}
                  helperText="e.g., React, Node.js, Django"
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="databases"
                  name="databases"
                  label="Databases"
                  value={formik.values.databases}
                  onChange={formik.handleChange}
                  helperText="e.g., MySQL, MongoDB"
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="tools"
                  name="tools"
                  label="Tools & Platforms"
                  value={formik.values.tools}
                  onChange={formik.handleChange}
                  helperText="e.g., Git, Docker, AWS"
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  label="Years of Experience"
                  value={formik.values.yearsOfExperience}
                  onChange={formik.handleChange}
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="currentPosition"
                  name="currentPosition"
                  label="Current Position"
                  value={formik.values.currentPosition}
                  onChange={formik.handleChange}
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                />
              </Grid>
            </>
          )}
          {/* Step 2: Developer Presence */}
          {activeStep === 2 && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="github"
                  name="github"
                  label="GitHub Link"
                  value={formik.values.github}
                  onChange={formik.handleChange}
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="linkedin"
                  name="linkedin"
                  label="LinkedIn Link"
                  value={formik.values.linkedin}
                  onChange={formik.handleChange}
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="portfolio"
                  name="portfolio"
                  label="Portfolio Website"
                  value={formik.values.portfolio}
                  onChange={formik.handleChange}
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="stackOverflow"
                  name="stackOverflow"
                  label="Stack Overflow Profile"
                  value={formik.values.stackOverflow}
                  onChange={formik.handleChange}
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="blog"
                  name="blog"
                  label="Dev.to / Medium Blog Link"
                  value={formik.values.blog}
                  onChange={formik.handleChange}
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="twitter"
                  name="twitter"
                  label="Twitter Handle"
                  value={formik.values.twitter}
                  onChange={formik.handleChange}
                  helperText="Tech-focused Twitter handle"
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                />
              </Grid>
            </>
          )}
          {/* Step 3: Preferences & Recognition */}
          {activeStep === 3 && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="favoriteTechStack"
                  name="favoriteTechStack"
                  label="Favorite Tech Stack"
                  value={formik.values.favoriteTechStack}
                  onChange={formik.handleChange}
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="learningGoals"
                  name="learningGoals"
                  label="Learning Goals"
                  value={formik.values.learningGoals}
                  onChange={formik.handleChange}
                  helperText="e.g., Learning Rust this year"
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="certifications"
                  name="certifications"
                  label="Certifications"
                  value={formik.values.certifications}
                  onChange={formik.handleChange}
                  helperText="e.g., AWS Certified, Google Developer"
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="achievements"
                  name="achievements"
                  label="Achievements / Awards"
                  value={formik.values.achievements}
                  onChange={formik.handleChange}
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="preferredIDE"
                  name="preferredIDE"
                  label="Preferred IDE"
                  value={formik.values.preferredIDE}
                  onChange={formik.handleChange}
                  helperText="e.g., VS Code, IntelliJ"
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="openToWork"
                  name="openToWork"
                  label="Open to Work"
                  value={formik.values.openToWork ? "Yes" : "No"}
                  onChange={(e) =>
                    formik.setFieldValue("openToWork", e.target.value === "Yes")
                  }
                  select
                  SelectProps={{
                    native: true,
                  }}
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="openSource"
                  name="openSource"
                  label="Open Source Contributor"
                  value={formik.values.openSource ? "Yes" : "No"}
                  onChange={(e) =>
                    formik.setFieldValue("openSource", e.target.value === "Yes")
                  }
                  select
                  SelectProps={{
                    native: true,
                  }}
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff", borderColor: "#ffb17a" },
                  }}
                  sx={{
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#676f9d" },
                      "&.Mui-focused fieldset": { borderColor: "#676f9d" },
                      backgroundColor: "#202338",
                    },
                  }}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </TextField>
              </Grid>
            </>
          )}
        </Grid>
        {/* Navigation buttons for stepper */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 3,
            mb: 4,
          }}
        >
          <Button
            variant="contained"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ backgroundColor: "#676f9d", color: "#ffffff" }}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#ffb17a",
                color: "#000000",
                fontWeight: "bold",
              }}
            >
              Save
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                backgroundColor: "#ffb17a",
                color: "#000000",
                fontWeight: "bold",
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </form>
      {/* Success message */}
      {message && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
    </Container>
  );
};

export default Profile;
