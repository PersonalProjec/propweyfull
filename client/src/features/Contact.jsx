import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { motion } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import Button from '../components/Button';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const API = import.meta.env.VITE_API_BASE_URL;
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export default function Contact() {
  const recaptchaRef = useRef();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data, e) => {
    try {
      if (e && e.preventDefault) e.preventDefault();
      const toastId = toast.loading('Sending message...');

      const token = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset();
      const res = await axios.post(`${API}/contact`, {
        ...data,
        recaptchaToken: token,
      });
      toast.dismiss(toastId);
      toast.success(res.data.message || 'Message sent successfully!');
      reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      toast.dismiss();
      console.error(err);
      toast.error(
        err.response?.data?.message || 'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <motion.contact
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="relative z-0 min-h-screen px-6 py-20 bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-hidden"
      id="contact"
    >
      <Toaster position="top-center" />

      {/* Bubble Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[15%] w-40 h-40 bg-gold/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-[60%] left-[70%] w-56 h-56 bg-primary/10 rounded-full blur-2xl animate-ping"></div>
        <div className="absolute bottom-[20%] right-[30%] w-48 h-48 bg-gold/20 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Reach out to us for inquiries, partnerships, or service requests.
            We’re here to help!
          </p>

          <ul className="space-y-6 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-4 group hover:scale-105 transition-transform">
              <FaMapMarkerAlt className="text-gold text-xl mt-1 group-hover:animate-bounce" />
              <span>No. 5 Real Estate Avenue, Lagos, Nigeria</span>
            </li>
            <li className="flex items-start gap-4 group hover:scale-105 transition-transform">
              <FaPhone className="text-gold text-xl mt-1 group-hover:animate-pulse" />
              <span>+234 904 700 7000</span>
            </li>
            <li className="flex items-start gap-4 group hover:scale-105 transition-transform">
              <FaEnvelope className="text-gold text-xl mt-1 group-hover:animate-bounce" />
              <span>info@propertywey.com</span>
            </li>
          </ul>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="bg-white/60 dark:bg-gray-900/70 backdrop-blur-sm border border-gold/30 p-6 md:p-8 rounded-xl shadow-xl"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Full Name
              </label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                placeholder="John Doe"
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.name
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-700'
                } bg-white/80 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold`}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Email Address
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email format',
                  },
                })}
                placeholder="john@example.com"
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.email
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-700'
                } bg-white/80 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Message</label>
              <textarea
                rows="5"
                {...register('message', { required: 'Message is required' })}
                placeholder="Type your message here..."
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.message
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-700'
                } bg-white/80 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold`}
              />
              {errors.message && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* ReCAPTCHA (invisible) */}
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY}
              size="invisible"
              ref={recaptchaRef}
            />

            <Button
              type="submit"
              color="gold"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </motion.div>
      </div>
    </motion.contact>
  );
}
