import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SearchResults from "./SearchResults";

test("renders SearchResults with no results text", () => {
  render(
    <BrowserRouter>
      <SearchResults />
    </BrowserRouter>
  );

  // Check if "No Results Found" text exists
  expect(screen.getByText(/No Results Found/i)).toBeInTheDocument();

  // Check if "Try searching for something else or go back to the feed." text exists
  expect(
    screen.getByText(/Try searching for something else or go back to the feed./i)
  ).toBeInTheDocument();
});
