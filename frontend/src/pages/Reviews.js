import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { API_BASE, getImageUrl } from '../config/api';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [business, setBusiness] = useState(null);

  // For demo: get business owner email from localStorage
  const businessEmail = localStorage.getItem('businessEmail');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
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
        const reviews = await reviewsRes.json();
        setReviews(reviews);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (businessEmail) fetchReviews();
    else {
      setError('No business email found.');
      setLoading(false);
    }
  }, [businessEmail]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="p-8">
      <Helmet>
        <title>Business Reviews | Feedback App</title>
      </Helmet>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 mr-3">
          {business?.logo_url ? (
            <img
              src={getImageUrl(business.logo_url)}
              alt="Business logo"
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>
        <h1 className="text-2xl font-bold">Reviews for {business?.name}</h1>
      </div>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map(review => (
            <li key={review.id} className="bg-white rounded shadow p-4">
              <div className="font-semibold mb-1">From: {review.user_email}</div>
              <div className="mb-1">Rating: <span className="font-bold">{review.rating}</span> / 5</div>
              <div className="mb-1">{review.text}</div>
              <div className="text-xs text-gray-500">{new Date(review.created_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Reviews; 