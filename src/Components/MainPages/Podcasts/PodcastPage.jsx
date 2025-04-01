import React, { useState, useEffect } from 'react';
import { Typography, Box, TextField, Button, Card, CardContent, CardHeader, Avatar, Grid } from '@mui/material';
import { useUser } from '@clerk/clerk-react';
import { db } from '../../../firebase';
import { collection, addDoc, query, onSnapshot, orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { UploadFile } from '@mui/icons-material';

const PodcastPage = () => {
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [audioFileName, setAudioFileName] = useState('');
  const [podcasts, setPodcasts] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'podcasts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const podcastsData = [];
      querySnapshot.forEach((doc) => {
        podcastsData.push({ id: doc.id, ...doc.data() });
      });
      setPodcasts(podcastsData);
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAudioFile(file);
    setAudioFileName(file ? file.name : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user && audioFile) {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `podcasts/${user.id}_${Date.now()}_${audioFile.name}`);
  
        // Upload audio file to Firebase Storage
        await uploadBytes(storageRef, audioFile);
  
        // Get the download URL after upload
        const downloadURL = await getDownloadURL(storageRef);
  
        // Store podcast metadata & audio URL in Firestore
        const podcastData = {
          userId: user.id,
          userName: user.fullName,
          userProfilePic: user.profileImageUrl,
          title: title.trim(),
          createdAt: new Date(),
          audioUrl: downloadURL,  // Store the actual file URL
        };
  
        await addDoc(collection(db, 'podcasts'), podcastData);
  
        // Reset form
        setTitle('');
        setAudioFile(null);
        setAudioFileName('');
        setMessage('Podcast uploaded successfully!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error uploading podcast: ', error);
        setMessage('Error uploading podcast. Please try again.');
      }
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (user && audioFile) {
  //     try {
  //       const podcastData = {
  //         userId: user.id,
  //         userName: user.fullName,
  //         userProfilePic: user.profileImageUrl,
  //         title: title.trim(),
  //         createdAt: new Date(),
  //         audioUrl: URL.createObjectURL(audioFile),
  //       };
  //       await addDoc(collection(db, 'podcasts'), podcastData);
  //       setTitle('');
  //       setAudioFile(null);
  //       setAudioFileName('');
  //       setMessage('Podcast uploaded successfully!');
  //       setTimeout(() => setMessage(''), 3000);
  //     } catch (error) {
  //       console.error('Error uploading podcast: ', error);
  //       setMessage('Error uploading podcast. Please try again.');
  //     }
  //   }
  // };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, color: "#ffb17a" }}>
        Podcasts
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#ffb17a" }}>
              Upload Podcast
            </Typography>
            <form onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column' }}>
              <TextField
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                InputLabelProps={{ style: { color: "#C17B49" } }}
                InputProps={{ style: { color: "#ffffff", borderColor: "#ffb17a" } }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#676f9d" },
                    "&:hover fieldset": { borderColor: "#ffb17a" },
                    "&.Mui-focused fieldset": { borderColor: "#ffb17a" },
                  },
                }}
              />
              {audioFileName && (
                <Typography sx={{ mb: 1, color: "#ffb17a" }}>
                  Selected file: {audioFileName}
                </Typography>
              )}
              <Button
                variant="contained"
                component="label"
                sx={{ backgroundColor: "#ffb17a", color: "#000000", mb: 2 }}
                startIcon={<UploadFile />}
              >
                Upload Audio
                <input type="file" hidden onChange={handleFileChange} />
              </Button><br/>
              <Button
                type="submit"
                variant="contained"
                sx={{ backgroundColor: "#ffb17a", color: "#000000" }}
              >
                Post
              </Button>
            </form>
            {message && <Typography sx={{ mt: 2, color: "#ffb17a" }}>{message}</Typography>}
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#ffb17a" }}>
          Recently Posted Podcasts
        </Typography>
        {podcasts.map((podcast) => (
          <Card key={podcast.id} sx={{ mb: 2, backgroundColor: 'transparent', border: '1px solid #676f9d' }}>
            <CardHeader
              avatar={<Avatar src={podcast.userProfilePic} />}
              title={<Typography sx={{ color: "#ffb17a" }}>{podcast.userName}</Typography>}
              subheader={<Typography sx={{ color: "#C17B49" }}>{new Date(podcast.createdAt.seconds * 1000).toLocaleDateString()}</Typography>}
            />
            <CardContent>
              <Typography variant="h6" sx={{ color: "#ffb17a" }}>{podcast.title}</Typography>
              <audio controls src={podcast.audioUrl} style={{ width: '100%', marginTop: '10px' }} />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default PodcastPage;
