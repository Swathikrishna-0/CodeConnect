import './App.scss'
import Navbar from './Components/LandingPage/Navbar/Navbar'
import Hero from './Components/LandingPage/Hero/Hero'
import Blogs from './Components/LandingPage/Blogs/Blogs'
import CodeSnippets from './Components/LandingPage/CodeSnippets/CodeSnippets'
import Podcasts from './Components/LandingPage/Podcasts/Podcasts'
import Forums from './Components/LandingPage/Forums/Forums'
import About from './Components/LandingPage/About/About'

function App() {
  return (
    <>
      <div>
        <Navbar/>
        <Hero/>
        <Blogs/>
        <CodeSnippets/>
        <Podcasts/>
        <Forums/>
        <About/>
      </div>
    </>
  )
}

export default App
