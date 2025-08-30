import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';

const API_ORIGIN = 'http://localhost:5000';
const API_BASE = `${API_ORIGIN}/api`;

const Settings = () => {
  const [businessId, setBusinessId] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    const init = async () => {
      try {
        const businessEmail = localStorage.getItem('businessEmail');
        if (!businessEmail) throw new Error('No business email found.');

        // 1) Get owner by email
        const userRes = await fetch(`${API_BASE}/users/email/${encodeURIComponent(businessEmail)}`);
        if (!userRes.ok) throw new Error('Could not find business owner');
        const user = await userRes.json();

        // 2) Get businesses and find mine
        const bizRes = await fetch(`${API_BASE}/business`);
        if (!bizRes.ok) throw new Error('Could not fetch businesses');
        const businesses = await bizRes.json();
        const myBiz = businesses.find((b) => b.owner_id === user.id);
        if (!myBiz) throw new Error('No business found for this owner');

        setBusinessId(myBiz.id);
        setLogoUrl(myBiz.logo_url || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const getDisplayUrl = (url) => {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;
    return `${API_ORIGIN}${url}`;
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file || !businessId) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('logo', file);
      const resp = await fetch(`${API_BASE}/business/${businessId}/logo`, {
        method: 'POST',
        body: formData,
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Upload failed');
      setLogoUrl(data.logo_url || null);
      setPreview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!businessId) return;
    setUploading(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE}/business/${businessId}/logo`, {
        method: 'DELETE',
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Delete failed');
      setLogoUrl(null);
      setPreview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  return (
    <div>
      <Helmet>
        <title>Settings | Feedback App</title>
      </Helmet>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Business Logo</h2>
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
            {preview ? (
              <img src={preview} alt="Logo preview" className="object-cover w-full h-full" />
            ) : logoUrl ? (
              <img src={getDisplayUrl(logoUrl)} alt="Business logo" className="object-cover w-full h-full" />
            ) : (
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11a4 4 0 108 0 4 4 0 00-8 0z" />
              </svg>
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleLogoChange}
            />
            <button
              type="button"
              className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 mr-2 disabled:opacity-50"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              disabled={uploading}
            >
              {preview || logoUrl ? 'Change Logo' : 'Upload Logo'}
            </button>
            {(preview || logoUrl) && (
              <button
                type="button"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-300 disabled:opacity-50"
                onClick={handleRemoveLogo}
                disabled={uploading}
              >
                Remove
              </button>
            )}
            <p className="text-xs text-gray-500 mt-2">Recommended: Square image, PNG/JPG/WEBP/SVG, max 5MB.</p>
            {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
          </div>
        </div>
      </div>
      <p>Business settings and configurations will be available here.</p>
    </div>
  );
};

export default Settings;