import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Recycle, Search, User, Heart, LogOut, Settings, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-emerald-500 rounded-lg group-hover:bg-emerald-600 transition-colors">
              <Recycle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ReWear</h1>
              <p className="text-xs text-gray-500">Sustainable Fashion</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/browse"
              className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                isActive('/browse') ? 'text-emerald-600' : 'text-gray-700'
              }`}
            >
              Browse Items
            </Link>
            {user && (
              <>
                <Link
                  to="/add-item"
                  className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                    isActive('/add-item') ? 'text-emerald-600' : 'text-gray-700'
                  }`}
                >
                  List Item
                </Link>
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                    isActive('/dashboard') ? 'text-emerald-600' : 'text-gray-700'
                  }`}
                >
                  Dashboard
                </Link>
              </>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Points Display */}
                <div className="hidden sm:flex items-center space-x-2 bg-emerald-50 px-3 py-1 rounded-full">
                  <Heart className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">{user.points} pts</span>
                </div>

                {/* Add Item Button */}
                <Link
                  to="/add-item"
                  className="hidden sm:flex items-center space-x-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-sm font-medium">List Item</span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {user.username}
                    </span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      {user.isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && (
        <div className="md:hidden border-t border-gray-200 bg-gray-50">
          <div className="flex justify-around py-2">
            <Link
              to="/browse"
              className={`flex flex-col items-center py-2 px-4 text-xs ${
                isActive('/browse') ? 'text-emerald-600' : 'text-gray-600'
              }`}
            >
              <Search className="h-5 w-5 mb-1" />
              Browse
            </Link>
            <Link
              to="/add-item"
              className={`flex flex-col items-center py-2 px-4 text-xs ${
                isActive('/add-item') ? 'text-emerald-600' : 'text-gray-600'
              }`}
            >
              <Plus className="h-5 w-5 mb-1" />
              List
            </Link>
            <Link
              to="/dashboard"
              className={`flex flex-col items-center py-2 px-4 text-xs ${
                isActive('/dashboard') ? 'text-emerald-600' : 'text-gray-600'
              }`}
            >
              <User className="h-5 w-5 mb-1" />
              Profile
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;