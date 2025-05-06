import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import { Box, Typography, TextField, Button } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const Forums = ({ onOpenGroup }) => {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const groupsRef = ref(db, 'groups');

    // Fetch groups from Firebase
    const unsubscribe = onValue(
      groupsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const dynamicGroups = Object.entries(data).map(([id, value]) => ({ id, ...value }));
          setGroups(dynamicGroups);
        }
      },
      (error) => {
        console.error('Error fetching groups:', error);
        setError('Failed to fetch groups. Please check your database connection.');
      }
    );

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || !newGroupDescription.trim()) {
      setError("Group title and description are required.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const db = getDatabase();
      const groupsRef = ref(db, "groups");

      // Push the new group to Firebase
      const newGroup = {
        name: newGroupName,
        description: newGroupDescription,
      };

      await push(groupsRef, newGroup);

      // Clear input fields
      setNewGroupName("");
      setNewGroupDescription("");
    } catch (error) {
      console.error("Error creating group:", error);
      setError("Failed to create group. Please try again.");
    }
  };

  return (
    <Box sx={{ padding: '20px', color: '#ffffff' }}>
      <Typography variant="h4" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>
        Forums
      </Typography>
      <Box
        sx={{
          backgroundColor: '#2c2f48',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '40px',
        }}
      >
        <Typography variant="h5" sx={{ color: '#ffb17a', marginBottom: '20px', fontWeight: 'bold' }}>
          Create New Group
        </Typography>
        <TextField
          fullWidth
          label="Group Title"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          InputLabelProps={{ style: { color: '#ffffff' } }}
          InputProps={{ style: { color: '#ffffff', borderColor: '#ffb17a' } }}
          sx={{
            marginBottom: '20px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#676f9d' },
              '&:hover fieldset': { borderColor: '#ffb17a' },
              '&.Mui-focused fieldset': { borderColor: '#ffb17a' },
            },
          }}
        />
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Group Description"
          value={newGroupDescription}
          onChange={(e) => setNewGroupDescription(e.target.value)}
          InputLabelProps={{ style: { color: '#ffffff' } }}
          InputProps={{ style: { color: '#ffffff', borderColor: '#ffb17a' } }}
          sx={{
            marginBottom: '20px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#676f9d' },
              '&:hover fieldset': { borderColor: '#ffb17a' },
              '&.Mui-focused fieldset': { borderColor: '#ffb17a' },
            },
          }}
        />
        <Button
          onClick={handleCreateGroup}
          variant="contained"
          sx={{
            backgroundColor: '#ffb17a',
            color: '#000',
            '&:hover': { backgroundColor: '#e6a963' },
          }}
        >
          + Create Group
        </Button>
        {error && <Typography sx={{ color: 'red', marginTop: '10px' }}>{error}</Typography>}
      </Box>
      <Typography variant="h5" sx={{ color: '#ffb17a', marginBottom: '20px', fontWeight: 'bold' }}>
        Existing Groups
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {groups.map((group) => (
          <Box
            key={group.id}
            sx={{
              backgroundColor: '#2c2f48',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
              },
            }}
          >
            <Typography variant="h6" sx={{ color: '#ffb17a', marginBottom: '10px', fontWeight: 'bold' }}>
              {group.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#d1d1e0', marginBottom: '20px' }}>
              {group.description}
            </Typography>
            <Button
              onClick={() => onOpenGroup(group.id, group.name)} // Pass groupId and groupName
              variant="contained"
              startIcon={<OpenInNewIcon />}
              sx={{
                backgroundColor: '#ffb17a',
                color: '#000',
                '&:hover': { backgroundColor: '#e6a963' },
              }}
            >
              Open Group Discussion
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Forums;