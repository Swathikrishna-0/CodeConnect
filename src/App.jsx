import "./App.scss";
import Landing from "./Pages/Landing";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './Pages/Auth';
import Feed from './Components/MainPages/Feed/Feed';
import Myaccount from './Components/MainPages/MyAccount/Myaccount';
import GroupDiscussion from './Components/MainPages/Forums/GroupDiscussion';
import BlogPostDetail from "./Components/MainPages/BlogPosts/BlogPostDetail";
import CodeSnippetDetail from './Components/MainPages/CodeSnippet/CodeSnippetDetail'; 

// App component sets up the main router and routes for the application
function App() {
  return (
    <Router>
      <Routes>
        {/* Main authentication and nested routes */}
        <Route path="/*" element={<Auth />} />
        {/* Public landing page */}
        <Route path="/" element={<Landing />} />
        {/* Feed/dashboard route */}
        <Route path="/feed" element={<Feed />} />
        {/* My Account page */}
        <Route path="/myaccount" element={<Myaccount />} />
        {/* Forums group discussion route */}
        <Route path="/forums/:groupId" element={<GroupDiscussion />} />
        {/* Blog post detail route */}
        <Route path="/blog/:id" element={<BlogPostDetail />} />
        {/* Code snippet detail route */}
        <Route path="/snippet/:id" element={<CodeSnippetDetail />} /> {/* Add new route */}
      </Routes>
    </Router>
  );
}

export default App;
