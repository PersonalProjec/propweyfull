import { useState, useEffect } from 'react';
import Sortable from 'sortablejs';
import { toast } from 'react-toastify';

const UploadProperty = () => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    area: '',
    type: 'Apartment',
    category: 'Rent',
    tags: '',
    description: '',
    currency: 'NGN',
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const api = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const el = document.getElementById('sortable-images');
    if (el) {
      Sortable.create(el, {
        animation: 200,
        onEnd: (evt) => {
          const updated = [...files];
          const [moved] = updated.splice(evt.oldIndex, 1);
          updated.splice(evt.newIndex, 0, moved);
          setFiles(updated);
        },
      });
    }
  }, [files]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeImage = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateFields = () => {
    const required = ['title', 'location', 'price', 'area', 'description'];
    for (let field of required) {
      if (!formData[field]) {
        toast.error(`${field} is required`);
        return false;
      }
    }

    if (!files.length) {
      toast.error('At least one image is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    setLoading(true);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        form.append(key, value)
      );

      // Only send tags as a single comma-separated string
      form.append('tags', formData.tags);

      // Backend expects 'files' or 'images' depending on implementation
      files.forEach((file) => form.append('images', file));

      const res = await fetch(`${api}/properties/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: form,
        credentials: 'include',
      });

      const result = await res.json();
      // console.log('🔥 Frontend Upload result:', result);
      if (!res.ok) throw new Error(result.message || 'Upload failed');

      toast.success('Property uploaded successfully!');
      setShowPreview(false);
      setFormData({
        title: '',
        location: '',
        price: '',
        area: '',
        type: 'Apartment',
        category: 'Rent',
        tags: '',
        description: '',
      });
      setFiles([]);
    } catch (err) {
      let msg = '';
      if (err instanceof Error) {
        msg = err.message;
      } else if (typeof err === 'string') {
        msg = err;
      } else if (err && err.message) {
        msg = err.message;
      } else {
        msg = JSON.stringify(err);
      }
      console.error('🔥 Frontend Upload Error:', err);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Upload New Property</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['title', 'location', 'price', 'area'].map((name) => (
          <input
            key={name}
            name={name}
            placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
            value={formData[name]}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        ))}
        <select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="NGN">Naira (₦)</option>
          <option value="USD">US Dollar ($)</option>
          <option value="EUR">Euro (€)</option>
          <option value="GBP">British Pound (£)</option>
          <option value="CAD">Canadian Dollar (C$)</option>
        </select>

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Land">Land</option>
          <option value="Office">Office</option>
        </select>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="Rent">Rent</option>
          <option value="Sale">Sale</option>
          <option value="Sale">Shortlet</option>
        </select>

        <input
          name="tags"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded resize-none"
          rows="4"
        />

        {/* File Upload */}
        <div
          className="w-full border-2 border-dashed p-6 text-center cursor-pointer"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
          Drag & Drop or Click to Upload Images
        </div>

        {/* Preview */}
        {files.length > 0 && (
          <div
            id="sortable-images"
            className="grid grid-cols-3 gap-4 mt-4 cursor-move"
          >
            {files.map((file, i) => (
              <div key={i} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`upload-${i}`}
                  className="w-full h-28 object-cover rounded"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-white p-1 rounded-full text-red-500"
                  onClick={() => removeImage(i)}
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="w-full py-2 bg-gray-200 text-gray-700 rounded"
        >
          Preview Listing
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
        >
          {loading ? 'Uploading...' : 'Upload Property'}
        </button>
      </form>

      {showPreview && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h3 className="font-bold mb-2">Listing Preview</h3>
          <p>🏠 Title: {formData.title}</p>
          <p>📍 Location: {formData.location}</p>
          <p>
            💰 Price:{' '}
            {formData.currency === 'NGN'
              ? '₦'
              : formData.currency === 'USD'
              ? '$'
              : formData.currency === 'EUR'
              ? '€'
              : formData.currency === 'GBP'
              ? '£'
              : formData.currency === 'CAD'
              ? 'C$'
              : ''}
            {formData.price}
          </p>

          <p>📐 Area: {formData.area}</p>
          <p>🏷️ Type: {formData.type}</p>
          <p>📂 Category: {formData.category}</p>
          <p>📝 Description: {formData.description}</p>
          <p>🔖 Tags: {formData.tags}</p>
        </div>
      )}
    </div>
  );
};
export default UploadProperty;
