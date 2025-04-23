import React from "react";
import { Box, Typography } from "@mui/material";
import BlogPost from "../BlogPosts/BlogPost";
import CodeSnippet from "../CodeSnippet/Codesnippet"; // Import CodeSnippet component

const SavedPosts = ({ bookmarkedPosts, bookmarkedSnippets }) => {
  return (
    <Box sx={{ color: "#ffffff" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Saved Posts
      </Typography>
      {bookmarkedPosts.length > 0 ? (
        bookmarkedPosts.map((post) => <BlogPost key={post.id} post={post} />)
      ) : (
        <Typography>No bookmarked blog posts found.</Typography>
      )}
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Saved Code Snippets
      </Typography>
      {bookmarkedSnippets.length > 0 ? (
        bookmarkedSnippets.map((snippet) => (
          <CodeSnippet key={snippet.id} snippet={snippet} />
        ))
      ) : (
        <Typography>No bookmarked code snippets found.</Typography>
      )}
    </Box>
  );
};

export default SavedPosts;