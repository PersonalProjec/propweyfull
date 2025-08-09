import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { toast } from 'react-toastify';
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const api = import.meta.env.VITE_API_BASE_URL;

const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
  <button
    {...props}
    className={`slick-arrow left-2 z-20 absolute top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-blue-600 hover:text-white ${
      props.className || ''
    }`}
    style={{ ...props.style, left: 8, display: 'block' }}
    aria-label="Previous"
    type="button"
  >
    <FaChevronLeft size={20} />
  </button>
);

const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
  <button
    {...props}
    className={`slick-arrow right-2 z-20 absolute top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-blue-600 hover:text-white ${
      props.className || ''
    }`}
    style={{ ...props.style, right: 8, display: 'block' }}
    aria-label="Next"
    type="button"
  >
    <FaChevronRight size={20} />
  </button>
);

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 400,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  adaptiveHeight: true,
  nextArrow: <SlickArrowRight />,
  prevArrow: <SlickArrowLeft />,
};

const modalSliderSettings = {
  ...sliderSettings,
  dots: true, // show dots in modal for overview
};

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // For modal/details
  const [selected, setSelected] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [editId, setEditId] = useState(null);

  // Image editing state for modal
  const [newImages, setNewImages] = useState([]); // File objects for new uploads
  const [imagesToRemove, setImagesToRemove] = useState([]); // URLs to remove

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = [
        `page=${page}`,
        `limit=${limit}`,
        search ? `search=${encodeURIComponent(search)}` : '',
      ]
        .filter(Boolean)
        .join('&');
      const res = await fetch(`${api}/properties?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to load');
      setProperties(result.properties || []);
      setTotal(result.total);
    } catch (err) {
      console.error('🔥 Error fetching properties:', err);
      toast.error(err.message || 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line
  }, [page, limit]);

  // Search on Enter or button
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProperties();
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This action cannot be undone.')) return;
    try {
      const res = await fetch(`${api}/properties/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Delete failed');
      toast.success('Property deleted!');
      fetchProperties();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  // Edit
  const handleEdit = (property) => {
    setEditId(property._id);
    setSelected({ ...property }); // clone to avoid direct mutation
    setNewImages([]);
    setImagesToRemove([]);
    setShowDetails(true);
  };

  // View
  const handleView = (property) => {
    setSelected(property);
    setShowDetails(true);
    setEditId(null);
  };

  // Save edit
  const handleSaveEdit = async () => {
    try {
      const formData = new FormData();
      // Add other fields (excluding images for now)
      Object.entries(selected).forEach(([key, value]) => {
        if (key !== 'images') formData.append(key, value);
      });
      // Send remaining images (not removed) as URLs
      formData.append('existingImages', JSON.stringify(selected.images));
      // Removed images (URLs to remove)
      formData.append('imagesToRemove', JSON.stringify(imagesToRemove));
      // Add new images
      newImages.forEach((file) => formData.append('newImages', file));

      const res = await fetch(`${api}/properties/${editId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          // DO NOT set Content-Type for FormData!
        },
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Update failed');
      toast.success('Property updated!');
      setShowDetails(false);
      fetchProperties();
    } catch (err) {
      toast.error(err.message || 'Failed to update');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-6xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-6">Manage Properties</h2>

      {/* Search */}
      <form className="mb-4 flex items-center gap-3" onSubmit={handleSearch}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, location, description..."
          className="border rounded p-2 flex-1"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          type="submit"
          disabled={loading}
        >
          Search
        </button>
      </form>

      {/* Page size */}
      <div className="flex justify-between items-center mb-2">
        <span>
          Showing page {page} of {totalPages} ({total} total)
        </span>
        <select
          value={limit}
          onChange={(e) => {
            setPage(1);
            setLimit(Number(e.target.value));
          }}
          className="border rounded p-1"
        >
          {[10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n} per page
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-lg">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property._id}
              className="bg-white rounded-lg shadow p-4 flex flex-col relative"
            >
              {/* Carousel */}
              <div className="mb-2 relative">
                {property.images && property.images.length > 0 ? (
                  <Slider {...sliderSettings}>
                    {property.images.map((img, i) => (
                      <div key={i}>
                        <img
                          src={img}
                          alt={`prop-img-${i}`}
                          className="w-full h-48 object-cover rounded"
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                    No Images
                  </div>
                )}
              </div>

              <h3 className="font-bold text-lg mb-1">{property.title}</h3>
              <p className="text-gray-700 mb-1 truncate">
                {property.description}
              </p>
              <div className="flex flex-wrap gap-x-2 text-sm text-gray-600 mb-2">
                <span>📍 {property.location}</span>
                <span>💰 {property.price}</span>
                <span>🏷️ {property.type}</span>
                <span>📂 {property.category}</span>
                <span>🔖 {property.tags?.join(', ')}</span>
                <span>🕒 {new Date(property.createdAt).toLocaleString()}</span>
              </div>
              {/* Highlighted chips */}
              <div className="flex gap-2 mb-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    property.featured ? 'bg-yellow-200' : 'bg-gray-200'
                  }`}
                >
                  Featured: {property.featured ? 'Yes' : 'No'}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    property.approved ? 'bg-green-200' : 'bg-red-200'
                  }`}
                >
                  Approved: {property.approved ? 'Yes' : 'No'}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    property.status === 'active' ? 'bg-green-200' : 'bg-red-200'
                  }`}
                >
                  Status: {property.status}
                </span>
              </div>
              <div className="flex gap-3 mt-auto">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  title="View"
                  onClick={() => handleView(property)}
                >
                  <FaEye />
                </button>
                <button
                  className="text-green-600 hover:text-green-800"
                  title="Edit"
                  onClick={() => handleEdit(property)}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  title="Delete"
                  onClick={() => handleDelete(property._id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-8 gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 rounded border disabled:opacity-40"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded border ${
              page === i + 1 ? 'bg-blue-600 text-white' : ''
            }`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-1 rounded border disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* Details/Edit Modal */}
      {showDetails && selected && (
        <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-40 z-30 py-8">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-lg relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => {
                setShowDetails(false);
                setEditId(null);
              }}
            >
              ✖
            </button>
            {/* Carousel in Modal (details only, not edit) */}
            {selected.images && selected.images.length > 0 && (
              <div className="relative mb-4">
                <Slider {...modalSliderSettings}>
                  {selected.images.map((img, i) => (
                    <div key={i}>
                      <img
                        src={
                          typeof img === 'string'
                            ? img
                            : URL.createObjectURL(img)
                        }
                        alt={`modal-img-${i}`}
                        className="w-full h-72 object-cover rounded"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            )}

            {editId ? (
              <>
                <h3 className="font-bold text-xl mb-4">Edit Property</h3>
                {/* IMAGE EDIT/UPLOAD UI */}
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Images</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selected.images &&
                      selected.images.map((img, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={
                              typeof img === 'string'
                                ? img
                                : URL.createObjectURL(img)
                            }
                            alt={`edit-img-${i}`}
                            className="w-24 h-24 object-cover rounded border"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 py-0 text-xs opacity-80 group-hover:opacity-100"
                            title="Remove"
                            onClick={() => {
                              setImagesToRemove((prev) => [...prev, img]);
                              setSelected((prev) => ({
                                ...prev,
                                images: prev.images.filter(
                                  (_x, idx) => idx !== i
                                ),
                              }));
                            }}
                          >
                            ✖
                          </button>
                        </div>
                      ))}
                    {/* New images preview */}
                    {newImages.map((img, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`new-img-${i}`}
                          className="w-24 h-24 object-cover rounded border"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 py-0 text-xs opacity-80 group-hover:opacity-100"
                          title="Remove"
                          onClick={() =>
                            setNewImages((prev) =>
                              prev.filter((_x, idx) => idx !== i)
                            )
                          }
                        >
                          ✖
                        </button>
                      </div>
                    ))}
                  </div>
                  {/* File input for new images */}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      setNewImages((prev) => [
                        ...prev,
                        ...Array.from(e.target.files || []),
                      ]);
                    }}
                    className="border rounded p-2 w-full"
                  />
                </div>
                {/* Inline editing for all fields except images */}
                {Object.entries(selected).map(([key, value]) => {
                  // Hide technical/irrelevant fields
                  if (
                    key === '_id' ||
                    key === 'images' ||
                    key === 'createdAt' ||
                    key === 'updatedAt' ||
                    key === '__v' ||
                    key === 'views' ||
                    key === 'viewedAt'
                  )
                    return null;

                  // Boolean selects
                  if (key === 'featured' || key === 'approved') {
                    return (
                      <div key={key} className="mb-2">
                        <label className="block capitalize mb-1">{key}</label>
                        <select
                          className="border rounded p-2 w-full"
                          value={value ? 'true' : 'false'}
                          onChange={(e) =>
                            setSelected((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                        >
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      </div>
                    );
                  }

                  // Status select
                  if (key === 'status') {
                    return (
                      <div key={key} className="mb-2">
                        <label className="block capitalize mb-1">{key}</label>
                        <select
                          className="border rounded p-2 w-full"
                          value={value}
                          onChange={(e) =>
                            setSelected((prev) => ({
                              ...prev,
                              status: e.target.value,
                            }))
                          }
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="expired">Expired</option>
                        </select>
                      </div>
                    );
                  }

                  // Currency select (professional!)
                  if (key === 'currency') {
                    return (
                      <div key={key} className="mb-2">
                        <label className="block capitalize mb-1">{key}</label>
                        <select
                          className="border rounded p-2 w-full"
                          value={value || 'NGN'}
                          onChange={(e) =>
                            setSelected((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                        >
                          <option value="NGN">Naira (₦)</option>
                          <option value="USD">US Dollar ($)</option>
                          <option value="EUR">Euro (€)</option>
                          <option value="GBP">British Pound (£)</option>
                          <option value="CAD">Canadian Dollar (C$)</option>
                        </select>
                      </div>
                    );
                  }

                  // Everything else (default input)
                  return (
                    <div key={key} className="mb-2">
                      <label className="block capitalize mb-1">{key}</label>
                      <input
                        className="border rounded p-2 w-full"
                        value={value}
                        onChange={(e) =>
                          setSelected((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                      />
                    </div>
                  );
                })}
                <button
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={handleSaveEdit}
                  disabled={loading}
                >
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <h3 className="font-bold text-xl mb-4">Property Details</h3>
                {/* Highlighted chips */}
                <div className="flex gap-2 mb-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      selected.featured ? 'bg-yellow-200' : 'bg-gray-200'
                    }`}
                  >
                    Featured: {selected.featured ? 'Yes' : 'No'}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      selected.approved ? 'bg-green-200' : 'bg-red-200'
                    }`}
                  >
                    Approved: {selected.approved ? 'Yes' : 'No'}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      selected.status === 'active'
                        ? 'bg-green-200'
                        : 'bg-red-200'
                    }`}
                  >
                    Status: {selected.status}
                  </span>
                </div>
                <div className="space-y-2">
                  {Object.entries(selected).map(([key, value]) => {
                    // Hide technical/irrelevant fields
                    if (
                      key === 'images' ||
                      key === '_id' ||
                      key === '__v' ||
                      key === 'createdAt' ||
                      key === 'updatedAt' ||
                      key === 'views' ||
                      key === 'viewedAt'
                    )
                      return null;

                    // Show price with currency
                    if (key === 'price') {
                      const currency = selected.currency || 'NGN';
                      const currencySymbol =
                        currency === 'NGN'
                          ? '₦'
                          : currency === 'USD'
                          ? '$'
                          : currency === 'EUR'
                          ? '€'
                          : currency === 'GBP'
                          ? '£'
                          : currency === 'CAD'
                          ? 'C$'
                          : '';
                      return (
                        <div key={key} className="text-gray-700">
                          <span className="font-semibold">Price: </span>
                          {currencySymbol}
                          {value}
                        </div>
                      );
                    }

                    // Show all other fields
                    return (
                      <div key={key} className="text-gray-700">
                        <span className="font-semibold">
                          {key.charAt(0).toUpperCase() + key.slice(1)}:{' '}
                        </span>
                        {Array.isArray(value)
                          ? value.join(', ')
                          : String(value)}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProperties;
