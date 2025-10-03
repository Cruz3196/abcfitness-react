import React from 'react';
import { motion } from 'framer-motion';
import { Package, Star, StarOff, Edit, Eye, Trash2 } from 'lucide-react';
import { productStore } from '../../../storeData/productStore';

const ProductsTab = ({ 
    setShowProductForm, 
    handleEditProduct, 
    handleDeleteProduct, 
    handleToggleFeatured 
}) => {
    // Get product store data
    const { 
        products, 
        isLoading: isLoadingProducts, 
        fetchAllProducts
    } = productStore();

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
            {/* Remove the activeTab condition and fragment wrapper */}
            <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="card-title">Product Management</h2>
                    <div className="flex gap-2">
                        <button 
                            className="btn btn-outline btn-sm"
                            onClick={fetchAllProducts}
                            disabled={isLoadingProducts}
                        >
                            Refresh
                        </button>
                        <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => setShowProductForm(true)}
                        >
                            Add Product
                        </button>
                    </div>
                </div>
                
                {isLoadingProducts ? (
                    <div className="flex justify-center py-8">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-8">
                        <Package className="mx-auto w-16 h-16 text-base-300 mb-2" />
                        <p className="text-base-content/70 mb-4">No products found</p>
                        <button 
                            className="btn btn-primary"
                            onClick={() => setShowProductForm(true)}
                        >
                            Add Your First Product
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Category</th>
                                    <th>Featured</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product._id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-12 h-12">
                                                        <img 
                                                            src={product.productImage || "https://placehold.co/48x48?text=No+Image"} 
                                                            alt={product.productName} 
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{product.productName}</div>
                                                    <div className="text-xs opacity-50 truncate w-48">
                                                        {product.productDescription?.substring(0, 50)}
                                                        {product.productDescription?.length > 50 ? '...' : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>${product.productPrice?.toFixed(2)}</td>
                                        <td>{product.productCategory}</td>
                                        <td>
                                            <button
                                                className={`btn btn-sm ${product.isFeatured ? 'btn-warning' : 'btn-ghost'}`}
                                                onClick={() => handleToggleFeatured(product._id, product.isFeatured)}
                                                title={product.isFeatured ? 'Remove from featured' : 'Add to featured'}
                                            >
                                                {product.isFeatured ? (
                                                    <>
                                                        <Star className="w-4 h-4 mr-1" />
                                                        Featured
                                                    </>
                                                ) : (
                                                    <>
                                                        <StarOff className="w-4 h-4 mr-1" />
                                                        Not Featured
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button 
                                                    className="btn btn-sm btn-ghost"
                                                    onClick={() => handleEditProduct(product)}
                                                    title="Edit Product"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-ghost"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-error"
                                                    onClick={() => handleDeleteProduct(product._id, product.productName)}
                                                    title="Delete Product"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export { ProductsTab };