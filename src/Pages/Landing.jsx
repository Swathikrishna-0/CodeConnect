import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Navbar from "../Components/LandingPage/Navbar/Navbar";
import Login from "./Login";
import SignUp from "./SignUp";
import Hero from "../Components/LandingPage/Hero/Hero"
import Blogs from "../Components/LandingPage/Blogs/Blogs"
import CodeSnippets from "../Components/LandingPage/CodeSnippets/CodeSnippets"
import Podcasts from "../Components/LandingPage/Podcasts/Podcasts"
import Forums from "../Components/LandingPage/Forums/Forums"
import About from "../Components/LandingPage/About/About"


function Landing() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          {/* Protected Route: Only signed-in users can access */}
          <Route
            path="/"
            element={
              <SignedIn>
              </SignedIn>
            }
          />
          {/* Show login/signup page when user is signed out */}
          <Route
            path="/login"
            element={
              <SignedOut>
                <Login />
              </SignedOut>
            }
          />
          <Route
            path="/signup"
            element={
              <SignedOut>
                <SignUp />
              </SignedOut>
            }
          />
          
        </Routes>
      </Router>
      <Hero/>
      <Blogs/>
      <CodeSnippets/>
      <Podcasts/>
      <Forums/>
      <About/>
    </>
  );
}

export default Landing;
