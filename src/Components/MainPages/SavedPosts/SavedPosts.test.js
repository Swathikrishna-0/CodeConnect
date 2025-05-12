import React from "react";
import { render, screen } from "@testing-library/react";
import SavedPosts from "./SavedPosts";

test("renders SavedPosts with specific text elements", () => {
  render(<SavedPosts bookmarkedPosts={[]} bookmarkedSnippets={[]} />);

  // Check if "Saved Posts" heading exists
  expect(screen.getByText(/Saved Posts/i)).toBeInTheDocument();

  // Check if "No bookmarked blog posts found." message exists
  expect(screen.getByText(/No bookmarked blog posts found./i)).toBeInTheDocument();

  // Check if "Saved Code Snippets" heading exists
  expect(screen.getByText(/Saved Code Snippets/i)).toBeInTheDocument();

  // Check if "No bookmarked code snippets found." message exists
  expect(screen.getByText(/No bookmarked code snippets found./i)).toBeInTheDocument();
});
