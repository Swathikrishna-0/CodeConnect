import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { TextField, Button, Typography, Container, Box, Alert, Grid, Avatar, Stepper, Step, StepLabel } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const steps = ['Personal Info', 'Technical Skills', 'Developer Presence', 'Preferences & Recognition'];

const Profile = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const docRef = doc(db, 'profiles', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            formik.setValues({
              ...formik.values,
              ...data, // Merge existing values with fetched data
            });
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      company: '',
      university: '',
      education: '',
      role: '',
      github: '',
      linkedin: '',
      primaryLanguages: '',
      frameworks: '',
      databases: '',
      tools: '',
      yearsOfExperience: '',
      employmentType: '',
      openToWork: false,
      currentPosition: '',
      portfolio: '',
      stackOverflow: '',
      blog: '',
      twitter: '',
      favoriteTechStack: '',
      learningGoals: '',
      openSource: false,
      preferredIDE: '',
      certifications: '',
      hackathonParticipation: false,
      achievements: ''
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First Name is required'),
      lastName: Yup.string().required('Last Name is required'),
    }),
    onSubmit: async (values) => {
      if (user) {
        try {
          await setDoc(doc(db, 'profiles', user.uid), values);
          setMessage('Profile saved successfully!');
          setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
        } catch (error) {
          console.error('Error saving profile:', error);
        }
      }
    }
  });

  const handleNext = async () => {
    if (user) {
      const stepData = {};
      if (activeStep === 0) {
        stepData.firstName = formik.values.firstName;
        stepData.lastName = formik.values.lastName;
        stepData.company = formik.values.company;
        stepData.university = formik.values.university;
      } else if (activeStep === 1) {
        stepData.primaryLanguages = formik.values.primaryLanguages;
        stepData.frameworks = formik.values.frameworks;
        stepData.databases = formik.values.databases;
        stepData.tools = formik.values.tools;
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
      }

      try {
        await setDoc(doc(db, 'profiles', user.uid), stepData, { merge: true });
        if (activeStep < steps.length - 1) {
          setActiveStep((prevStep) => prevStep + 1);
        } else {
          setMessage('Profile saved successfully!');
          setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
        }
      } catch (error) {
        console.error('Error saving step data:', error);
      }
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user) {
      try {
        await setDoc(doc(db, 'profiles', user.uid), formik.values);
        setMessage('Profile saved successfully!');
        setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ backgroundColor: '#424769', borderRadius: '8px', mt: 4, p: 3 }}>
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ color: '#ffb17a', textAlign: 'center', fontWeight: 'bold' }}>
          Profile
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Avatar 
          src={user?.photoURL || ''} 
          alt="User Avatar" 
          sx={{ width: 100, height: 100, border: '2px solid #ffb17a' }} 
        />
      </Box>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
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
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{ style: { color: "#ffffff", borderColor: "#ffb17a" } }}
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
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{ style: { color: "#ffffff", borderColor: "#ffb17a" } }}
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
                  InputProps={{ style: { color: "#ffffff", borderColor: "#ffb17a" } }}
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
                  InputProps={{ style: { color: "#ffffff", borderColor: "#ffb17a" } }}
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
                  InputProps={{ style: { color: "#ffffff", borderColor: "#ffb17a" } }}
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
                  InputProps={{ style: { color: "#ffffff", borderColor: "#ffb17a" } }}
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
                  InputProps={{ style: { color: "#ffffff", borderColor: "#ffb17a" } }}
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
                  InputProps={{ style: { color: "#ffffff", borderColor: "#ffb17a" } }}
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
                  InputProps={{ style: { color: "#ffffff", borderColor: "#ffb17a" } }}
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
                  InputProps={{ style: { color: "#ffffff", borderColor: "#ffb17a" } }}
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
                  InputProps={{ style: { color: "#ffffff", borderColor: "#ffb17a" } }}
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
                  InputProps={{ style: { color: "#ffffff", borderColor: "#ffb17a" } }}
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
                  InputProps={{ style: { color: "#ffffff", borderColor: "#ffb17a" } }}
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
                  InputProps={{ style: { color: "#ffffff", borderColor: "#ffb17a" } }}
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
                  InputProps={{ style: { color: "#ffffff", borderColor: "#ffb17a" } }}
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
                  InputProps={{ style: { color: "#ffffff", borderColor: "#ffb17a" } }}
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
                  InputProps={{ style: { color: "#ffffff", borderColor: "#ffb17a" } }}
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
                  InputProps={{ style: { color: "#ffffff", borderColor: "#ffb17a" } }}
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
                  InputProps={{ style: { color: "#ffffff", borderColor: "#ffb17a" } }}
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
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="contained"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ backgroundColor: '#676f9d', color: '#ffffff' }}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: '#ffb17a', color: '#000000', fontWeight: 'bold' }}
            >
              Save
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ backgroundColor: '#ffb17a', color: '#000000', fontWeight: 'bold' }}
            >
              Next
            </Button>
          )}
        </Box>
      </form>
      {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
    </Container>
  );
};

export default Profile;