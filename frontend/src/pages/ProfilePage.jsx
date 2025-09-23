import React, { useState } from 'react';
import { userStore } from '../storeData/userStore';
import UpdateProfile from '../components/user/UpdateProfile';
import DeleteAccount from '../components/user/DeleteAccount';
import BookingHistory from '../components/user/BookingHistory';
import UpcomingBookings from '../components/user/UpcomingBookings';

const Profile = () => {
  const { user, logout } = userStore();
  const [activeTab, setActiveTab] = useState('view');
  const [message, setMessage] = useState('');

  // Mock booking data - replace with actual data from your booking store
  const mockBookings = [
    {
      _id: '1',
      className: 'Morning Yoga',
      date: '2025-09-25',
      time: '08:00',
      trainer: 'Sarah Johnson',
      status: 'confirmed'
    },
    {
      _id: '2',
      className: 'HIIT Training',
      date: '2025-09-20',
      time: '18:00',
      trainer: 'Mike Chen',
      status: 'completed'
    },
    {
      _id: '3',
      className: 'Pilates Core',
      date: '2025-09-28',
      time: '10:00',
      trainer: 'Emma Wilson',
      status: 'confirmed'
    }
  ];

  // Filter bookings for upcoming vs history
  const upcomingBookings = mockBookings.filter(booking => 
    new Date(booking.date) > new Date() || booking.status === 'confirmed'
  );
  
  const pastBookings = mockBookings.filter(booking => 
    new Date(booking.date) <= new Date() && booking.status === 'completed'
  );

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const handleUpdateSuccess = (successMessage) => {
    setMessage(successMessage);
    setActiveTab('view');
    setTimeout(() => setMessage(''), 5000);
  };

  const handleDeleteSuccess = (successMessage) => {
    setMessage(successMessage);
    // Redirect to home page after account deletion
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'update':
        return (
          <UpdateProfile
            onCancel={() => setActiveTab('view')}
            onSuccess={handleUpdateSuccess}
          />
        );
      case 'delete':
        return (
          <DeleteAccount
            onCancel={() => setActiveTab('view')}
            onSuccess={handleDeleteSuccess}
          />
        );
      case 'bookings':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <UpcomingBookings bookings={upcomingBookings} />
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <BookingHistory bookings={pastBookings} />
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-6 mb-6">
              <img
                src={user.profileImage || 'https://placehold.co/100x100/60a5fa/ffffff?text=U'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{user.username}</h1>
                <p className="text-gray-600">{user.email}</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full mt-2 capitalize">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Account Information</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">User ID:</span> {user._id}</p>
                  <p><span className="font-medium">Role:</span> {user.role}</p>
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="w-full text-left px-3 py-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                  >
                    📅 View My Bookings
                  </button>
                  <button
                    onClick={() => setActiveTab('update')}
                    className="w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    📝 Edit Profile
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600 font-medium">Upcoming Classes:</span>
                    <span className="ml-2 text-blue-800">{upcomingBookings.length}</span>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Completed Classes:</span>
                    <span className="ml-2 text-blue-800">{pastBookings.length}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-red-600 mb-4">Danger Zone</h3>
              <button
                onClick={() => setActiveTab('delete')}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Once you delete your account, there is no going back. Please be certain.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {message && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          {message}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-1">
          <button
            onClick={() => setActiveTab('view')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'view'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'bookings'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            My Bookings
          </button>
          <button
            onClick={() => setActiveTab('update')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'update'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            Update Profile
          </button>
        </nav>
      </div>

      {renderTabContent()}
    </div>
  );
};

export default Profile;