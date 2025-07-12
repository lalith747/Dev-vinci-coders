import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Heart, Package, RefreshCw, Plus, MapPin, Calendar, User, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import ItemCard from '../components/ItemCard';

const Dashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { getItemsByUser, getSwapRequestsByUser, pointTransactions } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    username: user?.username || '',
    location: user?.location || ''
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Please log in</h2>
          <Link to="/login" className="text-emerald-600 hover:text-emerald-500">
            Go to login page
          </Link>
        </div>
      </div>
    );
  }

  const userItems = getItemsByUser(user.id);
  const userSwaps = getSwapRequestsByUser(user.id);
  const userTransactions = pointTransactions.filter(t => t.userId === user.id);

  const handleSaveProfile = () => {
    updateUser(editData);
    setEditMode(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'items', label: 'My Items', icon: Package },
    { id: 'swaps', label: 'Swap Requests', icon: RefreshCw },
    { id: 'transactions', label: 'Transactions', icon: Heart }
  ];

  const stats = [
    {
      label: 'Items Listed',
      value: userItems.length,
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      label: 'Active Swaps',
      value: userSwaps.filter(s => s.status === 'pending').length,
      icon: RefreshCw,
      color: 'bg-yellow-500'
    },
    {
      label: 'Points Balance',
      value: user.points,
      icon: Heart,
      color: 'bg-emerald-500'
    },
    {
      label: 'Completed Swaps',
      value: userSwaps.filter(s => s.status === 'accepted').length,
      icon: RefreshCw,
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 bg-emerald-500 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
              )}
              <div>
                {editMode ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editData.username}
                      onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                      className="text-2xl font-bold border border-gray-300 rounded px-2 py-1"
                    />
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Location"
                      className="text-gray-600 border border-gray-300 rounded px-2 py-1 w-full"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                    {user.location && (
                      <div className="flex items-center space-x-1 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1 text-gray-500 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {editMode ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                  <Link
                    to="/add-item"
                    className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>List Item</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  {userTransactions.length > 0 ? (
                    <div className="space-y-3">
                      {userTransactions.slice(0, 5).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.transactionDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`text-sm font-medium ${
                            transaction.pointsAmount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.pointsAmount > 0 ? '+' : ''}{transaction.pointsAmount} pts
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No recent activity</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'items' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Listed Items</h3>
                  <Link
                    to="/add-item"
                    className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add New Item</span>
                  </Link>
                </div>
                {userItems.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userItems.map(item => (
                      <ItemCard key={item.id} item={item} showOwner={false} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">You haven't listed any items yet</p>
                    <Link
                      to="/add-item"
                      className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      List Your First Item
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'swaps' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Swap Requests</h3>
                {userSwaps.length > 0 ? (
                  <div className="space-y-4">
                    {userSwaps.map((swap) => (
                      <div key={swap.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {swap.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(swap.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 mb-1">Request from {swap.requesterName}</p>
                        {swap.message && (
                          <p className="text-sm text-gray-600">"{swap.message}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No swap requests yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'transactions' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Point Transactions</h3>
                {userTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {userTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.transactionDate).toLocaleDateString()} • {transaction.transactionType}
                          </p>
                        </div>
                        <span className={`text-lg font-semibold ${
                          transaction.pointsAmount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.pointsAmount > 0 ? '+' : ''}{transaction.pointsAmount}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No transactions yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;