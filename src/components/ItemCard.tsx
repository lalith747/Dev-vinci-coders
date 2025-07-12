import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Clock } from 'lucide-react';
import { ClothingItem } from '../contexts/DataContext';

interface ItemCardProps {
  item: ClothingItem;
  showOwner?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, showOwner = true }) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <Link to={`/item/${item.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
              {item.status.replace('_', ' ')}
            </span>
          </div>
          
          {/* Points */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <Heart className="h-3 w-3 text-emerald-600" />
            <span className="text-xs font-medium text-gray-900">{item.pointValue}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title and Category */}
          <div className="mb-2">
            <h3 className="font-medium text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500">{item.category} • {item.type}</p>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {item.description}
          </p>

          {/* Details */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded">Size {item.size}</span>
              <span className={`font-medium ${getConditionColor(item.condition)}`}>
                {item.condition}
              </span>
            </div>
          </div>

          {/* Owner and Location */}
          {showOwner && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {item.ownerAvatar ? (
                  <img
                    src={item.ownerAvatar}
                    alt={item.ownerName}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-6 w-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">
                      {item.ownerName[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-xs text-gray-600">{item.ownerName}</span>
              </div>
              
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                {item.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{item.location.split(',')[0]}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(item.createdAt)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {item.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{item.tags.length - 3} more</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ItemCard;