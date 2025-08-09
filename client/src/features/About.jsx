import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import aboutImg from '../assets/logo.png';

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    gsap.fromTo(
      el,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white py-16 px-6"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <img
          src={aboutImg}
          alt="About Property Wey"
          className="rounded-lg shadow-md"
        />

        <div>
          <h2 className="text-4xl font-bold mb-4 text-gold">About Us</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            <strong>PROPERTY WEY INTERNATIONAL</strong> is a trusted brand
            committed to transforming spaces and communities. We specialize in
            real estate development, shortlets, joint ventures, renovations,
            dredging, and property management.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Our vision is to bridge modern living with high-value returns. We
            combine smart technology, creative design, and a human-first
            approach to meet clients' real estate goals.
          </p>
        </div>
      </div>
    </section>
  );
}
