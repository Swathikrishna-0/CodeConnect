import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue } from 'firebase/database';

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
      alert('Both fields are required.');
      return;
    }

    try {
      const db = getDatabase();
      const groupsRef = ref(db, 'groups');

      // Push the new group to Firebase
      const newGroup = {
        name: newGroupName,
        description: newGroupDescription,
      };

      await push(groupsRef, newGroup);

      // Clear input fields
      setNewGroupName('');
      setNewGroupDescription('');
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group. Please try again.');
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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {groups.map((group) => (
          <div
            key={group.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '16px',
              width: '300px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              color: '#fff',
            }}
          >
            <h2>{group.name}</h2>
            <p>{group.description}</p>
            <button
              onClick={() => onOpenGroup(group.id, group.name)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ffb17a',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Open Group Discussion
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forums;