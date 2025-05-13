import Navbar from "../Components/LandingPage/Navbar/Navbar";
import Hero from "../Components/LandingPage/Hero/Hero"
import Blogs from "../Components/LandingPage/Blogs/Blogs"
import CodeSnippets from "../Components/LandingPage/CodeSnippets/CodeSnippets"
import Podcasts from "../Components/LandingPage/Podcasts/Podcasts"
import Forums from "../Components/LandingPage/Forums/Forums"
import About from "../Components/LandingPage/About/About"

// Landing page component for the public site
function Landing() {
  return (
    <>
      {/* Navigation bar at the top */}
      <Navbar/>
      {/* Hero section with main message */}
      <Hero/>
      {/* Featured blogs preview */}
      <Blogs/>
      {/* Featured code snippets preview */}
      <CodeSnippets/>
      {/* Featured podcasts preview */}
      <Podcasts/>
      {/* Forums/groups preview */}
      <Forums/>
      {/* About section */}
      <About/>
    </>
  );
}

export default Landing;