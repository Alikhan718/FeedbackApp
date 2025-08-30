import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
// If recharts or chart.js is not installed, fallback to tables
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const demoStats = {
  totalReviews: 24,
  avgRating: 4.3,
  positive: 16,
  neutral: 5,
  negative: 3,
  topTopics: [
    { topic: 'service', count: 12 },
    { topic: 'food', count: 8 },
    { topic: 'cleanliness', count: 6 },
    { topic: 'price', count: 4 },
  ],
  reviewsByDay: [
    { day: 'Mon', count: 2 },
    { day: 'Tue', count: 4 },
    { day: 'Wed', count: 3 },
    { day: 'Thu', count: 5 },
    { day: 'Fri', count: 6 },
    { day: 'Sat', count: 3 },
    { day: 'Sun', count: 1 },
  ],
};

const Analytics = () => {
  const [stats, setStats] = useState(demoStats);

  // In real app, fetch stats from API
  useEffect(() => {
    // fetch stats here
  }, []);

  return (
    <div className="p-8">
      <Helmet>
        <title>Analytics | Feedback App</title>
      </Helmet>
      <h1 className="text-2xl font-bold mb-6">Business Analytics</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-gray-500 text-sm mb-1">Total Reviews</div>
          <div className="text-3xl font-bold">{stats.totalReviews}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-gray-500 text-sm mb-1">Avg. Rating</div>
          <div className="text-3xl font-bold flex items-center justify-center">
            {stats.avgRating} <span className="text-yellow-400 ml-2">★</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-gray-500 text-sm mb-1">Positive</div>
          <div className="text-3xl font-bold text-green-600">{stats.positive}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-gray-500 text-sm mb-1">Negative</div>
          <div className="text-3xl font-bold text-red-500">{stats.negative}</div>
        </div>
      </div>

      {/* Top Topics Table */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">Top Review Topics</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mentions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stats.topTopics.map((t) => (
              <tr key={t.topic}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">{t.topic}</td>
                <td className="px-6 py-4 whitespace-nowrap">{t.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reviews by Day Table (as a bar chart alternative) */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">Reviews This Week</h2>
        <div className="flex items-end space-x-4 h-32">
          {stats.reviewsByDay.map((d) => (
            <div key={d.day} className="flex flex-col items-center justify-end h-full">
              <div
                className="bg-blue-500 rounded-t w-8"
                style={{ height: `${d.count * 16}px`, minHeight: '1rem' }}
                title={`${d.count} reviews`}
              ></div>
              <div className="text-xs text-gray-500 mt-2">{d.day}</div>
              <div className="text-xs text-gray-700">{d.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
