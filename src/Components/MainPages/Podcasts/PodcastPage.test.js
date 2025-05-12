import React from "react";
import { render, screen } from "@testing-library/react";
import PodcastPage from "./PodcastPage";

test("renders PodcastPage with specific text elements", () => {
  render(<PodcastPage />);

  // Check if "Welcome to the world of Podcasts" exists
  expect(screen.getByText(/Welcome to the world of Podcasts/i)).toBeInTheDocument();

  // Check if "Tune into expert insights, developer stories, and the latest in tech—one episode at a time." exists
  expect(
    screen.getByText(/Tune into expert insights, developer stories, and the latest in tech—one episode at a time./i)
  ).toBeInTheDocument();

  // Check if "Popular Podcast" exists
  expect(screen.getByText(/Popular Podcast/i)).toBeInTheDocument();

  // Check if "Business and Tech" exists
  expect(screen.getByText(/Business and Tech/i)).toBeInTheDocument();

  // Check if "Indian Tech Startups" exists
  expect(screen.getByText(/Indian Tech Startups/i)).toBeInTheDocument();
});
