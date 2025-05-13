import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase"; // Import Firebase auth
import "../Hero/Hero.scss";
import HeroImg from "../../../assets/HeroImg.png";

// Hero component for the landing page
const Hero = () => {
  const navigate = useNavigate();
  // State to track if user is signed in
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsSignedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Framer Motion animation variants for the feature boxes
  const boxVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.2, duration: 0.5 },
    }),
    floating: {
      x: [0, 10, 0],
      transition: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 2,
        ease: "easeInOut",
      },
    },
  };

  // Animation variants for the hero image
  const imageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { delay: 0.8, duration: 0.6 } },
  };

  // Data for the feature boxes
  const boxes = [
    { text: "Share Code", bgColor: "#676f9d", textColor: "white", width: "50%" },
    {
      text: "Join Discussions",
      bgColor: "#424769",
      textColor: "#ffb17a",
      width: "50%",
      marginLeft: "15%",
    },
    { text: "Write Blogs", bgColor: "#676f9d", textColor: "white", width: "35%" },
  ];

  // Handle Get Started button click
  // If signed in, go to /feed, else redirect to login
  const handleGetStartedClick = () => {
    if (isSignedIn) {
      navigate("/feed");
    } else {
      navigate("/login", { state: { from: "/feed" } });
    }
  };

  return (
    // Main hero section
    <section className="hero-section" id="home">
      {/* Animated heading */}
      <motion.h1
        className="hero-heading"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Unite. Learn. Build. Together.
      </motion.h1>

      <div className="hero-container">
        <div className="hero-left">
          {/* Animated description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            CodeConnect is where developers come together to share knowledge,
            collaborate on projects, and grow in their craft. Whether you're a
            beginner or a seasoned pro, find your community and take your skills
            to the next level.
          </motion.p>

          {/* Animated Get Started button */}
          <motion.div
            className="button-get"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <button className="getstarted-button" onClick={handleGetStartedClick}>
              Get Started
            </button>
          </motion.div>

          {/* Feature boxes with animation */}
          <div className="box-container">
            {boxes.map((box, i) => (
              <motion.div
                key={i}
                className="box"
                custom={i}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.05 }}
                variants={boxVariants}
                style={{
                  backgroundColor: box.bgColor,
                  color: box.textColor,
                  width: box.width,
                  marginLeft: box.marginLeft,
                }}
                whileInView="floating"
              >
                {box.text}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Animated hero image */}
        <motion.div
          className="hero-right"
          initial="hidden"
          animate="visible"
          variants={imageVariants}
        >
          <div className="eclipse"></div>
          <img src={HeroImg} alt="Hero" className="hero-image" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
