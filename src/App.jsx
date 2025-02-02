import './App.scss'
import Navbar from './Components/LandingPage/Navbar/Navbar'
import Hero from './Components/LandingPage/Hero/Hero'
import Blogs from './Components/LandingPage/Blogs/Blogs'
import CodeSnippets from './Components/LandingPage/CodeSnippets/CodeSnippets'

function App() {

  return (
    <>
      <div>
        <Navbar/>
        <Hero/>
        <Blogs/>
        <CodeSnippets/>
      </div>
    </>
  )
}

export default App
