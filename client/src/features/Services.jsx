import {
  FaTools,
  FaCouch,
  FaHome,
  FaHandsHelping,
  FaBuilding,
  FaPaintRoller,
  FaMapMarkedAlt,
} from 'react-icons/fa';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import { Parallax } from 'react-scroll-parallax';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { useCallback } from 'react';

const services = [
  {
    title: 'Real Estate Development',
    icon: FaBuilding,
    desc: 'End-to-end residential and commercial real estate development — from planning to execution.',
  },
  {
    title: 'Sales, Letting & Shortlets',
    icon: FaHome,
    desc: 'Buy, rent, or enjoy short stays with our well-managed properties, including Airbnb-ready options.',
  },
  {
    title: 'Cleaning & Facility Management',
    icon: FaTools,
    desc: 'Top-notch cleaning services and maintenance for buildings, estates, and offices.',
  },
  {
    title: 'Joint Venture Development',
    icon: FaHandsHelping,
    desc: 'Collaborate with us to bring your property or land to life in profit-sharing partnerships.',
  },
  {
    title: 'Renovations & Interior/Exterior Design',
    icon: FaPaintRoller,
    desc: 'Give your space a fresh, modern look with our renovation and custom design services.',
  },
  {
    title: 'Dredging & Gentrification',
    icon: FaMapMarkedAlt,
    desc: 'Transform and reclaim land through expert dredging and community development projects.',
  },
  {
    title: 'Project Management & Consulting',
    icon: FaCouch,
    desc: 'From small to large-scale real estate projects, we provide strategic planning and execution advice.',
  },
];

export default function Services() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true }}
    className="relative min-h-screen py-20 px-6 bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white overflow-hidden z-10">

      {/* ✅ Background Bubbles */}
      <Particles
        id="services-particles"
        init={particlesInit}
        className="absolute top-0 left-0 w-full h-full z-0"
        options={{
          background: { color: 'transparent' },
          fullScreen: false,
          particles: {
            number: { value: 30 },
            size: { value: 4, random: true },
            move: {
              enable: true,
              speed: 1,
              direction: 'none',
              outModes: 'bounce',
            },
            opacity: {
              value: 0.15,
            },
            color: {
              value: '#facc15',
            },
          },
        }}
      />

      {/* ✅ Section Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gold">Our Services</h1>
        <p className="text-gray-300 max-w-2xl mx-auto mb-12 text-lg">
          PROPERTY WEY INTERNATIONAL offers a full suite of modern real estate and facility services.
        </p>
      </div>

      {/* ✅ Animated Service Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Tilt
                glareEnable
                tiltMaxAngleX={10}
                tiltMaxAngleY={10}
                glareColor="#ffffff"
                glareMaxOpacity={0.05}
                className="w-full h-full"
              >
                <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:shadow-xl transition-all">
                  <Parallax speed={5} opacity={[1, 0.6]}>
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="mb-4 inline-block"
                    >
                      <Icon className="text-gold text-4xl" />
                    </motion.div>
                  </Parallax>
                  <h2 className="text-xl font-semibold text-gold mb-2">{service.title}</h2>
                  <p className="text-gray-300 text-sm">{service.desc}</p>
                </div>
              </Tilt>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
