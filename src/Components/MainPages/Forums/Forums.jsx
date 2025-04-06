import React from 'react';

const Forums = ({ onOpenGroup }) => {
  const groups = [
    { id: 'react-devs', name: 'React Developers', description: 'A community for React enthusiasts to share and learn.' },
    { id: 'js-masters', name: 'JavaScript Masters', description: 'Discuss advanced JavaScript concepts and projects.' },
    { id: 'web-beginners', name: 'Web Dev Beginners', description: 'A friendly space for beginners to ask questions and grow.' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#fff'}}>Forums</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {groups.map((group) => (
          <div
            key={group.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '16px',
              width: '300px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',color:"#fff"
            }}
          >
            <h2>{group.name}</h2>
            <p>{group.description}</p>
            <button
              onClick={() => onOpenGroup(group.id, group.name)}
              style={{ padding: '8px 16px', backgroundColor: '#ffb17a', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }} 
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