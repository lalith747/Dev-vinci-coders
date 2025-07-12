import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  points: number;
  location?: string;
  avatar?: string;
  isAdmin?: boolean;
  status?: 'active' | 'suspended' | 'banned'; // Added status for user management
  createdAt: string;
}


interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string, location?: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addPoints: (amount: number, reason: string) => void;
  // Admin functions
  getAllUsers: () => Promise<User[]>;
  updateUserStatus: (userId: string, status: 'active' | 'suspended' | 'banned') => Promise<void>;
  adminAdjustUserPoints: (userId: string, amount: number, reason: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock users data
  const API_BASE_URL = 'http://localhost:8000'; // Assuming backend runs on this port

  useEffect(() => {
    const storedUser = localStorage.getItem('rewear_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming the backend returns a user object and a token
        const loggedInUser: User = {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          points: data.user.points,
          location: data.user.location,
          avatar: data.user.avatar,
          isAdmin: data.user.isAdmin,
          createdAt: data.user.createdAt,
        };
        setUser(loggedInUser);
        localStorage.setItem('rewear_user', JSON.stringify(loggedInUser));
        localStorage.setItem('rewear_token', data.access_token); // Store token
        setIsLoading(false);
        return true;
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.detail);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Network error during login:', error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (username: string, email: string, password: string, location?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, location }),
      });

      if (response.ok) {
        const data = await response.json();
        const signedUpUser: User = {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          points: data.user.points,
          location: data.user.location,
          avatar: data.user.avatar,
          isAdmin: data.user.isAdmin,
          createdAt: data.user.createdAt,
        };
        setUser(signedUpUser);
        localStorage.setItem('rewear_user', JSON.stringify(signedUpUser));
        localStorage.setItem('rewear_token', data.access_token);
        setIsLoading(false);
        return true;
      } else {
        const errorData = await response.json();
        console.error('Signup failed:', errorData.detail);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Network error during signup:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rewear_user');
    localStorage.removeItem('rewear_token'); // Remove token on logout
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    setIsLoading(true);
    const token = localStorage.getItem('rewear_token');
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, { // Assuming an endpoint for user updates
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedUserData = await response.json();
        const updatedUser = { ...user, ...updatedUserData };
        setUser(updatedUser);
        localStorage.setItem('rewear_user', JSON.stringify(updatedUser));
      } else {
        const errorData = await response.json();
        console.error('Update user failed:', errorData.detail);
      }
    } catch (error) {
      console.error('Network error during user update:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addPoints = async (amount: number, reason: string) => {
    if (!user) return;
    setIsLoading(true);
    const token = localStorage.getItem('rewear_token');
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}/add_points`, { // Assuming an endpoint for adding points
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, reason }),
      });

      if (response.ok) {
        const updatedUserData = await response.json();
        const updatedUser = { ...user, points: updatedUserData.points };
        setUser(updatedUser);
        localStorage.setItem('rewear_user', JSON.stringify(updatedUser));
      } else {
        const errorData = await response.json();
        console.error('Add points failed:', errorData.detail);
      }
    } catch (error) {
      console.error('Network error during add points:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Admin functions - these will also need to be connected to the backend
  const getAllUsers = async (): Promise<User[]> => {
    setIsLoading(true);
    const token = localStorage.getItem('rewear_token');
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, { // Assuming an admin endpoint for all users
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const usersData = await response.json();
        setIsLoading(false);
        return usersData.map((u: User) => ({
          id: u.id,
          username: u.username,
          email: u.email,
          points: u.points,
          location: u.location,
          avatar: u.avatar,
          isAdmin: u.isAdmin,
          createdAt: u.createdAt,
          status: u.status,
        }));
      } else {
        const errorData = await response.json();
        console.error('Get all users failed:', errorData.detail);
        setIsLoading(false);
        return [];
      }
    } catch (error) {
      console.error('Network error during get all users:', error);
      setIsLoading(false);
      return [];
    }
  };

  const updateUserStatus = async (userId: string, status: 'active' | 'suspended' | 'banned') => {
    setIsLoading(true);
    const token = localStorage.getItem('rewear_token');
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        // Optionally refresh user list or update local state
        console.log(`User ${userId} status updated to ${status}`);
      } else {
        const errorData = await response.json();
        console.error('Update user status failed:', errorData.detail);
      }
    } catch (error) {
      console.error('Network error during update user status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const adminAdjustUserPoints = async (userId: string, amount: number, reason: string) => {
    setIsLoading(true);
    const token = localStorage.getItem('rewear_token');
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/adjust_points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, reason }),
      });

      if (response.ok) {
        console.log(`User ${userId} points adjusted by ${amount}`);
      } else {
        const errorData = await response.json();
        console.error('Admin adjust points failed:', errorData.detail);
      }
    } catch (error) {
      console.error('Network error during admin adjust points:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    addPoints,
    getAllUsers,
    updateUserStatus,
    adminAdjustUserPoints
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};