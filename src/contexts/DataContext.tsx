import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ClothingItem {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  title: string;
  description: string;
  category: string;
  type: string;
  size: string;
  condition: string;
  pointValue: number;
  status: 'available' | 'pending_swap' | 'redeemed' | 'pending_approval' | 'rejected';
  images: string[];
  imageUrl?: string; // Add imageUrl for easier access to the primary image
  tags: string[];
  createdAt: string;
  updatedAt: string;
  location?: string;
}

export interface SwapRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requestedItemId: string;
  offeredItemId?: string;
  offeredItemTitle?: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface PointTransaction {
  id: string;
  userId: string;
  itemId?: string;
  pointsAmount: number;
  transactionType: 'earned' | 'spent' | 'bonus' | 'refund' | 'penalty';
  description: string;
  transactionDate: string;
}

interface DataContextType {
  items: ClothingItem[];
  swapRequests: SwapRequest[];
  pointTransactions: PointTransaction[];
  categories: string[];
  addItem: (item: Omit<ClothingItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, updates: Partial<ClothingItem>) => void;
  deleteItem: (id: string) => void;
  createSwapRequest: (request: Omit<SwapRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSwapRequest: (id: string, updates: Partial<SwapRequest>) => void;
  redeemItem: (itemId: string, userId: string) => boolean;
  addPointTransaction: (transaction: Omit<PointTransaction, 'id'>) => void;
  getItemsByUser: (userId: string) => ClothingItem[];
  getSwapRequestsByUser: (userId: string) => SwapRequest[];
  searchItems: (query: string, filters?: any) => ClothingItem[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [pointTransactions, setPointTransactions] = useState<PointTransaction[]>([]);

  const categories = [
    'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Activewear', 'Formal'
  ];

  // Initialize with mock data
  useEffect(() => {
    const mockItems: ClothingItem[] = [
      {
        id: '1',
        ownerId: '1',
        ownerName: 'alice_green',
        ownerAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150&h=150&fit=crop',
        title: 'Vintage Denim Jacket',
        description: 'Beautiful vintage denim jacket in excellent condition. Perfect for layering and has that worn-in comfort that only gets better with time.',
        category: 'Outerwear',
        type: 'Jacket',
        size: 'M',
        condition: 'Good',
        pointValue: 45,
        status: 'available',
        images: [
          'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?w=400&h=400&fit=crop',
          'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?w=400&h=400&fit=crop'
        ],
        imageUrl: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?w=400&h=400&fit=crop', // First image as imageUrl
        tags: ['vintage', 'denim', 'casual'],
        createdAt: '2024-01-20T10:30:00Z',
        updatedAt: '2024-01-20T10:30:00Z',
        location: 'San Francisco, CA'
      },
      {
        id: '2',
        ownerId: '2',
        ownerName: 'bob_swap',
        ownerAvatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=150&h=150&fit=crop',
        title: 'Floral Summer Dress',
        description: 'Light and airy summer dress with beautiful floral pattern. Perfect for warm weather and special occasions.',
        category: 'Dresses',
        type: 'Casual Dress',
        size: 'S',
        condition: 'Like New',
        pointValue: 35,
        status: 'available',
        images: [
          'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?w=400&h=400&fit=crop'
        ],
        imageUrl: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?w=400&h=400&fit=crop', // First image as imageUrl
        tags: ['floral', 'summer', 'feminine'],
        createdAt: '2024-01-22T14:15:00Z',
        updatedAt: '2024-01-22T14:15:00Z',
        location: 'New York, NY'
      },
      {
        id: '3',
        ownerId: '1',
        ownerName: 'alice_green',
        ownerAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150&h=150&fit=crop',
        title: 'Classic White Sneakers',
        description: 'Clean, minimalist white sneakers that go with everything. Barely worn and in excellent condition.',
        category: 'Shoes',
        type: 'Sneakers',
        size: '8',
        condition: 'Excellent',
        pointValue: 50,
        status: 'available',
        images: [
          'https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?w=400&h=400&fit=crop'
        ],
        imageUrl: 'https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?w=400&h=400&fit=crop', // First image as imageUrl
        tags: ['white', 'sneakers', 'minimalist'],
        createdAt: '2024-01-23T09:20:00Z',
        updatedAt: '2024-01-23T09:20:00Z',
        location: 'San Francisco, CA'
      },
      {
        id: '4',
        ownerId: '2',
        ownerName: 'bob_swap',
        ownerAvatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=150&h=150&fit=crop',
        title: 'Wool Blend Sweater',
        description: 'Cozy wool blend sweater in a beautiful heather gray. Perfect for chilly days and professional settings.',
        category: 'Tops',
        type: 'Sweater',
        size: 'L',
        condition: 'Good',
        pointValue: 40,
        status: 'available',
        images: [
          'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?w=400&h=400&fit=crop'
        ],
        imageUrl: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?w=400&h=400&fit=crop', // First image as imageUrl
        tags: ['wool', 'cozy', 'professional'],
        createdAt: '2024-01-24T11:45:00Z',
        updatedAt: '2024-01-24T11:45:00Z',
        location: 'New York, NY'
      },
      {
        id: '5',
        ownerId: '1',
        ownerName: 'alice_green',
        ownerAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150&h=150&fit=crop',
        title: 'Designer Handbag',
        description: 'Authentic designer handbag in pristine condition. Features multiple compartments and adjustable strap.',
        category: 'Accessories',
        type: 'Handbag',
        size: 'One Size',
        condition: 'Like New',
        pointValue: 80,
        status: 'available',
        images: [
          'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?w=400&h=400&fit=crop'
        ],
        imageUrl: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?w=400&h=400&fit=crop', // First image as imageUrl
        tags: ['designer', 'luxury', 'handbag'],
        createdAt: '2024-01-25T16:00:00Z',
        updatedAt: '2024-01-25T16:00:00Z',
        location: 'San Francisco, CA'
      }
    ];
    
    setItems(mockItems.map(item => ({
      ...item,
      imageUrl: item.images.length > 0 ? item.images[0] : undefined
    })));
  }, []);

  const addItem = (item: Omit<ClothingItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: ClothingItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setItems(prev => [newItem, ...prev]);
  };

  const updateItem = (id: string, updates: Partial<ClothingItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...updates, updatedAt: new Date().toISOString() }
        : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const createSwapRequest = (request: Omit<SwapRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRequest: SwapRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSwapRequests(prev => [newRequest, ...prev]);
    
    // Update item status to pending_swap
    updateItem(request.requestedItemId, { status: 'pending_swap' });
  };

  const updateSwapRequest = (id: string, updates: Partial<SwapRequest>) => {
    setSwapRequests(prev => prev.map(request => 
      request.id === id 
        ? { ...request, ...updates, updatedAt: new Date().toISOString() }
        : request
    ));
    
    // Handle status changes
    const request = swapRequests.find(r => r.id === id);
    if (request && updates.status) {
      if (updates.status === 'accepted') {
        updateItem(request.requestedItemId, { status: 'redeemed' });
        if (request.offeredItemId) {
          updateItem(request.offeredItemId, { status: 'redeemed' });
        }
      } else if (updates.status === 'rejected' || updates.status === 'cancelled') {
        updateItem(request.requestedItemId, { status: 'available' });
      }
    }
  };

  const redeemItem = (itemId: string, userId: string): boolean => {
    const item = items.find(i => i.id === itemId);
    if (!item || item.status !== 'available') return false;
    
    updateItem(itemId, { status: 'redeemed' });
    
    // Add point transaction
    addPointTransaction({
      userId,
      itemId,
      pointsAmount: -item.pointValue,
      transactionType: 'spent',
      description: `Redeemed: ${item.title}`,
      transactionDate: new Date().toISOString()
    });
    
    return true;
  };

  const addPointTransaction = (transaction: Omit<PointTransaction, 'id'>) => {
    const newTransaction: PointTransaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setPointTransactions(prev => [newTransaction, ...prev]);
  };

  const getItemsByUser = (userId: string) => {
    return items.filter(item => item.ownerId === userId);
  };

  const getSwapRequestsByUser = (userId: string) => {
    return swapRequests.filter(request => 
      request.requesterId === userId || 
      items.find(item => item.id === request.requestedItemId)?.ownerId === userId
    );
  };

  const searchItems = (query: string, filters?: any) => {
    let filteredItems = items.filter(item => item.status === 'available');
    
    if (query) {
      filteredItems = filteredItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }
    
    if (filters?.category && filters.category !== 'all') {
      filteredItems = filteredItems.filter(item => 
        item.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    if (filters?.size && filters.size !== 'all') {
      filteredItems = filteredItems.filter(item => item.size === filters.size);
    }
    
    if (filters?.condition && filters.condition !== 'all') {
      filteredItems = filteredItems.filter(item => item.condition === filters.condition);
    }
    
    return filteredItems;
  };

  const value = {
    items,
    swapRequests,
    pointTransactions,
    categories,
    addItem,
    updateItem,
    deleteItem,
    createSwapRequest,
    updateSwapRequest,
    redeemItem,
    addPointTransaction,
    getItemsByUser,
    getSwapRequestsByUser,
    searchItems
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};