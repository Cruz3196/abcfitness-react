import React, { useState } from 'react';
import { Star, StarOff, Edit, Eye, Trash2, Package } from 'lucide-react';

const ProductRow = ({ 
    product, 
    onEdit, 
    onDelete, 
    onToggleFeatured, 
    onViewDetails 
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await onDelete(product._id, product.productName);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleFeatured = async () => {
        setIsLoading(true);
        try {
            await onToggleFeatured(product._id, product.isFeatured);
        } finally {
            setIsLoading(false);
        }
    };

    const formatPrice = (price) => {
        if (price === null || price === undefined) return '$0.00';
        return `$${parseFloat(price).toFixed(2)}`;
    };

    const truncateText = (text, maxLength = 50) => {
        if (!text) return 'No description';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    return (
        <tr className="hover:bg-base-200 transition-colors duration-200">
            <td>
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12 bg-base-300">
                            {product.productImage ? (
                                <img 
                                    src={product.productImage} 
                                    alt={product.productName || 'Product'} 
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-base-content/50">
                                    <Package className="w-6 h-6" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="max-w-xs">
                        <div className="font-bold text-base-content line-clamp-1">
                            {product.productName || 'Unnamed Product'}
                        </div>
                        <div className="text-xs opacity-70 text-base-content/70 line-clamp-2">
                            {truncateText(product.productDescription)}
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <div className="font-semibold text-success">
                    {formatPrice(product.productPrice)}
                </div>
            </td>
            <td>
                <div className="badge badge-outline">
                    {product.productCategory || 'Uncategorized'}
                </div>
            </td>
            <td>
                <button
                    className={`btn btn-sm transition-all duration-200 ${
                        product.isFeatured 
                            ? 'btn-warning gap-1' 
                            : 'btn-ghost gap-1 hover:btn-warning'
                    }`}
                    onClick={handleToggleFeatured}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="loading loading-spinner loading-xs"></span>
                    ) : product.isFeatured ? (
                        <>
                            <Star className="w-4 h-4 fill-current" />
                            <span className="hidden sm:inline">Featured</span>
                        </>
                    ) : (
                        <>
                            <StarOff className="w-4 h-4" />
                            <span className="hidden sm:inline">Not Featured</span>
                        </>
                    )}
                </button>
            </td>
            <td>
                <div className="flex gap-1">
                    <div className="tooltip" data-tip="View Details">
                        <button 
                            className="btn btn-sm btn-ghost hover:btn-info"
                            onClick={() => onViewDetails?.(product)}
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="tooltip" data-tip="Edit Product">
                        <button 
                            className="btn btn-sm btn-ghost hover:btn-warning"
                            onClick={() => onEdit(product)}
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="tooltip" data-tip="Delete Product">
                        <button 
                            className="btn btn-sm btn-ghost hover:btn-error"
                            onClick={handleDelete}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                                <Trash2 className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    );
};

export { ProductRow };