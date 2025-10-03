import React, { useState } from 'react';
import { Upload } from 'lucide-react';

const ImageUpload = ({ currentImage, onImageChange, label = "Image" }) => {
    const [imagePreview, setImagePreview] = useState(currentImage || '');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setImagePreview(base64String);
                onImageChange(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleResetImage = () => {
        setImagePreview(currentImage || '');
        onImageChange(currentImage || '');
    };

    const handleRemoveImage = () => {
        setImagePreview('');
        onImageChange('');
    };

    return (
        <div className="form-control">
            <label className="label">
                <span className="label-text font-semibold">{label}</span>
            </label>
            <div className="flex flex-col gap-4">
                {/* Preview Image */}
                <div className="flex justify-center">
                    <div className="relative">
                        <img 
                            src={imagePreview || 'https://placehold.co/400x200?text=No+Image'} 
                            alt="Preview" 
                            className="w-full max-w-md h-48 object-cover rounded-lg border"
                        />
                    </div>
                </div>

                {/* Image Controls */}
                <div className="flex flex-wrap gap-2 justify-center">
                    <label className="btn btn-outline btn-sm gap-2">
                        <Upload size={16} />
                        Upload New Image
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                    
                    {imagePreview !== currentImage && (
                        <button 
                            type="button"
                            onClick={handleResetImage}
                            className="btn btn-ghost btn-sm"
                        >
                            Reset to Original
                        </button>
                    )}
                    
                    {imagePreview && (
                        <button 
                            type="button"
                            onClick={handleRemoveImage}
                            className="btn btn-error btn-outline btn-sm"
                        >
                            Remove Image
                        </button>
                    )}
                </div>
                
                <div className="text-xs text-base-content/60 text-center">
                    Supported formats: JPG, PNG, GIF. Max size: 5MB
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;