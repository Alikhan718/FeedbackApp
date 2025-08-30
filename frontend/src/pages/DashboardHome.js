import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api';

const DashboardHome = () => {
  const [reviews, setReviews] = useState([]);
  const [bonuses, setBonuses] = useState([]);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const qrRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get business owner email from localStorage
        const businessEmail = localStorage.getItem('businessEmail');
        if (!businessEmail) throw new Error('No business email found.');

        // 1. Get owner user by email
        const userRes = await fetch(`${API_BASE}/users/email/${encodeURIComponent(businessEmail)}`);
        if (!userRes.ok) throw new Error('Could not find business owner');
        const user = await userRes.json();

        // 2. Get business by owner_id
        const bizRes = await fetch(`${API_BASE}/business`);
        if (!bizRes.ok) throw new Error('Could not fetch businesses');
        const businesses = await bizRes.json();
        const myBiz = businesses.find(b => b.owner_id === user.id);
        if (!myBiz) throw new Error('No business found for this owner');
        setBusiness(myBiz);

        // 3. Get reviews for this business
        const reviewsRes = await fetch(`${API_BASE}/business/${myBiz.id}/reviews`);
        if (!reviewsRes.ok) throw new Error('Could not fetch reviews');
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);

        // 4. Get bonuses for this business (using demo data for now)
        setBonuses([
          { id: 1, description: '10% off next visit', type: 'discount', value: 10, is_active: true },
          { id: 2, description: 'Free dessert', type: 'gift', value: null, is_active: true },
        ]);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `review-qr-business-${business.id}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  const activeBonuses = bonuses.filter(b => b.is_active);
  const averageRating = reviews.length 
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : 'N/A';

  return (
    <div className="p-8">
      <Helmet>
        <title>Dashboard | Feedback App</title>
      </Helmet>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Reviews</h3>
          <p className="text-3xl font-bold">{reviews.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Average Rating</h3>
          <p className="text-3xl font-bold flex items-center">
            {averageRating} 
            <span className="text-yellow-400 ml-2">★</span>
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Active Bonuses</h3>
          <p className="text-3xl font-bold">{activeBonuses.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reviews */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Recent Reviews</h2>
                <Link to="/business/reviews" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All →
                </Link>
              </div>
            </div>
            <div className="p-6">
              {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet.</p>
              ) : (
                <div className="space-y-6">
                  {reviews.slice(0, 3).map(review => (
                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold">{review.user_email}</div>
                        <div className="flex items-center">
                          <span className="font-bold mr-1">{review.rating}</span>
                          <span className="text-yellow-400">★</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-1">{review.text}</p>
                      <div className="text-xs text-gray-400">
                        {new Date(review.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* QR Code and Active Bonuses */}
        <div className="space-y-6">
          {/* QR Code */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Review QR Code</h2>
            <div className="flex flex-col items-center" ref={qrRef}>
              {business && (
                <>
                  <QRCodeSVG 
                    value={`${window.location.origin}/review/${business.id}`} 
                    size={180} 
                    className="mb-4"
                  />
                  <button
                    onClick={handleDownloadQR}
                    className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 w-full"
                  >
                    Download QR Code
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Active Bonuses */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Active Bonuses</h2>
                <Link to="/business/bonuses" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Manage →
                </Link>
              </div>
            </div>
            <div className="p-6">
              {activeBonuses.length === 0 ? (
                <p className="text-gray-500">No active bonuses.</p>
              ) : (
                <div className="space-y-4">
                  {activeBonuses.map(bonus => (
                    <div key={bonus.id} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <div className="font-medium">{bonus.description}</div>
                        <div className="text-sm text-gray-600">
                          {bonus.type}{bonus.value ? ` | ${bonus.value}` : ''}
                        </div>
                      </div>
                      <div className="text-green-600 text-sm font-medium">Active</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome; 