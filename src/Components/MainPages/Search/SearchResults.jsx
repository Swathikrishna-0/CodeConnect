import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Divider } from "@mui/material";
import BlogPost from "../BlogPosts/BlogPost";
import CodeSnippet from "../CodeSnippet/Codesnippet";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results || []; // Get search results from state

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
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ color: "#ffb17a", mb: 4 }}>
        Search Results
      </Typography>
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
