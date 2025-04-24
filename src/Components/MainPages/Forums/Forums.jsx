import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import { Card, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const Forums = ({ onOpenGroup }) => {
  const [groups, setGroups] = useState([
    { id: 'react-devs', name: 'React Developers', description: 'A community for React enthusiasts to share and learn.' },
    { id: 'js-masters', name: 'JavaScript Masters', description: 'Discuss advanced JavaScript concepts and projects.' },
    { id: 'web-beginners', name: 'Web Dev Beginners', description: 'A friendly space for beginners to ask questions and grow.' },
  ]);
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
          setGroups((prevGroups) => [
            ...prevGroups.filter((group) => group.id.startsWith('static-')), // Keep static groups
            ...dynamicGroups,
          ]);
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
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#fff' }}>Forums</h1>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#ffb17a' }}>Create a New Group</h2>
        <input
          type="text"
          placeholder="Group Title"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          style={{
            padding: '10px',
            marginBottom: '10px',
            width: '100%',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
        <textarea
          placeholder="Group Description"
          value={newGroupDescription}
          onChange={(e) => setNewGroupDescription(e.target.value)}
          style={{
            padding: '10px',
            marginBottom: '10px',
            width: '100%',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={handleCreateGroup}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ffb17a',
            color: '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Create Group
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {groups.map((group) => (
          <Card
            key={group.id}
            sx={{
              backgroundColor: '#2c2f48',
              color: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
              },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '20px',
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ color: '#ffb17a', marginBottom: '10px', fontWeight: 'bold' }}>
                {group.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#d1d1e0', marginBottom: '20px' }}>
                {group.description}
              </Typography>
            </Box>
            <Button
              onClick={() => onOpenGroup(group.id, group.name)}
              variant="contained"
              startIcon={<OpenInNewIcon />}
              sx={{
                backgroundColor: '#ffb17a',
                color: '#000',
                '&:hover': { backgroundColor: '#e6a963' },
                padding: '10px 20px',
                borderRadius: '8px',
                alignSelf: 'flex-end',
              }}
            >
              Open Group Discussion
            </Button>
          </Card>
        ))}
      </Box>
    </div>
  );
};

export default Forums;