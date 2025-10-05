import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Image, Upload } from 'lucide-react';
import { productStore } from '../../storeData/productStore';

const ProductEditForm = ({ product, onClose}) => {
  const { updateProduct, isLoading, categories } = productStore();
  const [formData, setFormData] = useState({
    productName: product.productName || '',
    productDescription: product.productDescription || '',
    productPrice: product.productPrice || '',
    productCategory: product.productCategory || '',
    productImage: product.productImage || null
  });
  const [previewUrl, setPreviewUrl] = useState(product.productImage || '');
  const [newCategory, setNewCategory] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setErrors({...errors, productImage: 'Please select an image file'});
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
      setFormData({
        ...formData,
        productImage: reader.result
      });
    };
    reader.readAsDataURL(file);
    
    if (errors.productImage) {
      setErrors({...errors, productImage: ''});
    }
  };

  const handleCategoryChange = (e) => {
    setFormData({
      ...formData,
      productCategory: e.target.value
    });
  };

  const addNewCategory = () => {
    if (!newCategory.trim()) return;
    
    setFormData({
      ...formData,
      productCategory: newCategory.trim()
    });
    setNewCategory('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.productName) newErrors.productName = 'Product name is required';
    if (!formData.productDescription) newErrors.productDescription = 'Description is required';
    if (!formData.productPrice) newErrors.productPrice = 'Price is required';
    if (!formData.productCategory) newErrors.productCategory = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      const productData = {
        ...formData,
        productPrice: parseFloat(formData.productPrice)
      };
      
      const result = await updateProduct(product._id, productData);
      if (result) {
        onClose();
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <motion.div 
        className="bg-base-100 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Edit Product</h2>
          <button onClick={onClose} className="btn btn-sm btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Product Name</span>
            </label>
            <input
              type="text"
              name="productName"
              className={`input input-bordered ${errors.productName ? 'input-error' : ''}`}
              value={formData.productName}
              onChange={handleChange}
            />
            {errors.productName && (
              <span className="text-error text-xs mt-1">{errors.productName}</span>
            )}
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="productDescription"
              className={`textarea textarea-bordered h-24 ${errors.productDescription ? 'textarea-error' : ''}`}
              value={formData.productDescription}
              onChange={handleChange}
            />
            {errors.productDescription && (
              <span className="text-error text-xs mt-1">{errors.productDescription}</span>
            )}
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Price</span>
            </label>
            <div className="input-group">
              <span className="bg-base-300 flex items-center px-3">$</span>
              <input
                type="number"
                name="productPrice"
                step="0.01"
                min="0"
                className={`input input-bordered w-full ${errors.productPrice ? 'input-error' : ''}`}
                value={formData.productPrice}
                onChange={handleChange}
              />
            </div>
            {errors.productPrice && (
              <span className="text-error text-xs mt-1">{errors.productPrice}</span>
            )}
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <select
              name="productCategory"
              className={`select select-bordered w-full ${errors.productCategory ? 'select-error' : ''}`}
              value={formData.productCategory}
              onChange={handleCategoryChange}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <div className="flex items-center mt-2 gap-2">
              <input
                type="text"
                placeholder="Or add a new category"
                className="input input-bordered w-full input-sm"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button 
                type="button" 
                className="btn btn-sm btn-secondary"
                onClick={addNewCategory}
                disabled={!newCategory.trim()}
              >
                Add
              </button>
            </div>
            
            {errors.productCategory && (
              <span className="text-error text-xs mt-1">{errors.productCategory}</span>
            )}
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Product Image</span>
            </label>
            <div className="border-2 border-dashed border-base-300 rounded-lg p-4 text-center">
              {!previewUrl ? (
                <div className="flex flex-col items-center">
                  <Image className="w-12 h-12 text-base-300 mb-2" />
                  <p className="text-base-content/70 mb-2">Drop an image or click to browse</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="product-image-edit"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="product-image-edit" className="btn btn-sm btn-outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Product preview"
                    className="max-h-40 mx-auto rounded"
                  />
                  <button
                    type="button"
                    className="btn btn-circle btn-sm btn-error absolute top-0 right-0"
                    onClick={() => {
                      setPreviewUrl('');
                      setFormData({...formData, productImage: null});
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button 
              type="submit" 
              className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              Update Product
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductEditForm;