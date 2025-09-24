import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Edit, 
    Save, 
    X, 
    Calendar,
    Clock,
    UserCheck,
    Package,
    Eye,
    ShoppingBag
} from 'lucide-react';
import  { userStore }  from '../../storeData/userStore';
import { useOrderStore } from '../../storeData/useOrderStore';  // Fix this import
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const CustomerProfile = () => {
  const { user, logout } = userStore();
  const { orders, isLoading: isLoadingOrders, fetchOrderHistory } = useOrderStore();  // Use the store
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

  // Load user orders when orders tab is active
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrderHistory();  // Use the store function
    }
  }, [activeTab, fetchOrderHistory]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <h2 className="card-title justify-center">Please log in to view your profile</h2>
            <div className="card-actions justify-center">
              <Link to="/login" className="btn btn-primary">Log In</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-base-200 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <div className="avatar mb-4">
            <div className="w-24 h-24 rounded-full">
              <img src={user.profileImage || "https://placehold.co/96x96"} alt="Profile" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-base-content mb-2">Welcome, {user.username}!</h1>
          <p className="text-base-content/70">Manage your fitness journey</p>
        </motion.div>

        {/* Tabs */}
        <motion.div className="tabs tabs-boxed justify-center mb-8" variants={itemVariants}>
          <button 
            className={`tab ${activeTab === 'view' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('view')}
          >
            Profile
          </button>
          <button 
            className={`tab ${activeTab === 'bookings' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Class Bookings
          </button>
          <button 
            className={`tab ${activeTab === 'orders' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Order History
          </button>
          <button 
            className={`tab ${activeTab === 'edit' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            Edit Profile
          </button>
        </motion.div>

        {/* Profile View Tab */}
        {activeTab === 'view' && (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={containerVariants}>
            <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
              <div className="card-body">
                <h2 className="card-title">Personal Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary" />
                    <span className="font-medium">Username:</span>
                    <span>{user.username}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="font-medium">Email:</span>
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-primary" />
                    <span className="font-medium">Role:</span>
                    <div className="badge badge-primary">{user.role}</div>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="card-actions justify-end mt-6">
                  <button 
                    className="btn btn-outline btn-sm gap-2"
                    onClick={() => setActiveTab('orders')}
                  >
                    <Package className="w-4 h-4" />
                    View Order History
                  </button>
                  <button 
                    className="btn btn-primary btn-sm gap-2"
                    onClick={() => setActiveTab('edit')}
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
              <div className="card-body">
                <h2 className="card-title">Quick Stats</h2>
                <div className="stats stats-vertical shadow">
                  <div className="stat">
                    <div className="stat-title">Total Bookings</div>
                    <div className="stat-value text-primary">{mockBookings.length}</div>
                    <div className="stat-desc">Class enrollments</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Total Orders</div>
                    <div className="stat-value text-secondary">
                      {isLoadingOrders ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        orders.length
                      )}
                    </div>
                    <div className="stat-desc">Product purchases</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Member Since</div>
                    <div className="stat-value text-accent text-lg">2024</div>
                    <div className="stat-desc">Fitness journey</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Order History Tab */}
        {activeTab === 'orders' && (
          <motion.div variants={itemVariants}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Order History</h2>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                <span>{orders.length} orders</span>
              </div>
            </div>

            {isLoadingOrders ? (
              <div className="text-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
                <p>Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body text-center">
                  <ShoppingBag className="w-16 h-16 text-base-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                  <p className="text-base-content/70 mb-4">Start shopping to see your order history here</p>
                  <button className="btn btn-primary">Shop Now</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div 
                    key={order.orderId || order._id}
                    className="card bg-base-100 shadow-lg"
                    variants={itemVariants}
                  >
                    <div className="card-body">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <div>
                          <h3 className="card-title">Order #{order.orderId || order._id}</h3>
                          <p className="text-base-content/70">
                            {new Date(order.createdAt).toLocaleDateString()} • {order.itemCount || order.items?.length} items
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">${order.total?.toFixed(2) || order.totalAmount?.toFixed(2)}</p>
                          <div className="badge badge-success">{order.status || 'completed'}</div>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      {order.items && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          {order.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                              <div className="avatar">
                                <div className="w-12 h-12 rounded">
                                  <img 
                                    src={item.image || "/api/placeholder/48/48"} 
                                    alt={item.name}
                                    className="object-cover"
                                  />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">{item.name}</h4>
                                <p className="text-xs text-base-content/70">
                                  Qty: {item.quantity} • ${item.price?.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="flex items-center justify-center p-3 bg-base-200 rounded-lg">
                              <span className="text-sm text-base-content/70">
                                +{order.items.length - 3} more items
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="card-actions justify-end">
                        <button className="btn btn-sm btn-outline gap-2">
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        <button className="btn btn-sm btn-primary">Reorder</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Rest of your tabs remain the same... */}
        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold mb-6">Class Bookings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title text-lg mb-4">Upcoming Classes</h3>
                  <div className="space-y-3">
                    {upcomingBookings.length === 0 ? (
                      <p className="text-base-content/70 text-center py-4">No upcoming bookings</p>
                    ) : (
                      upcomingBookings.map(booking => (
                        <div key={booking._id} className="flex items-center justify-between p-3 border border-base-300 rounded-lg">
                          <div>
                            <h4 className="font-semibold">{booking.className}</h4>
                            <p className="text-sm text-base-content/70">
                              {booking.date} at {booking.time} • {booking.trainer}
                            </p>
                          </div>
                          <div className="badge badge-success">{booking.status}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title text-lg mb-4">Class History</h3>
                  <div className="space-y-3">
                    {mockBookings.filter(booking => booking.status === 'completed').map(booking => (
                      <div key={booking._id} className="flex items-center justify-between p-3 border border-base-300 rounded-lg">
                        <div>
                          <h4 className="font-semibold">{booking.className}</h4>
                          <p className="text-sm text-base-content/70">
                            {booking.date} at {booking.time} • {booking.trainer}
                          </p>
                        </div>
                        <div className="badge badge-outline">{booking.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Edit Profile Tab */}
        {activeTab === 'edit' && (
          <motion.div className="card bg-base-100 shadow-lg max-w-2xl mx-auto" variants={itemVariants}>
            <div className="card-body">
              <h2 className="card-title mb-6">Edit Profile</h2>
              <form className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Username</span>
                  </label>
                  <input 
                    type="text" 
                    className="input input-bordered" 
                    defaultValue={user.username}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input 
                    type="email" 
                    className="input input-bordered" 
                    defaultValue={user.email}
                  />
                </div>
                
                <div className="card-actions justify-end mt-6">
                  <button 
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setActiveTab('view')}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  </div>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CustomerProfile;