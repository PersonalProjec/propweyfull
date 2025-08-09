import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';

function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', toggle);
    return () => window.removeEventListener('scroll', toggle);
  }, []);

  return visible ? (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gold text-white shadow-lg hover:scale-110 transition"
    >
      <FaArrowUp />
    </button>
  ) : null;
}

export default BackToTopButton;
