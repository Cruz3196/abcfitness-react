import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, Package, Calendar, CreditCard, MapPin, 
    Truck, CheckCircle, Clock, Mail, Phone, Copy,
    Download, RotateCcw
} from 'lucide-react';
import { useOrderStore } from '../storeData/useOrderStore';
import toast from 'react-hot-toast';
import Spinner from '../components/common/Spinner';

const OrderDetailsPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { getOrderById, fetchOrderById } = useOrderStore();
    
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadOrderDetails = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // First try to get from store
                const cachedOrder = getOrderById(orderId);
                if (cachedOrder) {
                    console.log('✅ Found order in store:', cachedOrder);
                    setOrder(cachedOrder);
                    setIsLoading(false);
                    return;
                }

                // If not in store, fetch from API
                console.log('🔍 Fetching order from API...');
                const fetchedOrder = await fetchOrderById(orderId);
                setOrder(fetchedOrder);
                
            } catch (error) {
                console.error('❌ Error loading order details:', error);
                setError(error.message || 'Failed to load order details');
            } finally {
                setIsLoading(false);
            }
        };

        if (orderId) {
            loadOrderDetails();
        }
    }, [orderId, getOrderById, fetchOrderById]);

    const copyOrderId = () => {
        navigator.clipboard.writeText(order._id);
        toast.success('Order ID copied to clipboard!');
    };

    const handleReorder = () => {
        // Add items to cart and redirect to cart
        toast.success('Items added to cart!');
        navigate('/cart');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="text-center">
                    <Spinner />
                    <p className="mt-4">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="text-center">
                    <Package className="w-16 h-16 text-error mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-error mb-2">Order Not Found</h1>
                    <p className="text-base-content/70 mb-4">{error}</p>
                    <Link to="/profile" className="btn btn-primary">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="text-center">
                    <Package className="w-16 h-16 text-base-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
                    <p className="text-base-content/70 mb-4">The order you're looking for doesn't exist.</p>
                    <Link to="/profile" className="btn btn-primary">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <motion.div 
            className="min-h-screen bg-base-200 py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="container mx-auto px-4 max-w-6xl">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="btn btn-ghost gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    
                    <div className="flex gap-2">
                        <button 
                            onClick={handleReorder}
                            className="btn btn-outline gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reorder
                        </button>
                        <button className="btn btn-ghost gap-2">
                            <Download className="w-4 h-4" />
                            Download Invoice
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Main Order Info */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Order Header */}
                        <div className="card bg-base-100 shadow-lg">
                            <div className="card-body">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                                    <div>
                                        <h1 className="text-3xl font-bold mb-2">
                                            Order #{order._id.slice(-8)}
                                        </h1>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="w-4 h-4 text-base-content/70" />
                                            <span className="text-base-content/70">
                                                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={copyOrderId}
                                            className="btn btn-ghost btn-xs gap-1"
                                        >
                                            <Copy className="w-3 h-3" />
                                            Copy Order ID
                                        </button>
                                    </div>
                                    
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-primary mb-2">
                                            ${order.totalAmount?.toFixed(2) || '0.00'}
                                        </div>
                                        <div className="badge badge-success badge-lg">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            {order.status || 'Completed'}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Status Timeline */}
                                <div className="divider"></div>
                                <OrderTimeline status={order.status} createdAt={order.createdAt} />
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="card bg-base-100 shadow-lg">
                            <div className="card-body">
                                <h2 className="card-title mb-4">
                                    <Package className="w-5 h-5" />
                                    Order Items ({order.itemCount || order.items?.length || 0})
                                </h2>
                                
                                <div className="space-y-4">
                                    {order.items && order.items.map((item, index) => (
                                        <OrderItem key={index} item={item} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        
                        {/* Order Summary */}
                        <div className="card bg-base-100 shadow-lg">
                            <div className="card-body">
                                <h3 className="card-title mb-4">Order Summary</h3>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>${(order.totalAmount * 0.85).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Taxes</span>
                                        <span>${(order.totalAmount * 0.08).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>${(order.totalAmount * 0.07).toFixed(2)}</span>
                                    </div>
                                    <div className="divider my-2"></div>
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>${order.totalAmount?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="card bg-base-100 shadow-lg">
                            <div className="card-body">
                                <h3 className="card-title mb-4">
                                    <CreditCard className="w-5 h-5" />
                                    Payment Information
                                </h3>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">VISA</span>
                                        </div>
                                        <div>
                                            <p className="font-medium">•••• •••• •••• 4242</p>
                                            <p className="text-sm text-base-content/70">Paid via Stripe</p>
                                        </div>
                                    </div>
                                    
                                    {order.stripeSessionId && (
                                        <div className="bg-base-200 p-3 rounded">
                                            <p className="text-xs text-base-content/70 mb-1">Transaction ID:</p>
                                            <p className="text-sm font-mono">{order.stripeSessionId.slice(-12)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="card bg-base-100 shadow-lg">
                            <div className="card-body">
                                <h3 className="card-title mb-4">
                                    <Truck className="w-5 h-5" />
                                    Shipping Information
                                </h3>
                                
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-4 h-4 mt-1 text-primary" />
                                        <div>
                                            <p className="font-medium">John Doe</p>
                                            <p className="text-sm text-base-content/70">
                                                123 Fitness Street<br />
                                                Los Angeles, CA 90210<br />
                                                United States
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-success/10 p-3 rounded">
                                        <div className="flex items-center gap-2 text-success">
                                            <CheckCircle className="w-4 h-4" />
                                            <span className="font-medium">Delivered</span>
                                        </div>
                                        <p className="text-sm text-base-content/70 mt-1">
                                            Estimated delivery: 3-5 business days
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Support */}
                        <div className="card bg-base-100 shadow-lg">
                            <div className="card-body">
                                <h3 className="card-title mb-4">Need Help?</h3>
                                
                                <div className="space-y-3">
                                    <button className="btn btn-outline btn-sm w-full gap-2">
                                        <Mail className="w-4 h-4" />
                                        Contact Support
                                    </button>
                                    <button className="btn btn-outline btn-sm w-full gap-2">
                                        <Phone className="w-4 h-4" />
                                        Call Us
                                    </button>
                                    <Link to="/store" className="btn btn-primary btn-sm w-full">
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Order Timeline Component
const OrderTimeline = ({ status, createdAt }) => (
    <div className="flex items-center gap-4 overflow-x-auto pb-2">
        <TimelineStep 
            icon={CheckCircle}
            title="Order Placed"
            time={new Date(createdAt).toLocaleDateString()}
            completed={true}
        />
        <div className="w-8 h-0.5 bg-success"></div>
        <TimelineStep 
            icon={Package}
            title="Processing"
            time="Within 24 hours"
            completed={true}
        />
        <div className="w-8 h-0.5 bg-success"></div>
        <TimelineStep 
            icon={Truck}
            title="Shipped"
            time="2-3 days"
            completed={true}
        />
        <div className="w-8 h-0.5 bg-success"></div>
        <TimelineStep 
            icon={CheckCircle}
            title="Delivered"
            time="Completed"
            completed={status === 'delivered' || status === 'completed'}
        />
    </div>
);

const TimelineStep = ({ icon: Icon, title, time, completed }) => (
    <div className="flex flex-col items-center gap-2 min-w-fit">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            completed ? 'bg-success text-success-content' : 'bg-base-300 text-base-content/50'
        }`}>
            <Icon className="w-5 h-5" />
        </div>
        <div className="text-center">
            <p className={`text-sm font-medium ${completed ? 'text-success' : 'text-base-content/70'}`}>
                {title}
            </p>
            <p className="text-xs text-base-content/50">{time}</p>
        </div>
    </div>
);

// Order Item Component
const OrderItem = ({ item }) => (
    <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
        <div className="avatar">
            <div className="w-16 h-16 rounded">
                <img 
                    src={item.image || '/api/placeholder/64/64'} 
                    alt={item.name || 'Product'}
                    className="object-cover"
                    loading="lazy"
                />
            </div>
        </div>
        
        <div className="flex-1">
            <h4 className="font-semibold text-lg">{item.name || 'Unknown Product'}</h4>
            <p className="text-base-content/70">Quantity: {item.quantity || 1}</p>
            <div className="flex items-center gap-4 mt-2">
                <span className="text-lg font-bold text-primary">
                    ${(item.price || 0).toFixed(2)} each
                </span>
                <span className="text-base-content/70">
                    Total: ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </span>
            </div>
        </div>

        <div className="text-right">
            <Link 
                to={`/product/${item.productId || item._id}`} 
                className="btn btn-ghost btn-sm"
            >
                View Product
            </Link>
        </div>
    </div>
);

export default OrderDetailsPage;