import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import { Parallax } from 'react-scroll-parallax';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import Button from '../components/Button';

const propertiesPerPage = 6;
const api = import.meta.env.VITE_API_BASE_URL;

export default function Properties() {
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [allGrouped, setAllGrouped] = useState({
    Sale: [],
    Rent: [],
    Shortlet: [],
  });

  // Fetch properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        if (filter === 'All') {
          const res = await fetch(`${api}/properties?limit=1000`);
          const result = await res.json();
          if (!res.ok)
            throw new Error(result.message || 'Failed to load properties');
          setProperties(result.properties || []);
          setTotal(result.total || 0);

          // Group by category
          const grouped = { Sale: [], Rent: [], Shortlet: [] };
          (result.properties || []).forEach((prop) => {
            if (grouped[prop.category]) grouped[prop.category].push(prop);
          });
          setAllGrouped(grouped);
        } else {
          const params = [
            `page=${currentPage}`,
            `limit=${propertiesPerPage}`,
            filter !== 'All' ? `category=${filter}` : '',
          ]
            .filter(Boolean)
            .join('&');

          const res = await fetch(`${api}/properties?${params}`);
          const result = await res.json();
          if (!res.ok)
            throw new Error(result.message || 'Failed to load properties');
          setProperties(result.properties || []);
          setTotal(result.total || 0);
        }
      } catch (err) {
        console.error('🔥 Fetch Properties Error:', err);
        setProperties([]);
        setTotal(0);
        setAllGrouped({ Sale: [], Rent: [], Shortlet: [] });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, [filter, currentPage]);

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

  const totalPages = Math.ceil(total / propertiesPerPage);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const SkeletonCard = () => (
    <div className="animate-pulse bg-white/5 backdrop-blur rounded-xl shadow-xl h-[350px]">
      <div className="h-56 bg-gray-800 w-full rounded-t-lg" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-700 w-3/4 rounded"></div>
        <div className="h-3 bg-gray-700 w-1/2 rounded"></div>
        <div className="h-3 bg-gray-700 w-1/3 rounded"></div>
        <div className="h-6 w-24 bg-gray-700 rounded-full mt-4" />
      </div>
    </div>
  );

  // Helper to render cards
  function renderCards(propsArr) {
    return propsArr.map((prop, index) => (
      <motion.div
        key={prop._id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true }}
      >
        <Parallax speed={3}>
          <Tilt
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            glareEnable
            glareMaxOpacity={0.1}
            className="w-full h-full"
          >
            <div className="bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden shadow-xl hover:scale-[1.03] transition-transform duration-300">
              <div className="relative group overflow-hidden">
                <img
                  src={
                    prop.images && prop.images.length > 0
                      ? prop.images[0]
                      : 'https://res.cloudinary.com/demo/image/upload/v1699025938/sample.jpg'
                  }
                  alt={prop.title}
                  className="h-56 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {prop.approved && (
                  <span className="absolute top-3 left-3 bg-gold text-xs text-black font-semibold px-3 py-1 rounded-full shadow-md">
                    Verified
                  </span>
                )}
                {prop.tags && prop.tags.includes('limited') && (
                  <span className="absolute top-3 right-3 bg-red-500 text-xs text-white font-semibold px-3 py-1 rounded-full shadow-md">
                    Limited Offer
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-gold mb-2">
                  {prop.title}
                </h3>
                <p className="text-gray-300 text-sm">{prop.location}</p>
                <p className="text-white text-lg font-bold">
                  {typeof prop.price === 'number'
                    ? `${getCurrencySymbol(
                        prop.currency
                      )}${prop.price.toLocaleString()}`
                    : prop.price}
                </p>

                <span className="text-xs mt-3 inline-block bg-gold/10 text-gold px-2 py-1 rounded-full">
                  {prop.category}
                </span>

                <Link to={`/property/${prop._id}`}>
                  <Button
                    className="mt-4"
                    variant="solid"
                    size="sm"
                    color="gold"
                  >
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </Tilt>
        </Parallax>
      </motion.div>
    ));
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white py-20 px-6 overflow-hidden z-10"
    >
      <Particles
        id="properties-particles"
        init={particlesInit}
        className="absolute top-0 left-0 w-full h-full z-0"
        options={{
          background: { color: 'transparent' },
          fullScreen: false,
          particles: {
            number: { value: 20 },
            size: { value: 3, random: true },
            move: { enable: true, speed: 0.5 },
            opacity: { value: 0.15 },
            color: { value: '#facc15' },
          },
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-10 text-gold drop-shadow-md">
          Browse Properties
        </h2>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {['All', 'Sale', 'Rent', 'Shortlet'].map((type) => (
            <Button
              key={type}
              onClick={() => {
                setFilter(type);
                setCurrentPage(1);
              }}
              variant={filter === type ? 'solid' : 'outline'}
              color="gold"
              size="sm"
            >
              {type}
            </Button>
          ))}
        </div>

        {/* All Tab: Grouped By Category */}
        {filter === 'All' ? (
          isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {Array.from({ length: 6 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          ) : (
            ['Sale', 'Rent', 'Shortlet'].map((cat) =>
              allGrouped[cat] && allGrouped[cat].length > 0 ? (
                <div key={cat} className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-2xl font-bold text-gold">
                      {cat} Properties
                    </h3>
                    {allGrouped[cat].length > propertiesPerPage && (
                      <Link to={`/properties/${cat.toLowerCase()}`}>
                        <Button variant="outline" size="sm" color="gold">
                          View All
                        </Button>
                      </Link>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {renderCards(allGrouped[cat].slice(0, propertiesPerPage))}
                  </div>
                </div>
              ) : null
            )
          )
        ) : (
          // Single category: paginated cards
          <div>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {Array.from({ length: propertiesPerPage }).map((_, idx) => (
                  <SkeletonCard key={idx} />
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 py-12">
                No properties found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {renderCards(properties)}
              </div>
            )}
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center gap-3 flex-wrap">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold ${
                      currentPage === idx + 1
                        ? 'bg-gold text-black'
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
}
