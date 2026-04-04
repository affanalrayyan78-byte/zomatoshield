import React, { useState } from 'react';
import { triggerClaim } from '../services/api';

const TriggerPanel = ({ user, onClaimTriggered }) => {
  const [selectedDisruption, setSelectedDisruption] = useState(null);
  const [isTriggering, setIsTriggering] = useState(false);
  const [result, setResult] = useState(null);

  const disruptions = [
    {
      type: 'rain',
      label: 'Rain Detected',
      icon: '🌧️',
      description: 'Heavy rain affecting deliveries',
      color: 'blue'
    },
    {
      type: 'heatwave',
      label: 'Heatwave',
      icon: '🌡️',
      description: 'Extreme heat conditions',
      color: 'orange'
    },
    {
      type: 'manual',
      label: 'Manual Trigger',
      icon: '🔧',
      description: 'Other disruptions',
      color: 'purple'
    }
  ];

  const handleTrigger = async (type) => {
    setIsTriggering(true);
    setResult(null);
    setSelectedDisruption(type);

    try {
      const response = await triggerClaim(user._id, type);
      
      if (response.success) {
        setResult({
          success: true,
          data: response.data,
          message: response.message
        });

        // Refresh after 3 seconds
        setTimeout(() => {
          onClaimTriggered();
          setResult(null);
          setSelectedDisruption(null);
        }, 3000);
      }
    } catch (err) {
      setResult({
        success: false,
        message: err.response?.data?.message || 'Failed to trigger claim'
      });
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-secondary mb-2">Trigger Disruption</h3>
      <p className="text-gray-600 mb-6">Simulate or report a disruption event</p>

      {result && (
        <div className={`${result.success ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'} border px-4 py-3 rounded-lg mb-6`}>
          <p className="font-semibold mb-2">{result.message}</p>
          {result.success && result.data && (
            <div className="text-sm space-y-1">
              <p>Amount: ₹{result.data.amount}</p>
              <p>Status: {result.data.status}</p>
              {result.data.status === 'paid' && (
                <p className="font-bold mt-2">💰 Payment initiated to your UPI!</p>
              )}
              {result.data.status === 'rejected' && (
                <p className="text-red-600 mt-2">❌ {result.data.rejectionReason}</p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        {disruptions.map((disruption) => (
          <button
            key={disruption.type}
            onClick={() => handleTrigger(disruption.type)}
            disabled={isTriggering}
            className={`w-full bg-${disruption.color}-50 hover:bg-${disruption.color}-100 border-2 border-${disruption.color}-200 rounded-xl p-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedDisruption === disruption.type ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{disruption.icon}</div>
                <div className="text-left">
                  <p className="font-semibold text-lg">{disruption.label}</p>
                  <p className="text-sm text-gray-600">{disruption.description}</p>
                </div>
              </div>
              {isTriggering && selectedDisruption === disruption.type ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              ) : (
                <span className="text-2xl">→</span>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>ℹ️ How it works:</strong> When you trigger a disruption, our AI checks real-time weather data. 
          If conditions match, your claim is auto-approved and payout is instant!
        </p>
      </div>
    </div>
  );
};

export default TriggerPanel;