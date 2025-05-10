import React from 'react';
import { render, screen } from '@testing-library/react';
import Forums from './Forums';

// ✅ Mock Firebase Realtime Database
jest.mock('firebase/database', () => ({
  getDatabase: jest.fn(),
  ref: jest.fn(),
  push: jest.fn(),
  onValue: (ref, callback) => {
    const mockSnapshot = {
      val: () => ({
        group1: { name: 'Frontend Devs', description: 'Talk about React, Vue, and more.' },
        group2: { name: 'Backend Wizards', description: 'Discuss Node.js, databases, and APIs.' }
      })
    };
    callback(mockSnapshot);
    return () => {}; // mock unsubscribe
  }
}));

test('renders Forums component with headers', () => {
  render(<Forums onOpenGroup={jest.fn()} />);

  expect(screen.getByText(/Forums/i)).toBeInTheDocument();
  expect(screen.getByText(/Create New Group/i)).toBeInTheDocument();
  expect(screen.getByText(/Existing Groups/i)).toBeInTheDocument();
});

test('renders mocked group names', () => {
  render(<Forums onOpenGroup={jest.fn()} />);

  expect(screen.getByText(/Frontend Devs/i)).toBeInTheDocument();
  expect(screen.getByText(/Backend Wizards/i)).toBeInTheDocument();
});
