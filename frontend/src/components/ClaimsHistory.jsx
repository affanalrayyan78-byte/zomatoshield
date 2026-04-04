import React from 'react';

const ClaimsHistory = ({ claims }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDisruptionIcon = (type) => {
    switch (type) {
      case 'rain':
        return '🌧️';
      case 'heatwave':
        return '🌡️';
      case 'manual':
        return '🔧';
      default:
        return '📋';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-secondary mb-6">Claims History</h3>

      {claims.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-600 text-lg">No claims yet</p>
          <p className="text-gray-500 text-sm mt-2">
            Trigger a disruption to create your first claim
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div
              key={claim._id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{getDisruptionIcon(claim.disruptionType)}</div>
                  <div>
                    <p className="font-semibold text-lg capitalize">
                      {claim.disruptionType} Disruption
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(claim.triggeredAt)}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(claim.status)}`}>
                  {claim.status.toUpperCase()}
                </span>
              </div>

              {claim.weatherData && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-600">
                    Weather: {claim.weatherData.condition} • {claim.weatherData.temperature}°C
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Claim Amount</p>
                  <p className="text-2xl font-bold text-primary">₹{claim.amount}</p>
                </div>
                {claim.status === 'paid' && (
                  <div className="text-right">
                    <p className="text-sm text-green-600 font-semibold">✅ Paid</p>
                    <p className="text-xs text-gray-500">{claim.payoutTransactionId}</p>
                  </div>
                )}
                {claim.status === 'rejected' && (
                  <div className="text-right">
                    <p className="text-sm text-red-600 font-semibold">❌ Rejected</p>
                    <p className="text-xs text-gray-500">{claim.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {claims.length > 0 && (
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Payouts Received</p>
              <p className="text-2xl font-bold text-blue-600">
                ₹{claims.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0)}
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimsHistory;