import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import Tilt from 'react-parallax-tilt';
import { useCallback } from 'react';
import heroImage from '../assets/hero.png';
import logo3D from '../assets/logo3D.png'; // Floating logo or 3D element

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.4,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const Hero = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <motion.hero
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      <div
        className="relative w-full h-screen bg-cover bg-fixed bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Parallax Cloud/Particle Overlay */}
        <Particles
          id="tsparticles"
          init={particlesInit}
          className="absolute inset-0 z-0"
          options={{
            fullScreen: false,
            particles: {
              number: { value: 35 },
              size: { value: 2 },
              color: { value: '#ffffff' },
              move: { enable: true, speed: 0.5 },
              opacity: { value: 0.1 },
              links: { enable: true, color: '#ffffff', opacity: 0.05 },
            },
            background: { color: 'transparent' },
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80 z-10" />

        {/* Floating 3D Tilt Logo */}
        <div className="absolute top-10 right-10 z-20 hidden md:block">
          <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} perspective={1000}>
            <motion.img
              src={logo3D}
              alt="Floating Logo"
              className="mt-4 w-20 h-20 object-contain drop-shadow-2xl animate-pulse"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
          </Tilt>
        </div>

        {/* Hero Content */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-20 max-w-7xl mx-auto h-full flex flex-col justify-center items-start px-6 lg:px-12"
        >
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-6xl font-extrabold text-gold drop-shadow-2xl leading-tight"
          >
            Welcome to <br />
            PROPERTY WEY INTERNATIONAL
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-lg md:text-2xl text-white max-w-2xl leading-relaxed"
          >
            Real estate development, shortlets, joint ventures, project
            management and lifestyle transformation.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
            <Link to="#properties">
              <Button variant="solid" color="gold" size="lg" rounded="full">
                Browse Properties
              </Button>
            </Link>

            <Link to="#contact">
              <Button variant="outline" color="gold" size="lg" rounded="full">
                Contact Us
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{
            delay: 2,
            duration: 1.2,
            repeat: Infinity,
            repeatType: 'mirror',
          }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30"
        >
          <span className="text-white text-sm animate-bounce">Scroll ↓</span>
        </motion.div>
      </div>
    </motion.hero>
  );
};

export default Hero;
