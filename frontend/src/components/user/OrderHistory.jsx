import { useEffect } from 'react';
import { useOrderStore } from '../../storeData/useOrderStore.js';
import Spinner from '../common/Spinner';

const OrderHistory = () => {
    const { orders, isLoading, fetchOrderHistory } = useOrderStore();

    useEffect(() => {
        fetchOrderHistory();
    }, [fetchOrderHistory]);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 border-b-2 border-gray-700 pb-2">Order History</h2>
            <div className="space-y-6">
                {orders.length > 0 ? (
                    orders.map(order => (
                        <div key={order._id} className="card bg-base-100 shadow-lg">
                            <div className="card-body">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">Order ID: <span className="font-mono badge badge-neutral">{order._id}</span></p>
                                        <p className="text-sm text-base-content/70">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <p className="text-lg font-bold text-primary">${order.totalAmount.toFixed(2)}</p>
                                </div>
                                <div className="divider"></div>
                                <div className="space-y-4">
                                    {order.products.map(({ product, quantity }) => (
                                        <div key={product._id} className="flex items-center gap-4">
                                            <img src={product.productImage || 'https://placehold.co/100x100?text=Item'} alt={product.productName} className="w-16 h-16 rounded-md object-cover" />
                                            <div>
                                                <p className="font-semibold">{product.productName}</p>
                                                <p className="text-sm text-base-content/60">Quantity: {quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="card bg-base-100/10">
                        <div className="card-body">
                            <p className="text-gray-500">You have no past orders.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
