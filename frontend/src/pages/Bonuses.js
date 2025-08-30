import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { QRCodeSVG } from 'qrcode.react';

const API_BASE = 'http://localhost:5000/api';

const initialBonuses = [
  { id: 1, description: '10% off next visit', type: 'discount', value: 10, is_active: true },
  { id: 2, description: 'Free dessert', type: 'gift', value: null, is_active: true },
  { id: 3, description: '5% off for friends', type: 'discount', value: 5, is_active: false },
];

const Bonuses = () => {
  const [bonuses, setBonuses] = useState(initialBonuses);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ description: '', type: '', value: '' });
  const [activeTab, setActiveTab] = useState('active');
  const [business, setBusiness] = useState(null);
  const [loadingBiz, setLoadingBiz] = useState(true);
  const [error, setError] = useState(null);
  const qrRef = useRef();

  // Get business for logged-in owner
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const businessEmail = localStorage.getItem('businessEmail');
        if (!businessEmail) throw new Error('No business email found.');
        const userRes = await fetch(`${API_BASE}/users/email/${encodeURIComponent(businessEmail)}`);
        if (!userRes.ok) throw new Error('Could not find business owner');
        const user = await userRes.json();
        const bizRes = await fetch(`${API_BASE}/business`);
        if (!bizRes.ok) throw new Error('Could not fetch businesses');
        const businesses = await bizRes.json();
        const myBiz = businesses.find(b => b.owner_id === user.id);
        if (!myBiz) throw new Error('No business found for this owner');
        setBusiness(myBiz);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingBiz(false);
      }
    };
    fetchBusiness();
  }, []);

  const handleAddBonus = (e) => {
    e.preventDefault();
    const newBonus = {
      id: Date.now(),
      description: form.description,
      type: form.type,
      value: form.value,
      is_active: true,
    };
    setBonuses([newBonus, ...bonuses]);
    setForm({ description: '', type: '', value: '' });
    setShowForm(false);
    setActiveTab('active');
  };

  const handleDeactivate = (id) => {
    setBonuses(bonuses.map(b => b.id === id ? { ...b, is_active: false } : b));
    setActiveTab('active');
  };

  const handleDelete = (id) => {
    setBonuses(bonuses.filter(b => b.id !== id));
  };

  const handleDownload = () => {
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

  const filteredBonuses = bonuses.filter(b => activeTab === 'active' ? b.is_active : !b.is_active);

  return (
    <div>
      <Helmet>
        <title>Bonuses | Feedback App</title>
      </Helmet>
      <h1 className="text-2xl font-bold mb-4">Bonuses</h1>
      {/* QR Code Section */}
      <div className="mb-8 flex justify-center">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center w-full max-w-xs" ref={qrRef}>
          <h2 className="text-lg font-bold mb-2 text-center">Your QR Code for Reviews</h2>
          {loadingBiz ? (
            <div>Loading QR code...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : business ? (
            <>
              <QRCodeSVG value={`${window.location.origin}/review/${business.id}`} size={180} />
              <div className="mt-2 text-sm text-gray-700 text-center">Scan to submit a review:<br /></div>
              <button
                onClick={handleDownload}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700"
              >
                Download QR Code
              </button>
            </>
          ) : null}
        </div>
      </div>
      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : 'Add New Bonus'}
      </button>

      {showForm && (
        <form onSubmit={handleAddBonus} className="mb-6 bg-white p-4 rounded shadow space-y-4 max-w-md">
          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Type</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Value</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={form.value}
              onChange={e => setForm({ ...form, value: e.target.value })}
            />
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700">Add Bonus</button>
        </form>
      )}

      {/* Tabs */}
      <div className="mb-4 flex space-x-2">
        <button
          className={`px-4 py-2 rounded-t font-bold focus:outline-none ${activeTab === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('active')}
        >
          Active
        </button>
        <button
          className={`px-4 py-2 rounded-t font-bold focus:outline-none ${activeTab === 'disabled' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('disabled')}
        >
          Disabled
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">{activeTab === 'active' ? 'Active Bonuses' : 'Disabled Bonuses'}</h2>
      <ul className="space-y-2">
        {filteredBonuses.length === 0 && <li className="text-gray-500">No {activeTab} bonuses.</li>}
        {filteredBonuses.map(bonus => (
          <li key={bonus.id} className="border p-4 rounded flex justify-between items-center bg-white">
            <div>
              <p className="font-semibold">{bonus.description}</p>
              <p className="text-sm text-gray-600">Type: {bonus.type} {bonus.value && `| Value: ${bonus.value}`}</p>
            </div>
            <div className="space-x-2">
              {activeTab === 'active' && (
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDeactivate(bonus.id)}
                >
                  Deactivate
                </button>
              )}
              <button
                className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                onClick={() => handleDelete(bonus.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Bonuses; 