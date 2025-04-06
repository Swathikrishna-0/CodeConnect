import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue } from 'firebase/database';

const GroupDiscussion = ({ groupId, groupName }) => {
  const [topic, setTopic] = useState('');
  const [details, setDetails] = useState('');
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const questionsRef = ref(db, `groups/${groupId}/questions`);

    // Fetch questions from Firebase
    onValue(questionsRef, (snapshot) => {
      const data = snapshot.val();
      const questionsList = data ? Object.values(data) : [];
      setQuestions(questionsList);
    });
  }, [groupId]);

  const handlePostQuestion = () => {
    if (!topic.trim() || !details.trim()) {
      alert('Both fields are required.');
      return;
    }

    const db = getDatabase();
    const questionsRef = ref(db, `groups/${groupId}/questions`);

    // Push the new question to Firebase
    push(questionsRef, {
      topic,
      details,
      createdAt: new Date().toISOString(),
    });

    // Clear input fields
    setTopic('');
    setDetails('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#fff' }}>Group Discussion: {groupName}</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Topic of your question"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
        <textarea
          placeholder="Write your question in detail"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            height: '100px',
          }}
        />
        <button
          onClick={handlePostQuestion}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Post Question
        </button>
      </div>
      <div>
        <h2 style={{ color: '#fff' }}>Questions</h2>
        {questions.map((question, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              color: '#fff',
            }}
          >
            <h3>{question.topic}</h3>
            <p>{question.details}</p>
            <small>Posted on: {new Date(question.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupDiscussion;
