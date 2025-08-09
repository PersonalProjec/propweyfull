import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { toast } from 'react-toastify'; // Add at the top
import Button from '../components/Button';
import Navbar from '../components/Navbar'; // <== Only navbar
import { motion } from 'framer-motion';
import { Parallax } from 'react-scroll-parallax';
import { FaMapMarkerAlt, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaXTwitter,
} from 'react-icons/fa6';
import Slider from 'react-slick';

const api = import.meta.env.VITE_API_BASE_URL;

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [visitForm, setVisitForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
  });

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${api}/properties/${id}`);
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Property not found');
        setProperty(result.property);
      } catch (err) {
        console.error('🔥 Fetch Property Error:', err);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  function getCurrencySymbol(currency) {
    switch ((currency || '').toUpperCase()) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'CAD':
        return 'C$';
      case 'NGN':
      default:
        return '₦';
    }
  }

  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  const handleFormChange = (e) => {
    setVisitForm({ ...visitForm, [e.target.name]: e.target.value });
  };

  const handleVisitSubmit = async (e) => {
    e.preventDefault();
    if (!visitForm.name || !visitForm.phone || !visitForm.date) {
      toast.error('Please fill in your name, phone number, and visit date.');
      return;
    }
    try {
      const res = await fetch(`${api}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property: property._id,
          name: visitForm.name,
          phone: visitForm.phone,
          email: visitForm.email,
          visitDate: visitForm.date,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || 'Booking failed.');
      }
      toast.success('Booking request submitted!');
      setShowModal(false);
      setVisitForm({ name: '', phone: '', email: '', date: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to submit booking.');
    }
  };

  // Carousel settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: property && property.images && property.images.length > 1,
    adaptiveHeight: true,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-300">
        Loading property...
      </div>
    );
  }
  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 dark:text-red-400">
        Property not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col">
      <Navbar />
      <main className="flex-1 px-0 md:px-6 py-3 md:py-10">
        <div className="max-w-4xl mx-auto w-full">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            color="gold"
            className="mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Properties
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/60 dark:bg-black/40 rounded-xl shadow-lg p-3 md:p-6"
          >
            {/* IMAGES */}
            <Parallax speed={-10}>
              {property.images && property.images.length > 0 ? (
                <div className="relative">
                  <Slider {...sliderSettings}>
                    {property.images.map((img, idx) => (
                      <div key={idx}>
                        <img
                          src={img}
                          alt={`${property.title} - ${idx + 1}`}
                          className="w-full h-64 md:h-80 object-cover rounded-lg shadow"
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              ) : (
                <img
                  src="https://res.cloudinary.com/demo/image/upload/v1699025938/sample.jpg"
                  alt={property.title}
                  className="w-full h-64 md:h-80 object-cover rounded-lg shadow"
                />
              )}
            </Parallax>

            {/* INFO */}
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gold flex items-center gap-2">
                {property.title}
                {property.approved && (
                  <FaCheckCircle className="text-green-500" title="Verified" />
                )}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                <FaMapMarkerAlt />
                {property.location}
              </div>
              <div className="flex gap-3 items-center mb-2 flex-wrap">
                <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-sm font-semibold">
                  {property.category}
                </span>
                {property.status && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {property.status}
                  </span>
                )}
                {property.tags && property.tags.includes('limited') && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Limited Offer
                  </span>
                )}
              </div>
              <div className="text-lg font-extrabold text-primary mb-1">
                {typeof property.price === 'number'
                  ? `${getCurrencySymbol(
                      property.currency
                    )}${property.price.toLocaleString()}`
                  : property.price}
              </div>
              <p className="text-gray-700 dark:text-gray-200 text-base mb-2">
                {property.description || 'No property description available.'}
              </p>
              {property.area && (
                <div className="text-sm text-gray-500">
                  <b>Area:</b> {property.area}
                </div>
              )}

              {/* Book a Visit Button */}
              <Button
                variant="solid"
                color="gold"
                size="lg"
                className="mt-4 w-full md:w-auto"
                onClick={handleModalOpen}
              >
                Book a Visit
              </Button>

              {/* Contact Social Buttons */}
              <div className="flex flex-wrap gap-3 mt-4 items-center">
                <span className="text-xs text-gray-400 mr-2">Contact us:</span>
                <a
                  href={`https://wa.me/2349047007000?text=I'm%20interested%20in%20${encodeURIComponent(
                    property.title
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-green-500 hover:bg-green-600 text-white w-9 h-9 flex items-center justify-center shadow transition"
                  title="WhatsApp"
                >
                  <FaWhatsapp size={18} />
                </a>
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gradient-to-tr from-fuchsia-500 via-red-500 to-yellow-400 hover:opacity-80 text-white w-9 h-9 flex items-center justify-center shadow transition"
                  title="Instagram"
                >
                  <FaInstagram size={18} />
                </a>
                <a
                  href="https://facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-blue-600 hover:bg-blue-700 text-white w-9 h-9 flex items-center justify-center shadow transition"
                  title="Facebook"
                >
                  <FaFacebook size={18} />
                </a>
                <a
                  href="https://www.tiktok.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-black hover:bg-gray-900 text-white w-9 h-9 flex items-center justify-center shadow transition"
                  title="TikTok"
                >
                  <FaTiktok size={18} />
                </a>
                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gray-900 hover:bg-gray-700 text-white w-9 h-9 flex items-center justify-center shadow transition"
                  title="X"
                >
                  <FaXTwitter size={18} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Book Visit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-lg relative"
          >
            <button
              onClick={handleModalClose}
              className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-3 text-gold">Book a Visit</h2>
            {/* Read-only property summary */}
            <div className="mb-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-xs">
              <div>
                <b>Property:</b> {property.title}
              </div>
              <div>
                <b>Location:</b> {property.location}
              </div>
              <div>
                <b>Amount:</b>{' '}
                {typeof property.price === 'number'
                  ? `${getCurrencySymbol(
                      property.currency
                    )}${property.price.toLocaleString()}`
                  : property.price}
              </div>
            </div>
            <form className="flex flex-col gap-3" onSubmit={handleVisitSubmit}>
              <input
                type="text"
                name="name"
                value={visitForm.name}
                onChange={handleFormChange}
                placeholder="Your Name"
                className="border rounded p-2 bg-gray-50 dark:bg-gray-800"
                required
              />
              <input
                type="tel"
                name="phone"
                value={visitForm.phone}
                onChange={handleFormChange}
                placeholder="Phone Number"
                className="border rounded p-2 bg-gray-50 dark:bg-gray-800"
                required
              />
              <input
                type="email"
                name="email"
                value={visitForm.email}
                onChange={handleFormChange}
                placeholder="Email (optional)"
                className="border rounded p-2 bg-gray-50 dark:bg-gray-800"
              />
              <input
                type="date"
                name="date"
                value={visitForm.date}
                onChange={handleFormChange}
                className="border rounded p-2 bg-gray-50 dark:bg-gray-800"
                required
              />
              <Button
                type="submit"
                variant="solid"
                color="gold"
                size="lg"
                className="mt-2 w-full"
              >
                Confirm Booking
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
