import React, { useState } from 'react';
import { toast } from 'react-toastify';

const api = import.meta.env.VITE_API_BASE_URL;

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirm) {
      toast.error('All fields are required');
      return;
    }
    if (newPassword !== confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${api}/admin/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to change password');
      toast.success('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirm('');
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
      <form className="space-y-5" onSubmit={handleChange}>
        <div>
          <label className="block mb-1 font-semibold">Old Password</label>
          <input
            type="password"
            className="border rounded p-2 w-full"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">New Password</label>
          <input
            type="password"
            className="border rounded p-2 w-full"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Confirm New Password</label>
          <input
            type="password"
            className="border rounded p-2 w-full"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 w-full"
          disabled={loading}
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
