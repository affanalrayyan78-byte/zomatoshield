import React, { useState } from 'react';
import { registerUser } from '../services/api';

const Registration = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    locationRisk: 'medium',
    upiId: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await registerUser(formData);
      if (response.success) {
        onLogin(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="max-w-2xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-secondary mb-4">
            Welcome to ZomatoShield
          </h2>
          <p className="text-lg text-gray-600">
            AI-powered income protection for delivery workers
          </p>
          <p className="text-gray-500 mt-2">
            Get instant payouts during rain, heatwaves, and other disruptions
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-secondary mb-6">Register Now</h3>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="Enter your full name"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="10-digit mobile number"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="e.g., Mumbai, Delhi, Bangalore"
              />
            </div>

            {/* Location Risk */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Risk Level *
              </label>
              <select
                name="locationRisk"
                value={formData.locationRisk}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              >
                <option value="low">Low (Stable weather area)</option>
                <option value="medium">Medium (Moderate disruptions)</option>
                <option value="high">High (Frequent disruptions)</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Higher risk areas have higher premiums but better coverage
              </p>
            </div>

            {/* UPI ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPI ID (Optional)
              </label>
              <input
                type="text"
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="yourname@paytm"
              />
              <p className="text-sm text-gray-500 mt-1">
                Default: {formData.phone}@paytm
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-red-600 text-white font-semibold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Registering...' : 'Register & Get Started'}
            </button>
          </form>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-4xl mb-3">⚡</div>
            <h4 className="font-semibold text-lg mb-2">Instant Payouts</h4>
            <p className="text-gray-600 text-sm">Get compensated in seconds via UPI</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-4xl mb-3">🤖</div>
            <h4 className="font-semibold text-lg mb-2">Zero Manual Claims</h4>
            <p className="text-gray-600 text-sm">AI automatically detects disruptions</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-4xl mb-3">🛡️</div>
            <h4 className="font-semibold text-lg mb-2">Smart Protection</h4>
            <p className="text-gray-600 text-sm">Dynamic premiums based on real-time data</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;