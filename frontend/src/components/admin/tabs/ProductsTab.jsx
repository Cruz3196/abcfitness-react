import React from 'react';
import { motion } from 'framer-motion';
import { Package, Star, StarOff, Edit, Trash2 } from 'lucide-react';
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
            <div className="card-body">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                    <h2 className="card-title">Product Management</h2>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button 
                            className="btn btn-outline btn-sm flex-1 sm:flex-none"
                            onClick={fetchAllProducts}
                            disabled={isLoadingProducts}
                        >
                            Refresh
                        </button>
                        <button 
                            className="btn btn-primary btn-sm flex-1 sm:flex-none"
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
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-x-auto">
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

                        {/* Mobile/Tablet Card View */}
                        <div className="lg:hidden space-y-4">
                            {products.map(product => (
                                <div key={product._id} className="card bg-base-200 shadow">
                                    <div className="card-body p-4">

                                        {/* Product Image and Info */}
                                        <div className="flex flex-col gap-2 mb-3">
                                            {/* this is the product image  */}
                                            <figure>
                                                <img 
                                                    src={product.productImage || "https://placehold.co/64x64?text=No+Image"} 
                                                    alt={product.productName} 
                                                    className="h-80 w-full object-scale-down"
                                                    loading="lazy" 
                                                    width="400" 
                                                    height="225" 
                                                />
                                            </figure>

                                            {/* product price and description */}
                                            <div className='description'>
                                                <h3 className="font-bold text-lg line-clamp-1">{product.productName}</h3>
                                                    <p className="text-sm opacity-70 line-clamp-2">
                                                        {product.productDescription}
                                                </p>
                                            </div>

                                        </div>
                                        
                                        {/* These are the price and category details */}
                                        <div className="flex flex-col gap-2 mb-3 text-sm justify-between">
                                            <div>
                                                <span className="opacity-70">Price:</span>
                                                <span className="font-semibold ml-1">${product.productPrice?.toFixed(2)}</span>
                                            </div>
                                            <div>
                                                <span className="opacity-70">Category:</span>
                                                <span className="font-semibold ml-1">{product.productCategory}</span>
                                            </div>
                                        </div>

                                            {/* <button
                                                className={`btn btn-sm flex-1 ${product.isFeatured ? 'btn-warning' : 'btn-ghost'}`}
                                                onClick={() => handleToggleFeatured(product._id, product.isFeatured)}
                                            >
                                                {product.isFeatured ? (
                                                    <>
                                                        <Star className="w-4 h-4" />
                                                        <span className="hidden sm:inline ml-1">Featured</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <StarOff className="w-4 h-4" />
                                                        <span className="hidden sm:inline ml-1">Not Featured</span>
                                                    </>
                                                )}
                                            </button> */}

                                        {/* These are the action button for edit, toggle featured, and delete */}
                                            <div className="grid grid-cols-3 gap-2">
                                                <button 
                                                    className="btn btn-sm btn-ghost flex-1 sm:flex-none"
                                                    onClick={() => handleEditProduct(product)}
                                                    title="Edit Product"
                                                >
                                                    <div className="flex items-center justify-center text-center">
                                                        <Edit className="w-4 h-4 mr-1" />
                                                        <div className="hidden sm:inline ml-1">Edit</div>
                                                    </div>
                                                </button>

                                                <button 
                                                    className={`btn btn-sm ${product.isFeatured ? 'btn-warning' : 'btn-ghost'} flex-1 sm:flex-none`} 
                                                    onClick={() => handleToggleFeatured(product._id, product.isFeatured)}
                                                    title="Enable featured toggle"
                                                >
                                                    {product.isFeatured ? (
                                                        <div className="flex items-center justify-center">
                                                            <Star className="w-4 h-4" />
                                                            <span className="hidden sm:inline ml-1">Featured</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center">
                                                            <StarOff className="w-4 h-4" />
                                                            <span className="hidden sm:inline ml-1">Not Featured</span>
                                                        </div>
                                                    )}
                                                </button>

                                                <button 
                                                    className="btn btn-sm btn-error flex-1 sm:flex-none"
                                                    onClick={() => handleDeleteProduct(product._id, product.productName)}
                                                    title="Delete Product"
                                                >
                                                    <div className="flex items-center justify-center text-center">
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        <span className="hidden sm:inline ml-1">Delete</span>
                                                    </div>
                                                </button>
                                            </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export { ProductsTab };