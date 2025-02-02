import React from "react";
import { motion } from "framer-motion";
import "../Hero/Hero.scss";
import HeroImg from "../../../assets/HeroImg.png";

const Hero = () => {
  // Framer Motion animations
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

  const imageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { delay: 0.8, duration: 0.6 } },
  };

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

  return (
    <section className="hero-section">
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

          <motion.div
            className="button-get"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <button className="getstarted-button">Get Started</button>
          </motion.div>

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
