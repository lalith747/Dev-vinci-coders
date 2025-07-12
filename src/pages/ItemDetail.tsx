import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  MapPin, 
  Calendar, 
  User, 
  RefreshCw, 
  ShoppingBag,
  Star,
  MessageCircle,
  Share2,
  Flag
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, createSwapRequest, redeemItem, getItemsByUser } = useData();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapMessage, setSwapMessage] = useState('');
  const [selectedSwapItem, setSelectedSwapItem] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);

  const item = items.find(i => i.id === id);
  const userItems = user ? getItemsByUser(user.id).filter(i => i.status === 'available') : [];
  const relatedItems = items.filter(i => 
    i.id !== id && 
    i.status === 'available' && 
    i.category === item?.category
  ).slice(0, 4);

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Item not found</h2>
          <Link to="/browse" className="text-emerald-600 hover:text-emerald-500">
            Browse other items
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'pending_swap':
        return 'bg-yellow-100 text-yellow-800';
      case 'redeemed':
        return 'bg-gray-100 text-gray-800';
      case 'pending_approval':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Like New':
        return 'text-green-600';
      case 'Excellent':
        return 'text-emerald-600';
      case 'Good':
        return 'text-blue-600';
      case 'Fair':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleSwapRequest = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!selectedSwapItem && !swapMessage.trim()) {
      alert('Please select an item to offer or add a message');
      return;
    }

    createSwapRequest({
      requesterId: user.id,
      requesterName: user.username,
      requestedItemId: item.id,
      offeredItemId: selectedSwapItem || undefined,
      offeredItemTitle: selectedSwapItem ? userItems.find(i => i.id === selectedSwapItem)?.title : undefined,
      message: swapMessage,
      status: 'pending'
    });

    setShowSwapModal(false);
    setSwapMessage('');
    setSelectedSwapItem('');
    alert('Swap request sent successfully!');
  };

  const handleRedeem = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.points < item.pointValue) {
      alert('Insufficient points to redeem this item');
      return;
    }

    setIsRedeeming(true);
    const success = redeemItem(item.id, user.id);
    
    if (success) {
      alert('Item redeemed successfully!');
      navigate('/dashboard');
    } else {
      alert('Failed to redeem item. Please try again.');
    }
    
    setIsRedeeming(false);
  };

  const canInteract = user && user.id !== item.ownerId && item.status === 'available';
  const hasEnoughPoints = user && user.points >= item.pointValue;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
              <img
                src={item.images[selectedImage]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-emerald-500 ring-2 ring-emerald-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
                  <p className="text-lg text-gray-600">{item.category} • {item.type}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="h-6 w-6" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Share2 className="h-6 w-6" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Flag className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Status and Points */}
              <div className="flex items-center space-x-4 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                  {item.status.replace('_', ' ')}
                </span>
                <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1 rounded-full">
                  <Heart className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">{item.pointValue} points</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{item.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Size</h4>
                <p className="text-lg font-medium text-gray-900">{item.size}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Condition</h4>
                <p className={`text-lg font-medium ${getConditionColor(item.condition)}`}>
                  {item.condition}
                </p>
              </div>
            </div>

            {/* Tags */}
            {item.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Owner Info */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Listed by</h4>
              <div className="flex items-center space-x-3">
                {item.ownerAvatar ? (
                  <img
                    src={item.ownerAvatar}
                    alt={item.ownerName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 bg-emerald-500 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{item.ownerName}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {item.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{item.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Listed {new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {canInteract && (
              <div className="space-y-3">
                <button
                  onClick={() => setShowSwapModal(true)}
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                >
                  <RefreshCw className="h-5 w-5" />
                  <span>Request Swap</span>
                </button>
                
                <button
                  onClick={handleRedeem}
                  disabled={!hasEnoughPoints || isRedeeming}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-medium transition-colors ${
                    hasEnoughPoints && !isRedeeming
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>
                    {isRedeeming ? 'Redeeming...' : 
                     !hasEnoughPoints ? `Need ${item.pointValue - (user?.points || 0)} more points` : 
                     'Redeem with Points'}
                  </span>
                </button>
              </div>
            )}

            {!user && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <p className="text-blue-800 mb-4">Sign in to interact with this item</p>
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">More Like This</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedItems.map(relatedItem => (
                <Link
                  key={relatedItem.id}
                  to={`/item/${relatedItem.id}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={relatedItem.images[0]}
                      alt={relatedItem.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 line-clamp-1">{relatedItem.title}</h3>
                    <p className="text-sm text-gray-500">{relatedItem.category}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">Size {relatedItem.size}</span>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3 text-emerald-600" />
                        <span className="text-sm font-medium">{relatedItem.pointValue}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Swap Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Request Swap</h3>
              
              {/* Select Item to Offer */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select item to offer (optional)
                </label>
                <select
                  value={selectedSwapItem}
                  onChange={(e) => setSelectedSwapItem(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">No item to offer</option>
                  {userItems.map(userItem => (
                    <option key={userItem.id} value={userItem.id}>
                      {userItem.title} ({userItem.pointValue} pts)
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message to owner
                </label>
                <textarea
                  value={swapMessage}
                  onChange={(e) => setSwapMessage(e.target.value)}
                  placeholder="Tell the owner why you'd like this item..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSwapModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSwapRequest}
                  className="flex-1 py-2 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;