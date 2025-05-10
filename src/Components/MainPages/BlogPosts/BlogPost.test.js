import React from 'react';
import { render, screen } from '@testing-library/react';
import BlogPost from './BlogPost';
import { BrowserRouter } from 'react-router-dom';

// ✅ MOCK Firebase
jest.mock('../../../firebase', () => ({
  auth: {
    currentUser: { uid: 'mockUser123' },
  },
  db: {}, // optional: can add Firestore mock methods later if needed
}));

const mockPost = {
  id: '1',
  title: 'Test Blog Post',
  userName: 'Test User',
  userProfilePic: '',
  createdAt: { seconds: 1697040000 },
  likes: ['mockUser123'],
  bookmarks: [],
  hashtags: ['react', 'testing'],
};

test('renders BlogPost with basic data', () => {
  render(
    <BrowserRouter>
      <BlogPost post={mockPost} />
    </BrowserRouter>
  );

  expect(screen.getByText(/Test Blog Post/i)).toBeInTheDocument();
  expect(screen.getByText(/Test User/i)).toBeInTheDocument();
  expect(screen.getByText(/#react #testing/i)).toBeInTheDocument();
  expect(screen.getByText(/1 Likes/i)).toBeInTheDocument();
  expect(screen.getByText(/0 Bookmarks/i)).toBeInTheDocument();
});
