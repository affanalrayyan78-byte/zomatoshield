import React, { useState, useEffect } from 'react';
import PremiumCalculator from './PremiumCalculator';
import PolicyCard from './PolicyCard';
import ClaimsHistory from './ClaimsHistory';
import TriggerPanel from './TriggerPanel';
import { getUserPolicies, getUserClaims } from '../services/api';

const Dashboard = ({ user }) => {
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [activePolicy, setActivePolicy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadData();
  }, [user._id, refreshKey]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [policiesRes, claimsRes] = await Promise.all([
        getUserPolicies(user._id),
        getUserClaims(user._id)
      ]);

      if (policiesRes.success) {
        setPolicies(policiesRes.data);
        const active = policiesRes.data.find(p => p.status === 'active');
        setActivePolicy(active || null);
      }

      if (claimsRes.success) {
        setClaims(claimsRes.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-secondary mb-2">
              Welcome back, {user.name}! 👋
            </h2>
            <p className="text-gray-600">
              📍 {user.city} • Risk Level: <span className="font-semibold capitalize">{user.locationRisk}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              UPI: {user.upiId || `${user.phone}@paytm`}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="text-sm font-medium opacity-90">Active Policies</div>
          <div className="text-4xl font-bold mt-2">{policies.filter(p => p.status === 'active').length}</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <div className="text-sm font-medium opacity-90">Total Claims</div>
          <div className="text-4xl font-bold mt-2">{claims.length}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <div className="text-sm font-medium opacity-90">Amount Received</div>
          <div className="text-4xl font-bold mt-2">
            ₹{claims.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0)}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {!activePolicy ? (
            <PremiumCalculator user={user} onPolicyCreated={handleRefresh} />
          ) : (
            <>
              <PolicyCard policy={activePolicy} />
              <TriggerPanel user={user} onClaimTriggered={handleRefresh} />
            </>
          )}
        </div>

        {/* Right Column */}
        <div>
          <ClaimsHistory claims={claims} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;