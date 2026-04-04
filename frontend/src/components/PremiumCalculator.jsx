import React, { useState, useEffect } from 'react';
import { calculatePremium, buyPolicy } from '../services/api';

const PremiumCalculator = ({ user, onPolicyCreated }) => {
  const [premiumData, setPremiumData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuying, setIsBuying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadPremium();
  }, [user]);

  const loadPremium = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await calculatePremium(user._id, user.city);
      if (response.success) {
        setPremiumData(response.data);
      }
    } catch (err) {
      setError('Failed to calculate premium');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyPolicy = async () => {
    setIsBuying(true);
    setError('');
    setSuccess('');

    try {
      const response = await buyPolicy({
        userId: user._id,
        premium: premiumData.totalPremium,
        coverageAmount: premiumData.coverageAmount,
        city: user.city
      });

      if (response.success) {
        setSuccess('Policy activated successfully! 🎉');
        setTimeout(() => {
          onPolicyCreated();
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to activate policy');
    } finally {
      setIsBuying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-secondary mb-2">Weekly Premium</h3>
      <p className="text-gray-600 mb-6">Dynamic pricing based on real-time conditions</p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {premiumData && (
        <>
          {/* Premium Breakdown */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Base Premium</span>
                <span className="font-semibold">₹{premiumData.breakdown.basePremium}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Location Risk</span>
                <span className="font-semibold text-orange-600">+₹{premiumData.breakdown.locationRiskPremium}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Weather Risk</span>
                <span className="font-semibold text-blue-600">+₹{premiumData.breakdown.weatherRiskPremium}</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-lg font-bold">Total Premium</span>
                <span className="text-2xl font-bold text-primary">₹{premiumData.totalPremium}</span>
              </div>
            </div>
          </div>

          {/* Weather Info */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Weather in {user.city}</p>
                <p className="text-lg font-semibold">{premiumData.weatherData.condition}</p>
                <p className="text-sm text-gray-500">Risk Score: {premiumData.weatherData.riskScore}%</p>
              </div>
              <div className="text-4xl">
                {premiumData.weatherData.temperature > 35 ? '🌡️' : 
                 premiumData.weatherData.condition === 'Rain' ? '🌧️' : '☀️'}
              </div>
            </div>
          </div>

          {/* Coverage Details */}
          <div className="bg-green-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Weekly Coverage</p>
                <p className="text-2xl font-bold text-green-600">₹{premiumData.coverageAmount}</p>
              </div>
              <div className="text-4xl">🛡️</div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Get up to 50% per claim during disruptions
            </p>
          </div>

          {/* Buy Button */}
          <button
            onClick={handleBuyPolicy}
            disabled={isBuying}
            className="w-full bg-primary hover:bg-red-600 text-white font-semibold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBuying ? 'Activating...' : 'Activate Weekly Policy'}
          </button>

          <p className="text-xs text-gray-500 text-center mt-3">
            Valid for 7 days from activation
          </p>
        </>
      )}
    </div>
  );
};

export default PremiumCalculator;