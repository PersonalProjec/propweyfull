import React, { useEffect, useState } from 'react';

const api = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${api}/admin/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });
        const result = await res.json();
        if (!res.ok)
          throw new Error(result.message || 'Failed to fetch profile');
        setAdmin(result.admin);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="py-16 text-center text-lg">Loading profile...</div>;
  }

  if (!admin) {
    return (
      <div className="py-16 text-center text-red-600">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Admin Profile</h2>
      <div className="space-y-4">
        <ProfileRow label="Username" value={admin.username} />
        <ProfileRow label="Email" value={admin.email} />
        <ProfileRow label="Role" value={admin.role} />
        <ProfileRow
          label="Created"
          value={new Date(admin.createdAt).toLocaleString()}
        />
        <ProfileRow
          label="Last Updated"
          value={new Date(admin.updatedAt).toLocaleString()}
        />
      </div>
    </div>
  );
};

const ProfileRow = ({ label, value }) => (
  <div className="flex flex-col md:flex-row md:items-center gap-1">
    <span className="font-semibold w-36">{label}:</span>
    <span className="bg-gray-100 rounded px-3 py-2 flex-1">{value}</span>
  </div>
);

export default Profile;
