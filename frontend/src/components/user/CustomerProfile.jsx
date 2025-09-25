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
import { bookingStore } from '../../storeData/bookingStore';
import { Link, useNavigate } from 'react-router-dom';

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, deleteUserAccount, isLoading: isUserLoading } = userStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { orders, isLoading: isLoadingOrders, fetchOrderHistory } = useOrderStore();  // Use the store
  const { upcomingBookings, fetchMyBookings, isLoading: isLoadingBookings, bookingHistory } = bookingStore();
  const [activeTab, setActiveTab] = useState('view');
  const [message, setMessage] = useState('');


  // Form state for profile editing
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email:user?.email || '',
  });

  // reset form data when user changes 
  useEffect(() => {
    if(user) {
      setProfileForm({
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
    // Handle profile update form submission
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!profileForm.username || !profileForm.email) {
      toast.error('Username and email are required');
      return;
    }
    
    const success = await updateProfile(profileForm);
    if (success) {
      setActiveTab('view'); // Switch back to view tab after successful update
    }
  };

  // Handle for account deletion 
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (confirmed) {
      const success = await deleteUserAccount();
      if (success) {
        toast.success("Account deleted successfully");
        navigate("/");  // Redirect to home or login page
      }
    } else {
      toast.error("Failed to delete account");
    }
  };

  // This is for the product orders 
  useEffect(() => {
      if (activeTab === 'orders') {
        fetchOrderHistory();  // Use the store function
      }
    }, [activeTab, fetchOrderHistory]);

  // This is for the class bookings
  useEffect(() => {
      if (activeTab === 'bookings') {
        fetchMyBookings();  // Use the store function
      }
    }, [activeTab, fetchMyBookings]);


  // formatting date and time
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const dateTime = new Date(dateTimeStr);
    return dateTime.toLocaleDateString() + ' at ' + 
        dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Animation Variants 
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

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
                      <div className="stat-value text-primary">
                        {isLoadingBookings ? 
                          <span className="loading loading-spinner loading-sm"></span> : 
                          (upcomingBookings.length + (bookingHistory?.length || 0))
                        }
                      </div>
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
                    <Link to="/store" className="btn btn-primary">
                      Shop Now 
                    </Link>
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
                  {isLoadingBookings ? (
                    <div className="text-center py-6">
                      <span className="loading loading-spinner loading-md"></span>
                      <p className="mt-2">Loading bookings...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingBookings.length === 0 ? (
                        <div className="text-center py-6">
                          <Calendar className="w-12 h-12 mx-auto text-base-300 mb-2" />
                          <p className="text-base-content/70">No upcoming bookings</p>
                          <Link to="/classes" className="btn btn-primary btn-sm mt-4">
                            Browse Classes
                          </Link>
                        </div>
                      ) : (
                        upcomingBookings.map(booking => (
                          <div key={booking._id} className="flex flex-col p-3 border border-base-300 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{booking.class?.classTitle || 'Class'}</h4>
                              <div className="badge badge-success">Upcoming</div>
                            </div>
                            <div className="text-sm text-base-content/70 mb-1">
                              <Clock className="inline-block w-4 h-4 mr-1" />
                              {formatDateTime(booking.startTime)}
                            </div>
                            {booking.class?.trainer?.user?.username && (
                              <div className="text-sm text-base-content/70 mb-2">
                                <UserCheck className="inline-block w-4 h-4 mr-1" />
                                Trainer: {booking.class.trainer.user.username}
                              </div>
                            )}
                            <div className="card-actions justify-end mt-2">
                              <button 
                                className="btn btn-sm btn-error"
                                onClick={() => cancelBooking(booking._id)}
                                disabled={isLoadingBookings}
                              >
                                Cancel Booking
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title text-lg mb-4">Class History</h3>
                  {isLoadingBookings ? (
                    <div className="text-center py-6">
                      <span className="loading loading-spinner loading-md"></span>
                      <p className="mt-2">Loading history...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookingHistory.length === 0 ? (
                        <p className="text-base-content/70 text-center py-4">No booking history</p>
                      ) : (
                        bookingHistory.map(booking => (
                          <div key={booking._id} className="flex flex-col p-3 border border-base-300 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{booking.class?.classTitle || 'Class'}</h4>
                              <div className={`badge ${booking.status === 'cancelled' ? 'badge-error' : 'badge-ghost'}`}>
                                {booking.status}
                              </div>
                            </div>
                            <div className="text-sm text-base-content/70">
                              {formatDateTime(booking.startTime)}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
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
              <form className="space-y-4" onSubmit={handleUpdateProfile}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Username</span>
                  </label>
                  <input 
                    type="text" 
                    name="username"
                    className="input input-bordered" 
                    value={profileForm.username}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    className="input input-bordered" 
                    value={profileForm.email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="card-actions justify-end mt-6">
                  <button 
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setActiveTab('view')}
                    disabled={isUserLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className={`btn btn-primary gap-2 ${isUserLoading ? 'loading' : ''}`}
                    disabled={isUserLoading}
                  >
                    {!isUserLoading && <Save className="w-4 h-4" />}
                    {isUserLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
              {/* Danger Zone for account deletion */}
              <div className="divider mt-8 mb-6">Woah are you sure? </div>
                <div className="bg-error/10 p-4 rounded-lg">
                  <h3 className="font-semibold text-error mb-2">Delete Account</h3>
                  <p className="text-sm mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button 
                    type="button" 
                    className="btn btn-error btn-sm"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete Account
                  </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      {/* Delete Account Modal */}
      {showDeleteModal && (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
        <motion.div 
          className="modal-box relative bg-base-100 rounded-lg shadow-xl max-w-md mx-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h3 className="font-bold text-lg mb-4 text-error">Delete Account</h3>
          <p className="mb-6">
            Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data, including:
          </p>
          <ul className="list-disc ml-6 mb-6 space-y-2">
            <li>Personal profile information</li>
            <li>Booking history</li>
            <li>Order history</li>
            <li>Reviews and feedback</li>
          </ul>
          <div className="modal-action flex justify-end">
            <button 
              className="btn btn-ghost" 
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button 
              className="btn btn-error" 
              onClick={handleDeleteAccount}
              disabled={isUserLoading}
            >
              {isUserLoading ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </motion.div>
      </div>
    )}
    </motion.div>
  );
};

export default CustomerProfile;