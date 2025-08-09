import React, { useEffect, useState } from 'react';
import { FiEye, FiTrash2, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Button from '../../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

const api = import.meta.env.VITE_API_BASE_URL;

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${api}/bookings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      const result = await res.json();
      setBookings(result.bookings || []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      toast.error('Failed to load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openModal = (booking) => {
    setSelected(booking);
    setModalOpen(true);
  };
  const closeModal = () => {
    setSelected(null);
    setModalOpen(false);
  };
  useEffect(() => {
    if (modalOpen && selected) {
      setPendingStatus(selected.status);
    }
  }, [modalOpen, selected]);

  // Update booking status
  const handleStatusChange = async (status) => {
    try {
      const res = await fetch(`${api}/bookings/${selected._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast.success('Status updated!');
      setSelected({ ...selected, status });
      setPendingStatus(status);
      fetchBookings();
      setModalOpen(false);
    } catch (err) {
      console.error('Failed to update booking status:', err);
      toast.error('Update failed');
    }
  };

  // Delete booking
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    try {
      const res = await fetch(`${api}/bookings/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Booking deleted!');
      closeModal();
      fetchBookings();
    } catch (err) {
      console.error('Failed to delete booking:', err);
      toast.error('Delete failed');
    }
  };

  // Modern status badge color
  const statusColor = (status) =>
    status === 'pending'
      ? 'bg-yellow-100 text-yellow-700'
      : status === 'confirmed'
      ? 'bg-blue-100 text-blue-700'
      : status === 'completed'
      ? 'bg-green-100 text-green-700'
      : 'bg-red-100 text-red-700';

  return (
    <div className="max-w-5xl mx-auto p-3">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gold">
        <FiCalendar /> Bookings
      </h2>

      {loading ? (
        <div className="py-16 text-center text-lg text-gray-400">
          Loading...
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No bookings yet.</div>
      ) : (
        <div className="w-full">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-xl border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-gold/10">
                  <th className="p-3 text-left font-semibold text-gold">
                    Name
                  </th>
                  <th className="p-3 text-left font-semibold text-gold">
                    Phone
                  </th>
                  <th className="p-3 text-left font-semibold text-gold">
                    Property
                  </th>
                  <th className="p-3 text-left font-semibold text-gold">
                    Visit Date
                  </th>
                  <th className="p-3 text-left font-semibold text-gold">
                    Status
                  </th>
                  <th className="p-3 text-left font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr
                    key={b._id}
                    className="hover:bg-gold/5 text-white rounded-xl transition"
                  >
                    <td className="p-3">{b.name}</td>
                    <td className="p-3">{b.phone}</td>
                    <td className="p-3">{b.property?.title || '--'}</td>
                    <td className="p-3">
                      {b.visitDate
                        ? new Date(b.visitDate).toLocaleDateString()
                        : '--'}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(
                          b.status
                        )}`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <Button
                        variant="outline"
                        color="gold"
                        size="sm"
                        className="rounded-full"
                        onClick={() => openModal(b)}
                      >
                        <FiEye />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="md:hidden flex flex-col gap-4  text-white">
            {bookings.map((b) => (
              <motion.div
                key={b._id}
                className="bg-white dark:bg-gray-900 rounded-xl  shadow border border-gold/20 p-4 flex flex-col gap-2"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gold">{b.name}</span>
                  <Button
                    variant="outline"
                    color="gold"
                    size="sm"
                    onClick={() => openModal(b)}
                  >
                    <FiEye />
                  </Button>
                </div>
                <div className="text-xs text-gray-500 ">{b.phone}</div>
                <div className="text-sm font-semibold">
                  {b.property?.title || '--'}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(
                      b.status
                    )}`}
                  >
                    {b.status}
                  </span>
                  <span className="text-xs">
                    {b.visitDate
                      ? new Date(b.visitDate).toLocaleDateString()
                      : '--'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-2  text-white"
          >
            <motion.div
              initial={{ scale: 0.92, y: 32 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 60 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-6 relative shadow-xl"
            >
              <button
                className="absolute top-3 right-3 text-xl text-gray-400 hover:text-red-500"
                onClick={closeModal}
              >
                ×
              </button>
              <h3 className="text-xl font-bold mb-4 text-gold">
                Booking Details
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <b>Name:</b> {selected.name}
                </div>
                <div>
                  <b>Phone:</b> {selected.phone}
                </div>
                {selected.email && (
                  <div>
                    <b>Email:</b> {selected.email}
                  </div>
                )}
                <div>
                  <b>Property:</b> {selected.property?.title || '--'}
                </div>
                <div>
                  <b>Location:</b> {selected.property?.location || '--'}
                </div>
                <div>
                  <b>Visit Date:</b>{' '}
                  {selected.visitDate
                    ? new Date(selected.visitDate).toLocaleDateString()
                    : '--'}
                </div>
                <div>
                  <b>Status:</b>{' '}
                  <select
                    value={pendingStatus}
                    onChange={(e) => setPendingStatus(e.target.value)}
                    className="border rounded p-1 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-gold"
                  >
                    {['pending', 'confirmed', 'completed', 'cancelled'].map(
                      (s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      )
                    )}
                  </select>
                  <button
                    className="ml-3 px-3 py-1 rounded bg-gold text-black font-bold hover:bg-gold/90 transition"
                    disabled={pendingStatus === selected.status}
                    onClick={async () => {
                      await handleStatusChange(pendingStatus);
                    }}
                  >
                    Save
                  </button>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="solid"
                    color="gold"
                    onClick={() => handleDelete(selected._id)}
                  >
                    <FiTrash2 className="mr-1" />
                    Delete
                  </Button>
                  <Button variant="outline" color="gold" onClick={closeModal}>
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
