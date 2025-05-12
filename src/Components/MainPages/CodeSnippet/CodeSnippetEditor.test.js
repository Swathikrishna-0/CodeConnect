import React from "react";
import { render, screen } from "@testing-library/react";
import CodeSnippetEditor from "./CodeSnippetEditor";
import { BrowserRouter } from "react-router-dom";

test("renders CodeSnippetEditor UI elements", () => {
  render(
    <BrowserRouter>
      <CodeSnippetEditor />
    </BrowserRouter>
  );

  // Check if the title exists
  expect(screen.getByText(/Create a Code Snippet/i)).toBeInTheDocument();
  expect(screen.getByText(/All Code Snippets/i)).toBeInTheDocument();

  // Check if the submit button exists
  expect(screen.getByText(/Publish Code/i)).toBeInTheDocument();
});
