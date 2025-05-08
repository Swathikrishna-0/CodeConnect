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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Auth />} />
        <Route path="/" element={<Landing />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/myaccount" element={<Myaccount />} />
        <Route path="/forums/:groupId" element={<GroupDiscussion />} />
        <Route path="/blog/:id" element={<BlogPostDetail />} />
        <Route path="/snippet/:id" element={<CodeSnippetDetail />} /> {/* Add new route */}
      </Routes>
    </Router>
  );
}

export default App;
