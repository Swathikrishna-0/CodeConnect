import React from "react";
import { render, screen } from "@testing-library/react";
import Feed from "./Feed";
import { BrowserRouter } from "react-router-dom";

test("renders Feed with specific text elements", () => {
  render(
    <BrowserRouter>
      <Feed />
    </BrowserRouter>
  );

  // Check if "Welcome to CodeConnect" exists
  expect(
    screen.getByText(
      /Join discussions and collaborate with like-minded individuals./i
    )
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      /Join discussions and collaborate with like-minded individuals./i
    )
  ).toBeInTheDocument();

  expect(
    screen.getByText(
      /Read and share blogs on various topics written by our users./i
    )
  ).toBeInTheDocument();

  expect(
    screen.getByText(
      /Explore and contribute useful code snippets for the community./i
    )
  ).toBeInTheDocument();
});
