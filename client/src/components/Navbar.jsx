import { useEffect, useState, useRef } from 'react';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/icon.png';
import { Link } from 'react-router-dom';

const navLinks = [
  { name: 'Home', path: 'hero' },
  { name: 'Services', path: 'services' },
  { name: 'Properties', path: 'properties' },
  { name: 'About', path: 'about' },
  { name: 'Contact', path: 'contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastScrollY = useRef(0);

  // Hide/show nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setShowNavbar(currentY < lastScrollY.current || currentY < 100);
      lastScrollY.current = currentY;

      // Update scroll progress
      const progress =
        (currentY / (document.body.scrollHeight - window.innerHeight)) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ScrollSpy
  useEffect(() => {
    const handleSectionScroll = () => {
      const scrollY = window.scrollY + window.innerHeight / 3;
      for (let link of navLinks) {
        const section = document.getElementById(link.path);
        if (section) {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(link.path);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleSectionScroll);
    return () => window.removeEventListener('scroll', handleSectionScroll);
  }, []);

  // Scroll to section
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setOpen(false);
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gold z-[9999]"
        style={{ width: `${scrollProgress}%` }}
      />

      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: showNavbar ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800 shadow-md"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.img
              src={logo}
              alt="Property Wey Logo"
              className="h-10 w-auto"
              initial={{ scale: 0.9 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
            <span className="text-xl font-bold text-gold tracking-tight group-hover:text-primary transition">
              Property Wey
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6 relative">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollTo(link.path)}
                className={`relative group text-lg font-medium transition-all pb-1 ${
                  activeSection === link.path
                    ? 'text-gold'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gold'
                }`}
              >
                {link.name}
                {activeSection === link.path && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 bottom-0 h-0.5 bg-gold w-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Toggler */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="text-primary dark:text-white focus:outline-none transition"
            >
              {open ? (
                <HiX className="text-3xl" />
              ) : (
                <HiMenuAlt3 className="text-3xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="mobile-nav"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white dark:bg-gray-900 px-6 py-4 space-y-4"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <button
                    onClick={() => scrollTo(link.path)}
                    className={`block text-base font-medium w-full text-left ${
                      activeSection === link.path
                        ? 'text-gold'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gold'
                    }`}
                  >
                    {link.name}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
