import React, { useState } from 'react';
import { User, Ban, CheckCircle, XCircle, Gift, MessageCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData, ClothingItem } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';

// Mock data will be replaced with actual context data
// Removed mockUsers, mockItems, mockListings, mockSpam, mockChats as they will be fetched from contexts.

const TABS = [
  'Manage Users',
  'Manage Items',
  'Moderate Listings',
  'Adjust Points',
  'Point Transactions', // New tab for auditing
  'Remove Spam',
  'Chat',
];

const AdminPanel: React.FC = () => {
  const { user, getAllUsers, updateUserStatus, adminAdjustUserPoints } = useAuth();
  const { items, updateItem, pointTransactions, addPointTransaction } = useData();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [reason, setReason] = useState('');
  const [chatUser, setChatUser] = useState('');
  const [chatMsg, setChatMsg] = useState('');
  const [selectedUserForPoints, setSelectedUserForPoints] = useState('');
  const [pointsAmount, setPointsAmount] = useState(0);
  const [pointReason, setPointReason] = useState('');
  const [itemFilterStatus, setItemFilterStatus] = useState('all');

  const allUsers = getAllUsers();

  const pendingItems = items.filter(item => item.status === 'pending_approval');

  const handleApproveItem = (itemId: string) => {
    updateItem(itemId, { status: 'available' });
    alert('Item approved!');
  };

  const handleRejectItem = (itemId: string) => {
    if (!reason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }
    updateItem(itemId, { status: 'rejected', description: `Rejected: ${reason}` }); // Optionally add reason to description or a new field
    alert('Item rejected!');
    setReason('');
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-2 text-red-600">Access Denied</h2>
          <p className="mb-4">You do not have permission to access this page.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-emerald-600 text-white px-4 py-2 rounded"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-emerald-700 flex items-center gap-2">
          <User className="h-8 w-8" /> Admin Panel
        </h1>
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          {TABS.map((t, i) => (
            <button
              key={t}
              className={`py-2 px-4 font-medium border-b-2 transition-all ${tab === i ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-emerald-600'}`}
              onClick={() => setTab(i)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
            <table className="w-full mb-4">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2">Username</th>
                  <th>Email</th>
                  <th>Points</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map(u => (
                  <tr key={u.id} className="border-b">
                    <td className="py-2">{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.points}</td>
                    <td>{u.isAdmin ? 'Admin' : 'User'}</td>
                    <td>{u.status || 'active'}</td> {/* Assuming status can be added to User interface */}
                    <td className="flex gap-2">
                      <button
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                        title="Suspend/Ban"
                        onClick={() => updateUserStatus(u.id, u.status === 'banned' ? 'active' : 'banned')}
                      >
                        <Ban className="h-5 w-5" />
                      </button>
                      <button
                        className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                        title="Adjust Points"
                        onClick={() => setSelectedUserForPoints(u.id)}
                      >
                        <Gift className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {tab === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Manage Items</h2>
            <div className="mb-2">
              <label className="mr-2 font-medium">Filter by status:</label>
              <select
                className="border rounded px-2 py-1"
                value={itemFilterStatus}
                onChange={(e) => setItemFilterStatus(e.target.value)}
              >
                <option value="all">All</option>
                <option value="available">Available</option>
                <option value="pending_swap">Pending Swap</option>
                <option value="redeemed">Redeemed</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2">Image</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Owner</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Point Value</th>
                </tr>
              </thead>
              <tbody>
                {items.filter(item => itemFilterStatus === 'all' || item.status === itemFilterStatus).map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded" />
                      )}
                    </td>
                    <td>{item.title}</td>
                    <td>{item.description}</td>
                    <td>{item.ownerName}</td>
                    <td>{item.category}</td>
                    <td>{item.status}</td>
                    <td>{item.pointValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {tab === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Moderate Listings</h2>
            {pendingItems.length === 0 ? (
              <p className="text-gray-500">No items pending approval.</p>
            ) : (
              <table className="w-full mb-4">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="py-2">Title</th>
                    <th>Owner</th>
                    <th>Category</th>
                    <th>Point Value</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingItems.map((item: ClothingItem) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2">{item.title}</td>
                      <td>{item.ownerName}</td>
                      <td>{item.category}</td>
                      <td>{item.pointValue}</td>
                      <td className="flex gap-2">
                        <button
                          className="p-1 text-green-600 hover:bg-emerald-50 rounded"
                          title="Approve"
                          onClick={() => handleApproveItem(item.id)}
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <button
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                          title="Reject"
                          onClick={() => handleRejectItem(item.id)}
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mt-2">
              <label htmlFor="rejectionReason" className="font-medium mr-2">Rejection Reason:</label>
              <input
                id="rejectionReason"
                type="text"
                className="border rounded px-2 py-1 w-64"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Enter reason for rejection..."
              />
            </div>
          </div>
        )}
        {tab === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Adjust Points</h2>
            <div className="flex gap-4 items-center mb-4">
              <select
                className="border rounded px-2 py-1"
                value={selectedUserForPoints}
                onChange={e => setSelectedUserForPoints(e.target.value)}
              >
                <option value="">Select User</option>
                {allUsers.map(u => (
                  <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
                ))}
              </select>
              <input
                type="number"
                className="border rounded px-2 py-1 w-24"
                placeholder="Points"
                value={pointsAmount}
                onChange={e => setPointsAmount(parseInt(e.target.value))}
              />
              <input
                type="text"
                className="border rounded px-2 py-1 w-64"
                placeholder="Reason (e.g., 'Bonus', 'Penalty')"
                value={pointReason}
                onChange={e => setPointReason(e.target.value)}
              />
              <button
                className="bg-emerald-600 text-white px-4 py-2 rounded flex items-center gap-1"
                onClick={() => {
                  if (selectedUserForPoints && pointsAmount !== 0 && pointReason.trim()) {
                    adminAdjustUserPoints(selectedUserForPoints, pointsAmount, pointReason);
                    addPointTransaction({
                      userId: selectedUserForPoints,
                      pointsAmount: pointsAmount,
                      transactionType: pointsAmount > 0 ? 'bonus' : 'penalty',
                      description: pointReason,
                      transactionDate: new Date().toISOString()
                    });
                    alert('Points adjusted!');
                    setSelectedUserForPoints('');
                    setPointsAmount(0);
                    setPointReason('');
                  } else {
                    alert('Please select a user, enter a point amount, and provide a reason.');
                  }
                }}
              >
                <Gift className="h-5 w-5" />Adjust
              </button>
            </div>
            <p className="text-gray-500 text-sm">Give bonus points or correct user balances.</p>
          </div>
        )}
        {tab === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Point Transactions</h2>
            <table className="w-full mb-4">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2">User</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {pointTransactions.map(transaction => (
                  <tr key={transaction.id} className="border-b">
                    <td className="py-2">{allUsers.find(u => u.id === transaction.userId)?.username || 'N/A'}</td>
                    <td>{transaction.pointsAmount}</td>
                    <td>{transaction.transactionType}</td>
                    <td>{transaction.description}</td>
                    <td>{new Date(transaction.transactionDate).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {tab === 5 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Remove Spam/Inappropriate Content</h2>
            <table className="w-full mb-4">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2">Content</th>
                  <th>User</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* This section would ideally fetch reported content */}
                <tr>
                  <td className="py-2">No spam to display.</td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {tab === 6 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Chat: Message Users</h2>
            <div className="flex gap-4 mb-4">
              <select className="border rounded px-2 py-1" value={chatUser} onChange={e => setChatUser(e.target.value)}>
                <option value="">Select User</option>
                {allUsers.map(u => (
                  <option key={u.id} value={u.id}>{u.username}</option>
                ))}
              </select>
              <input type="text" className="border rounded px-2 py-1 w-64" placeholder="Type your message..." value={chatMsg} onChange={e => setChatMsg(e.target.value)} />
              <button className="bg-emerald-600 text-white px-4 py-2 rounded flex items-center gap-1"><MessageCircle className="h-5 w-5" />Send</button>
            </div>
            <div className="bg-gray-50 rounded p-4">
              <h4 className="font-medium mb-2">Recent Chats</h4>
              <ul className="space-y-2">
                {/* This would display actual chat logs */}
                <li>No recent chats to display.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;