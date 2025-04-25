import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { TextField, Button, Typography, Container, Box, Alert, Grid, Avatar, IconButton } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      company: '',
      university: '',
      education: '',
      role: '',
      github: '',
      linkedin: ''
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First Name is required'),
      lastName: Yup.string().required('Last Name is required'),
    }),
    onSubmit: async (values) => {
      if (user) {
        await setDoc(doc(db, 'profiles', user.uid), { ...values, profilePic });
        setMessage('Profile saved successfully!');
        setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
      }
    }
  });

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const docRef = doc(db, 'profiles', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          formik.setValues(data);
          setProfilePic(data.profilePic || null);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ color: '#ffb17a', textAlign: 'center', fontWeight: 'bold' }}>
          Profile
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Avatar src={profilePic} sx={{ width: 100, height: 100 }} />
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="profile-pic-upload"
          type="file"
          onChange={handleProfilePicChange}
        />
        <label htmlFor="profile-pic-upload">
          <IconButton color="primary" aria-label="upload picture" component="span">
            <PhotoCamera />
          </IconButton>
        </label>
      </Box>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
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
              InputLabelProps={{ style: { color: '#C17B49' } }}
              InputProps={{ style: { color: '#ffffff', borderColor: '#ffb17a' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#676f9d' }, '&:hover fieldset': { borderColor: '#ffb17a' }, '&.Mui-focused fieldset': { borderColor: '#ffb17a' } } }}
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
              InputLabelProps={{ style: { color: '#C17B49' } }}
              InputProps={{ style: { color: '#ffffff', borderColor: '#ffb17a' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#676f9d' }, '&:hover fieldset': { borderColor: '#ffb17a' }, '&.Mui-focused fieldset': { borderColor: '#ffb17a' } } }}
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
              error={formik.touched.company && Boolean(formik.errors.company)}
              helperText={formik.touched.company && formik.errors.company}
              InputLabelProps={{ style: { color: '#C17B49' } }}
              InputProps={{ style: { color: '#ffffff', borderColor: '#ffb17a' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#676f9d' }, '&:hover fieldset': { borderColor: '#ffb17a' }, '&.Mui-focused fieldset': { borderColor: '#ffb17a' } } }}
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
              error={formik.touched.university && Boolean(formik.errors.university)}
              helperText={formik.touched.university && formik.errors.university}
              InputLabelProps={{ style: { color: '#C17B49' } }}
              InputProps={{ style: { color: '#ffffff', borderColor: '#ffb17a' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#676f9d' }, '&:hover fieldset': { borderColor: '#ffb17a' }, '&.Mui-focused fieldset': { borderColor: '#ffb17a' } } }}
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
              error={formik.touched.education && Boolean(formik.errors.education)}
              helperText={formik.touched.education && formik.errors.education}
              InputLabelProps={{ style: { color: '#C17B49' } }}
              InputProps={{ style: { color: '#ffffff', borderColor: '#ffb17a' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#676f9d' }, '&:hover fieldset': { borderColor: '#ffb17a' }, '&.Mui-focused fieldset': { borderColor: '#ffb17a' } } }}
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
              error={formik.touched.role && Boolean(formik.errors.role)}
              helperText={formik.touched.role && formik.errors.role}
              InputLabelProps={{ style: { color: '#C17B49' } }}
              InputProps={{ style: { color: '#ffffff', borderColor: '#ffb17a' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#676f9d' }, '&:hover fieldset': { borderColor: '#ffb17a' }, '&.Mui-focused fieldset': { borderColor: '#ffb17a' } } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              id="github"
              name="github"
              label="GitHub Link"
              value={formik.values.github}
              onChange={formik.handleChange}
              error={formik.touched.github && Boolean(formik.errors.github)}
              helperText={formik.touched.github && formik.errors.github}
              InputLabelProps={{ style: { color: '#C17B49' } }}
              InputProps={{ style: { color: '#ffffff', borderColor: '#ffb17a' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#676f9d' }, '&:hover fieldset': { borderColor: '#ffb17a' }, '&.Mui-focused fieldset': { borderColor: '#ffb17a' } } }}
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
              error={formik.touched.linkedin && Boolean(formik.errors.linkedin)}
              helperText={formik.touched.linkedin && formik.errors.linkedin}
              InputLabelProps={{ style: { color: '#C17B49' } }}
              InputProps={{ style: { color: '#ffffff', borderColor: '#ffb17a' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#676f9d' }, '&:hover fieldset': { borderColor: '#ffb17a' }, '&.Mui-focused fieldset': { borderColor: '#ffb17a' } } }}
            />
          </Grid>
        </Grid>
        <Button color="primary" variant="contained" fullWidth type="submit" sx={{ mt: 2, backgroundColor: '#ffb17a', color: '#000000',fontWeight: 'bold' }}>
          Save
        </Button>
      </form>
      {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
    </Container>
  );
};

export default Profile;