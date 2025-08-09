import Services from './Services';
import Contact from './Contact';
import Hero from './Hero';
import Properties from './Properties';
import About from './About';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 300); // wait for layout to stabilize
      }
    }
  }, [location]);

  return (
    <section className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Hero Section */}
      <div id="hero">
        <Hero />
      </div>

      {/* Services Section */}
      <div id="services">
        <Services />
      </div>

      {/* Properties Section */}
      <div id="properties">
        <Properties />
      </div>

      {/* About Section */}
      <div id="about">
        <About />
      </div>
      {/* Contact Section */}
      <div id="contact">
        <Contact />
      </div>
    </section>
  );
}
