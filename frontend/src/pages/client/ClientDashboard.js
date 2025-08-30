import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

const API_BASE = 'http://localhost:5000/api';

const ClientDashboard = () => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [bonuses, setBonuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone_number: '' });
  const [saving, setSaving] = useState(false);

  // For demo: get user email from localStorage (should be set after review submission)
  const userEmail = localStorage.getItem('clientEmail');

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/email/${encodeURIComponent(userEmail)}`);
        if (!res.ok) throw new Error('Failed to get user');
        const user = await res.json();
        setUserId(user.id);
        setUser(user);
        setEditForm({ name: user.name || '', phone_number: user.phone_number || '' });
      } catch (err) {
        setError('Could not find user.');
        setLoading(false);
      }
    };
    if (userEmail) fetchUserId();
    else {
      setError('No user email found.');
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE}/reviews/user/${userId}`).then(r => r.json()),
      fetch(`${API_BASE}/users/${userId}/bonuses`).then(r => r.json())
    ])
      .then(([reviews, bonuses]) => {
        setReviews(reviews);
        setBonuses(bonuses);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load data.');
        setLoading(false);
      });
  }, [userId]);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const updated = await res.json();
      setUser(updated);
      setEditMode(false);
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const activeBonuses = bonuses.filter(b => b.status === 'claimed').length;
  const inactiveBonuses = bonuses.filter(b => b.status !== 'claimed').length;

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Helmet>
        <title>My Bonuses & Reviews | Feedback App</title>
      </Helmet>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2">Your Profile</h1>
        <div className="mb-2"><span className="font-semibold">Email:</span> {user.email}</div>
        {editMode ? (
          <>
            <div className="mb-2">
              <label className="font-semibold mr-2">Name:</label>
              <input name="name" value={editForm.name} onChange={handleEditChange} className="border rounded px-2 py-1" />
            </div>
            <div className="mb-2">
              <label className="font-semibold mr-2">Phone:</label>
              <input name="phone_number" value={editForm.phone_number} onChange={handleEditChange} className="border rounded px-2 py-1" />
            </div>
            <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded mr-2">{saving ? 'Saving...' : 'Save'}</button>
            <button onClick={() => setEditMode(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          </>
        ) : (
          <>
            <div className="mb-2"><span className="font-semibold">Name:</span> {user.name || <span className="text-gray-400">(not set)</span>}</div>
            <div className="mb-2"><span className="font-semibold">Phone:</span> {user.phone_number || <span className="text-gray-400">(not set)</span>}</div>
            <button onClick={() => setEditMode(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Edit</button>
          </>
        )}
        <div className="mt-4 flex gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded p-4 flex-1 text-center">
            <div className="text-3xl font-bold">{reviews.length}</div>
            <div className="text-gray-600">Reviews Written</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded p-4 flex-1 text-center">
            <div className="text-3xl font-bold">{activeBonuses}</div>
            <div className="text-gray-600">Active Bonuses</div>
          </div>
          <div className="bg-gray-100 border border-gray-200 rounded p-4 flex-1 text-center">
            <div className="text-3xl font-bold">{inactiveBonuses}</div>
            <div className="text-gray-600">Used/Inactive Bonuses</div>
          </div>
        </div>
      </div>
      <h2 className="text-xl font-bold mb-2">Your Bonuses</h2>
      {bonuses.length === 0 ? (
        <p className="mb-8">You have no bonuses yet.</p>
      ) : (
        <ul className="mb-8 space-y-3">
          {bonuses.map(bonus => (
            <li key={bonus.id} className="bg-green-50 border border-green-200 rounded p-4">
              <div className="font-semibold">{bonus.description}</div>
              <div className="text-sm text-gray-600">From: {bonus.business_name}</div>
              <div className="text-xs text-gray-500">Status: {bonus.status}</div>
            </li>
          ))}
        </ul>
      )}
      <h2 className="text-xl font-bold mb-2">Your Reviews</h2>
      {reviews.length === 0 ? (
        <p>You have not submitted any reviews yet.</p>
      ) : (
        <ul className="space-y-3">
          {reviews.map(review => (
            <li key={review.id} className="bg-blue-50 border border-blue-200 rounded p-4">
              <div className="font-semibold">{review.business_name}</div>
              <div className="text-sm text-gray-700 mb-1">Rating: {review.rating} / 5</div>
              <div className="text-gray-600 mb-1">{review.text}</div>
              <div className="text-xs text-gray-500">Submitted: {new Date(review.created_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientDashboard; 