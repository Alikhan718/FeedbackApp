import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ReviewSubmission = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [formData, setFormData] = useState({
    rating: 5,
    text: '',
    userEmail: ''
  });
  const [receipt, setReceipt] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  useEffect(() => {
    // Fetch business info when component mounts
    fetchBusinessInfo();
  }, [businessId]);

  const fetchBusinessInfo = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/business/${businessId}`);
      if (response.ok) {
        const businessData = await response.json();
        setBusiness(businessData);
      }
    } catch (error) {
      console.error('Error fetching business info:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceipt(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAiResponse(null);

    try {
      // Create FormData object to handle file upload
      const formDataToSend = new FormData();
      formDataToSend.append('businessId', businessId);
      formDataToSend.append('text', formData.text);
      formDataToSend.append('rating', formData.rating);
      formDataToSend.append('userEmail', formData.userEmail);
      if (receipt) {
        formDataToSend.append('receipt', receipt);
      }

      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        if (result.approved) {
          // Review was approved by AI
          setAiResponse(result); // Save the AI response for confirmation page
          setSubmitted(true);
          localStorage.setItem('clientEmail', formData.userEmail);
          console.log('Review submitted successfully:', result);
        } else {
          // Review was rejected by AI
          setAiResponse(result);
          console.log('Review rejected by AI:', result);
        }
      } else {
        alert(result.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRetry = () => {
    setAiResponse(null);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
          <div className="text-green-500 text-7xl mb-6">✅</div>
          <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            {aiResponse && aiResponse.confirmation_message
              ? aiResponse.confirmation_message
              : 'Your review has been approved and submitted successfully!'}
          </p>
          <p className="text-sm text-gray-500 mb-8">You will receive your bonus shortly!</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors mb-3"
          >
            Done
          </button>
          <button
            onClick={() => navigate('/client')}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-green-700 active:bg-green-800 transition-colors"
          >
            View My Bonuses
          </button>
        </div>
      </div>
    );
  }

  if (aiResponse && !aiResponse.approved) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
          <div className="text-yellow-500 text-7xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">Review Needs Improvement</h2>
          <p className="text-gray-600 mb-4">{aiResponse.reason}</p>

          {/* Show covered and missing aspects */}
          <div className="mb-4">
            <div className="text-sm text-gray-700 mb-1 font-semibold">Covered Aspects:</div>
            <div className="text-sm text-green-700 mb-2">{aiResponse.covered_aspects && aiResponse.covered_aspects.length > 0 ? aiResponse.covered_aspects.join(', ') : 'None'}</div>
            <div className="text-sm text-gray-700 mb-1 font-semibold">Missing Aspects:</div>
            <div className="text-sm text-red-700 mb-2">{aiResponse.missing_aspects && aiResponse.missing_aspects.length > 0 ? aiResponse.missing_aspects.join(', ') : 'None'}</div>
          </div>

          {aiResponse.suggestions && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">Suggestions:</h3>
              <p className="text-blue-700 text-sm">{aiResponse.suggestions}</p>
            </div>
          )}

          <div className="text-sm text-gray-500 mb-6">
            <p>AI Analysis:</p>
            <p>Sentiment: <span className="font-medium">{aiResponse.sentiment}</span></p>
            <p>Topics: <span className="font-medium">{aiResponse.topics.join(', ')}</span></p>
          </div>

          <button
            onClick={handleRetry}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
          >
            Edit Review
          </button>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading business information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:py-8">
      <div className="max-w-xl mx-auto">
        {/* Business Logo */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 mb-2">
            {business && business.logo_url ? (
              <img src={/^https?:\/\//i.test(business.logo_url) ? business.logo_url : `http://localhost:5000${business.logo_url}`} alt="Business logo" className="object-contain object-center w-full h-full" />
            ) : (
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11a4 4 0 108 0 4 4 0 00-8 0z" />
              </svg>
            )}
          </div>
          <h1 className="text-2xl font-bold mb-2">{business.name}</h1>
          <p className="text-gray-600 mb-3">{business.industry} • {business.location}</p>
          <p className="text-sm text-gray-500">Please share your experience with us!</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Submit Your Review</h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Rating */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                Rating *
              </label>
              <div className="flex justify-between items-center px-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className={`text-4xl p-2 -m-2 ${
                      star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                {formData.rating} out of 5 stars
              </p>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                Your Review *
              </label>
              <textarea
                name="text"
                value={formData.text}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                placeholder="Tell us about your experience..."
              />
              <p className="text-sm text-gray-500 mt-2">
                Please provide detailed feedback about your experience. AI will review your submission.
              </p>
            </div>

            {/* Receipt Upload */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                Upload Receipt Photo
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  {previewUrl ? (
                    <div className="mb-4">
                      <img src={previewUrl} alt="Receipt preview" className="mx-auto max-h-48 object-contain" />
                    </div>
                  ) : (
                    <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  <div className="mt-4 flex flex-col items-center text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="receipt-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                    >
                      <span>{previewUrl ? 'Change photo' : 'Upload a photo'}</span>
                      <input
                        id="receipt-upload"
                        name="receipt"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600 mt-2">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                Your Email *
              </label>
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                placeholder="your.email@example.com"
              />
              <p className="text-sm text-gray-500 mt-2">
                We'll use this to send you your bonus
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 px-4 rounded-lg text-lg font-medium hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'AI is reviewing your submission...' : 'Submit Review & Get Bonus'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmission; 