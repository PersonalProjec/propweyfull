import React, { useEffect, useState } from 'react';
import {
  HiHome,
  HiCheckCircle,
  HiMailOpen,
  HiSparkles,
  HiEye,
  HiUserGroup,
  HiCalendar,
} from 'react-icons/hi';

const api = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${api}/admin/dashboard-stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });
        const result = await res.json();
        if (!res.ok)
          throw new Error(result.message || 'Failed to fetch dashboard stats');
        setStats(result);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-black-200">
          Welcome, Admin 🎉
        </h1>
        <p className="text-gray-600 dark:text-blakc-200">
          Here's a quick overview of your platform activity.
        </p>
      </div>

      {loading ? (
        <div className="py-10 text-center text-lg text-gray-500">
          Loading dashboard...
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<HiHome />}
              title="Total Properties"
              value={stats.totalProperties}
            />
            <StatCard
              icon={<HiEye />}
              title="Total Property Views"
              value={stats.totalPropertyViews}
            />
            <StatCard
              icon={<HiMailOpen />}
              title="Total Contacts"
              value={stats.totalContacts}
            />
            <StatCard
              icon={<HiCheckCircle />}
              title="Verified Properties"
              value={stats.verifiedProperties}
            />
            <StatCard
              icon={<HiSparkles />}
              title="Limited Offers"
              value={stats.limitedOffers}
            />
            <StatCard
              icon={<HiCalendar />}
              title="Added This Week"
              value={stats.propertiesLastWeek}
            />
            <StatCard
              icon={<HiCalendar />}
              title="Added This Month"
              value={stats.propertiesLastMonth}
            />
          </div>

          {/* Top Agents Leaderboard */}
          {stats.topAgents && stats.topAgents.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <HiUserGroup className="text-primary" /> Top Agents
              </h3>
              <div className="overflow-x-auto rounded shadow bg-white dark:bg-gray-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="py-2 px-4 text-left text-xs font-semibold uppercase">
                        Agent
                      </th>
                      <th className="py-2 px-4 text-left text-xs font-semibold uppercase">
                        Email
                      </th>
                      <th className="py-2 px-4 text-left text-xs font-semibold uppercase">
                        Properties
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topAgents.map((agent, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="py-2 px-4">{agent.name}</td>
                        <td className="py-2 px-4">{agent.email}</td>
                        <td className="py-2 px-4 font-bold">{agent.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="py-10 text-center text-red-500">
          Failed to load dashboard stats.
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-4 text-primary text-3xl">
        {icon}
        <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
          {title}
        </h2>
      </div>
      <p className="text-4xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}
