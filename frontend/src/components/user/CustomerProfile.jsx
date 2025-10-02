import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
    User, Mail, UserCheck, Edit, Save, Calendar, Clock, 
    Package, ShoppingBag, Eye, Star, MapPin, Phone
} from 'lucide-react';
import { userStore } from '../../storeData/userStore';
import { useOrderStore } from '../../storeData/useOrderStore';
import BookingCard from './BookingCard';
import toast from 'react-hot-toast';

const CustomerProfile = () => {
    const navigate = useNavigate();
    const { 
        user, 
        logout, 
        updateProfile, 
        deleteUserAccount, 
        fetchMyBookings, 
        isLoading: isUserLoading 
    } = userStore();

    const { 
        orders, 
        isLoading: isLoadingOrders, 
        fetchOrderHistory, 
        clearOrders 
    } = useOrderStore();

    const [activeTab, setActiveTab] = useState('view');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [profileForm, setProfileForm] = useState({
        username: user?.username || '',
        email: user?.email || ''
    });

    // ✅ Fixed booking filtering logic
    const { upcomingBookings, bookingHistory, totalBookings } = useMemo(() => {
        // ✅ Add comprehensive safety checks
        if (!user || !user.bookings) {
            return {
                upcomingBookings: [],
                bookingHistory: [],
                totalBookings: 0
            };
        }

        // ✅ Ensure bookings is an array
        const bookings = Array.isArray(user.bookings) ? user.bookings : [];
        
        if (bookings.length === 0) {
            return {
                upcomingBookings: [],
                bookingHistory: [],
                totalBookings: 0
            };
        }

        const now = new Date();
        
        try {
            const upcoming = bookings.filter(booking => {
                // ✅ Add null/undefined checks for each booking
                if (!booking) return false;
                
                // ✅ Only show bookings with 'upcoming' status
                if (booking.status !== 'upcoming') return false;
                
                // ✅ Check if booking has a valid date and is in the future
                if (!booking.startTime && !booking.sessionDate) return false;
                
                try {
                    // ✅ Use sessionDate or startTime, whichever is available
                    const bookingDate = new Date(booking.sessionDate || booking.startTime);
                    return bookingDate > now;
                } catch (dateError) {
                    console.warn('Invalid date format for booking:', booking);
                    return false;
                }
            });
            
            const history = bookings.filter(booking => {
                // ✅ Add null/undefined checks for each booking
                if (!booking) return false;
                
                // ✅ Show cancelled or completed bookings in history
                if (booking.status === 'cancelled' || booking.status === 'completed') {
                    return true;
                }
                
                // ✅ Show past upcoming bookings in history
                if (booking.status === 'upcoming') {
                    if (!booking.startTime && !booking.sessionDate) return false;
                    
                    try {
                        const bookingDate = new Date(booking.sessionDate || booking.startTime);
                        return bookingDate <= now;
                    } catch (dateError) {
                        console.warn('Invalid date format for booking:', booking);
                        return true; // Show invalid bookings in history
                    }
                }
                
                return false;
            });
            
            return {
                upcomingBookings: upcoming,
                bookingHistory: history,
                totalBookings: bookings.length // Total of all bookings
            };
        } catch (error) {
            console.error('Error processing bookings:', error);
            return {
                upcomingBookings: [],
                bookingHistory: [],
                totalBookings: 0
            };
        }
    }, [user?.bookings]); // ✅ Only depend on user.bookings

    // ✅ Debug logging to help track booking states
useEffect(() => {
    if (user?.bookings && Array.isArray(user.bookings) && activeTab === 'bookings') {
        console.log('📊 Booking Debug Info:');
        console.log('Total bookings:', user.bookings.length);
        console.log('Upcoming:', upcomingBookings.length);
        console.log('History:', bookingHistory.length);
        console.log('Raw bookings:', user.bookings.map(b => ({
            id: b._id,
            status: b.status,
            sessionDate: b.sessionDate,
            startTime: b.startTime
        })));
    }
}, [user?.bookings, upcomingBookings.length, bookingHistory.length, activeTab]);

    // ✅ Optimize data fetching - only fetch when tab is active
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        // Set initial form data
        if (user && (!profileForm.username || !profileForm.email)) {
            setProfileForm({
                username: user.username || '',
                email: user.email || ''
            });
        }
    }, [user, navigate]);

    // ✅ Lazy load data based on active tab
useEffect(() => {
    if (!user) return;

    switch (activeTab) {
        case 'bookings':
            // Only fetch if bookings don't exist or are empty
            if (!user.bookings || !Array.isArray(user.bookings) || user.bookings.length === 0) {
                console.log('🔄 Fetching bookings data...');
                fetchMyBookings();
            }
            break;
        case 'orders':
            if (orders.length === 0) {
                console.log('🔄 Fetching orders data...');
                fetchOrderHistory();
            }
            break;
        default:
            break;
    }
}, [activeTab, user, fetchMyBookings, fetchOrderHistory, orders.length]);

    // ✅ Memoize handlers
    const handleLogout = useCallback(async () => {
        try {
            await logout();
            clearOrders();
            navigate('/');
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Failed to logout');
        }
    }, [logout, clearOrders, navigate]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleUpdateProfile = useCallback(async (e) => {
        e.preventDefault();
        try {
            await updateProfile(profileForm);
            setActiveTab('view');
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        }
    }, [updateProfile, profileForm]);

    const handleDeleteAccount = useCallback(async () => {
        try {
            await deleteUserAccount();
            clearOrders();
            navigate('/');
            toast.success('Account deleted successfully');
        } catch (error) {
            toast.error('Failed to delete account');
        }
    }, [deleteUserAccount, clearOrders, navigate]);

    // ✅ Simplified animations
    const pageVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <motion.div 
            className="min-h-screen bg-base-200 py-8"
            initial="hidden"
            animate="visible"
            variants={pageVariants}
        >
            <div className="container mx-auto px-4 max-w-6xl">
                
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="avatar mb-4">
                        <div className="w-24 h-24 rounded-full">
                            <img 
                                src={user.profileImage || "https://placehold.co/96x96"} 
                                alt="Profile"
                                loading="lazy"
                            />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-base-content mb-2">Welcome, {user.username}!</h1>
                    <p className="text-base-content/70">Manage your fitness journey</p>
                </div>

                {/* Navigation Tabs */}
                <div className="tabs tabs-boxed justify-center mb-8">
                    {['view', 'bookings', 'orders', 'edit'].map((tab) => (
                        <button 
                            key={tab}
                            className={`tab ${activeTab === tab ? 'tab-active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'view' && 'Profile'}
                            {tab === 'bookings' && 'Class Bookings'}
                            {tab === 'orders' && 'Order History'}
                            {tab === 'edit' && 'Edit Profile'}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {/* Profile Overview Tab */}
                    {activeTab === 'view' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ProfileInfoCard user={user} setActiveTab={setActiveTab} />
                            <QuickStatsCard 
                                totalBookings={totalBookings}
                                totalOrders={orders.length}
                                isLoadingOrders={isLoadingOrders}
                                memberSince={user.createdAt}
                            />
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <OrdersTab orders={orders} isLoading={isLoadingOrders} />
                    )}

                    {/* Bookings Tab */}
                    {activeTab === 'bookings' && (
                        <BookingsTab 
                            upcomingBookings={upcomingBookings}
                            bookingHistory={bookingHistory}
                            isLoading={isUserLoading}
                        />
                    )}

                    {/* Edit Profile Tab */}
                    {activeTab === 'edit' && (
                        <EditProfileTab 
                            profileForm={profileForm}
                            handleInputChange={handleInputChange}
                            handleUpdateProfile={handleUpdateProfile}
                            setActiveTab={setActiveTab}
                            setShowDeleteModal={setShowDeleteModal}
                            isLoading={isUserLoading}
                        />
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <DeleteModal 
                    onCancel={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteAccount}
                />
            )}
        </motion.div>
    );
};

// ✅ Rest of the components remain the same...
const ProfileInfoCard = React.memo(({ user, setActiveTab }) => (
    <div className="card bg-base-100 shadow-lg">
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
            
            <div className="card-actions justify-end mt-6">
                <button 
                    className="btn btn-outline btn-sm gap-2"
                    onClick={() => setActiveTab('orders')}
                >
                    <Package className="w-4 h-4" />
                    View Orders
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
    </div>
));

const QuickStatsCard = React.memo(({ totalBookings, totalOrders, isLoadingOrders, memberSince }) => (
    <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
            <h2 className="card-title">Quick Stats</h2>
            <div className="stats stats-vertical shadow">
                <div className="stat">
                    <div className="stat-title">Total Bookings</div>
                    <div className="stat-value text-primary">{totalBookings}</div>
                    <div className="stat-desc">Class enrollments</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Total Orders</div>
                    <div className="stat-value text-secondary">
                        {isLoadingOrders ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            totalOrders
                        )}
                    </div>
                    <div className="stat-desc">Product purchases</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Member Since</div>
                    <div className="stat-value text-accent text-lg">
                        {memberSince ? new Date(memberSince).getFullYear() : '2024'}
                    </div>
                    <div className="stat-desc">Fitness journey</div>
                </div>
            </div>
        </div>
    </div>
));

const OrdersTab = React.memo(({ orders, isLoading }) => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Order History</h2>
            <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                <span>{orders.length} orders</span>
            </div>
        </div>

        {isLoading ? (
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
                    <Link to="/store" className="btn btn-primary">Shop Now</Link>
                </div>
            </div>
        ) : (
            <div className="space-y-4">
                {orders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                ))}
            </div>
        )}
    </div>
));

const OrderCard = React.memo(({ order }) => (
    <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                    <h3 className="card-title">Order #{order._id.slice(-8)}</h3>
                    <p className="text-base-content/70">
                        {new Date(order.createdAt).toLocaleDateString()} • {order.itemCount || 0} items
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-primary">${order.totalAmount?.toFixed(2) || '0.00'}</p>
                    <div className="badge badge-success">{order.status || 'completed'}</div>
                </div>
            </div>

            {order.items && Array.isArray(order.items) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                            <div className="avatar">
                                <div className="w-12 h-12 rounded">
                                    <img 
                                        src={item.image || '/api/placeholder/48/48'} 
                                        alt={item.name || 'Product'}
                                        className="object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">{item.name || 'Unknown Product'}</h4>
                                <p className="text-xs text-base-content/70">
                                    Qty: {item.quantity || 1} • ${(item.price || 0).toFixed(2)}
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
              <Link 
                  to={`/order/${order._id}`}
                  className="btn btn-sm btn-outline gap-2"
              >
                  <Eye className="w-4 h-4" />
                  View Details
              </Link>
              <Link to="/store" className="btn btn-sm btn-primary">
                  Shop Again
              </Link>
          </div>
        </div>
    </div>
));

const BookingsTab = React.memo(({ upcomingBookings, bookingHistory, isLoading }) => (
    <div>            
        {isLoading ? (
            <div className="text-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="mt-4">Loading your bookings...</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BookingSection 
                    title="Upcoming Classes"
                    icon={Calendar}
                    bookings={upcomingBookings}
                    isHistory={false}
                    emptyMessage="No upcoming bookings"
                    emptySubMessage="Ready to start your fitness journey?"
                    linkTo="/classes"
                    linkText="Browse Classes"
                />
                
                <BookingSection 
                    title="Class History"
                    icon={Clock}
                    bookings={bookingHistory}
                    isHistory={true}
                    emptyMessage="No booking history yet"
                />
            </div>
        )}
    </div>
));

const BookingSection = React.memo(({ title, icon: Icon, bookings, isHistory, emptyMessage, emptySubMessage, linkTo, linkText }) => (
    <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
            <h3 className="card-title text-lg mb-4 flex items-center gap-2">
                <Icon className="w-5 h-5 text-primary" />
                {title} ({bookings.length})
            </h3>
            
            <div className="space-y-4">
                {bookings.length === 0 ? (
                    <div className="text-center py-8">
                        <Icon className="w-16 h-16 mx-auto text-base-300 mb-4" />
                        <h4 className="text-lg font-semibold mb-2">{emptyMessage}</h4>
                        {emptySubMessage && <p className="text-base-content/60 mb-4">{emptySubMessage}</p>}
                        {linkTo && linkText && (
                            <Link to={linkTo} className="btn btn-primary">
                                {linkText}
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="max-h-96 overflow-y-auto space-y-3">
                        {bookings.map(booking => (
                            <BookingCard 
                                key={booking._id} 
                                booking={booking} 
                                isHistory={isHistory} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
));

const EditProfileTab = React.memo(({ profileForm, handleInputChange, handleUpdateProfile, setActiveTab, setShowDeleteModal, isLoading }) => (
    <div className="card bg-base-100 shadow-lg max-w-2xl mx-auto">
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
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className={`btn btn-primary gap-2 ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {!isLoading && <Save className="w-4 h-4" />}
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
            
            <div className="divider mt-8 mb-6">Danger Zone</div>
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
    </div>
));

const DeleteModal = React.memo(({ onCancel, onConfirm }) => (
    <div className="modal modal-open">
        <div className="modal-box">
            <h3 className="font-bold text-lg">Delete Account</h3>
            <p className="py-4">Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="modal-action">
                <button className="btn" onClick={onCancel}>Cancel</button>
                <button className="btn btn-error" onClick={onConfirm}>Delete Account</button>
            </div>
        </div>
    </div>
));

export default CustomerProfile;