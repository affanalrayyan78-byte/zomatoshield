import React from 'react';

const PolicyCard = ({ policy }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysRemaining = () => {
    const end = new Date(policy.endDate);
    const now = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <div className="bg-gradient-to-br from-primary to-red-600 text-white rounded-2xl shadow-xl p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">Active Policy 🛡️</h3>
          <p className="opacity-90">Status: {policy.status.toUpperCase()}</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
          <p className="text-sm font-medium">Coverage</p>
          <p className="text-2xl font-bold">₹{policy.coverageAmount}</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="opacity-90">Premium Paid</span>
          <span className="font-bold text-lg">₹{policy.premium}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="opacity-90">Valid From</span>
          <span className="font-semibold">{formatDate(policy.startDate)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="opacity-90">Valid Until</span>
          <span className="font-semibold">{formatDate(policy.endDate)}</span>
        </div>
      </div>

      <div className="bg-white bg-opacity-20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Days Remaining</p>
            <p className="text-3xl font-bold">{getDaysRemaining()}</p>
          </div>
          <div className="text-5xl">
            {getDaysRemaining() > 3 ? '✅' : '⏰'}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white bg-opacity-10 rounded-lg p-4">
        <p className="text-sm font-medium mb-2">Premium Breakdown</p>
        <div className="space-y-1 text-sm opacity-90">
          <div className="flex justify-between">
            <span>Base</span>
            <span>₹{policy.premiumBreakdown?.basePremium || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Location Risk</span>
            <span>₹{policy.premiumBreakdown?.locationRiskPremium || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Weather Risk</span>
            <span>₹{policy.premiumBreakdown?.weatherRiskPremium || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyCard;