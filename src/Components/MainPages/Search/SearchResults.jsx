import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Divider } from "@mui/material";
import BlogPost from "../BlogPosts/BlogPost";
import CodeSnippet from "../CodeSnippet/Codesnippet";

// SearchResults component displays results for blog posts and code snippets
const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Get search results from router state
  const results = location.state?.results || [];

  // Show message if no results found
  if (!results.length) {
    return (
      <Box sx={{ p: 4, color: "#ffffff" }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          No Results Found
        </Typography>
        <Typography variant="body1">
          Try searching for something else or go back to the feed.
        </Typography>
      </Box>
    );
  }

  return (
    // Main container for search results
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ color: "#ffb17a", mb: 4 }}>
        Search Results
      </Typography>
      {/* Render each result as BlogPost or CodeSnippet */}
      {results.map((item, index) => (
        <React.Fragment key={index}>
          {item.title ? (
            <BlogPost post={item} /> // Render BlogPost if it's a blog
          ) : (
            <CodeSnippet snippet={item} /> // Render CodeSnippet if it's a snippet
          )}
          <Divider sx={{ my: 2, backgroundColor: "#676f9d" }} />
        </React.Fragment>
      ))}
    </Box>
  );
};

export default SearchResults;
