import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoyaltyPoints = () => {
  const { user } = useAuth();

  const getTierColor = (tier) => {
    switch (tier) {
      case 'platinum':
        return 'bg-gradient-to-r from-gray-400 to-gray-600';
      case 'gold':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 'silver':
        return 'bg-gradient-to-r from-gray-300 to-gray-400';
      default:
        return 'bg-gradient-to-r from-yellow-700 to-yellow-900';
    }
  };

  const getNextTier = () => {
    switch (user.loyaltyTier) {
      case 'bronze':
        return { tier: 'Silver', points: 1000 - user.totalSpent };
      case 'silver':
        return { tier: 'Gold', points: 5000 - user.totalSpent };
      case 'gold':
        return { tier: 'Platinum', points: 10000 - user.totalSpent };
      default:
        return null;
    }
  };

  const nextTier = getNextTier();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Loyalty Program</h2>
        <div className={`px-4 py-2 rounded-full text-white ${getTierColor(user.loyaltyTier)}`}>
          {user.loyaltyTier.charAt(0).toUpperCase() + user.loyaltyTier.slice(1)} Tier
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">Total Points</div>
          <div className="text-2xl font-bold">{user.loyaltyPoints}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">Total Spent</div>
          <div className="text-2xl font-bold">${user.totalSpent.toFixed(2)}</div>
        </div>
      </div>

      {nextTier && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600">
            {nextTier.points > 0 ? (
              <>
                Spend ${nextTier.points.toFixed(2)} more to reach {nextTier.tier} Tier
              </>
            ) : (
              <>You've reached the highest tier!</>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  ((user.totalSpent / (user.totalSpent + nextTier.points)) * 100)
                )}%`
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Tier Benefits</h3>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            {user.loyaltyTier === 'bronze' && '5% points on all purchases'}
            {user.loyaltyTier === 'silver' && '10% points on all purchases'}
            {user.loyaltyTier === 'gold' && '15% points on all purchases'}
            {user.loyaltyTier === 'platinum' && '20% points on all purchases'}
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            {user.loyaltyTier === 'bronze' && 'Basic customer support'}
            {user.loyaltyTier === 'silver' && 'Priority customer support'}
            {user.loyaltyTier === 'gold' && '24/7 dedicated support'}
            {user.loyaltyTier === 'platinum' && 'Personal shopping assistant'}
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            {user.loyaltyTier === 'bronze' && 'Standard delivery'}
            {user.loyaltyTier === 'silver' && 'Free standard delivery'}
            {user.loyaltyTier === 'gold' && 'Free express delivery'}
            {user.loyaltyTier === 'platinum' && 'Free same-day delivery'}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LoyaltyPoints; 