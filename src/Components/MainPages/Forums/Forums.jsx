import React, { useState } from 'react';

const Forums = () => {
  const groups = [
    { name: 'React Developers', description: 'A community for React enthusiasts to share and learn.' },
    { name: 'JavaScript Masters', description: 'Discuss advanced JavaScript concepts and projects.' },
    { name: 'Web Dev Beginners', description: 'A friendly space for beginners to ask questions and grow.' },
  ];

  const [joinedGroups, setJoinedGroups] = useState({});

  const handleJoinGroup = (index) => {
    alert('Joined');
    setJoinedGroups((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Forums</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {groups.map((group, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '16px',
              width: '300px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2>{group.name}</h2>
            <p>{group.description}</p>
            {joinedGroups[index] ? (
              <button style={{ padding: '8px 16px', backgroundColor: '#28A745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Open Group Discussion
              </button>
            ) : (
              <button
                onClick={() => handleJoinGroup(index)}
                style={{ padding: '8px 16px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Join Group
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forums;