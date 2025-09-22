import { useState } from 'react';
import ProductCard from '../components/products/ProductCard';
import CategorySidebar from '../components/store/sideBar';
import Spinner from '../components/common/Spinner';

// --- MOCK DATA ---
// This static data replaces the need to fetch from the backend for now.
const mockProducts = [
    { _id: '1', productName: 'Premium Yoga Mat', productPrice: 49.99, productCategory: 'Yoga', productImage: 'https://placehold.co/400x225/A3E635/000000?text=Yoga+Mat' },
    { _id: '2', productName: 'Adjustable Dumbbells', productPrice: 129.99, productCategory: 'Strength', productImage: 'https://placehold.co/400x225/F97316/FFFFFF?text=Dumbbells' },
    { _id: '3', productName: 'Running Shoes', productPrice: 89.99, productCategory: 'Cardio', productImage: 'https://placehold.co/400x225/3B82F6/FFFFFF?text=Shoes' },
    { _id: '4', productName: 'Protein Powder', productPrice: 39.99, productCategory: 'Supplements', productImage: 'https://placehold.co/400x225/FACC15/000000?text=Protein' },
    { _id: '5', productName: 'Resistance Bands Set', productPrice: 24.99, productCategory: 'Strength', productImage: 'https://placehold.co/400x225/EC4899/FFFFFF?text=Bands' },
    { _id: '6', productName: 'Fitness Tracker', productPrice: 99.99, productCategory: 'Accessories', productImage: 'https://placehold.co/400x225/6366F1/FFFFFF?text=Tracker' },
];

const mockCategories = ['Yoga', 'Strength', 'Cardio', 'Supplements', 'Accessories'];
// --- END MOCK DATA ---


const ProductsPage = () => {
    // We no longer need to fetch data, so we use the mock data directly.
    const products = mockProducts;
    const categories = mockCategories;
    const isLoading = false; // Set to false as we are not loading data.

    const [selectedCategories, setSelectedCategories] = useState([]);

    const handleCategoryChange = (category) => {
        if (category === '__CLEAR__') {
            setSelectedCategories([]);
            return;
        }
        setSelectedCategories(prev =>
        prev.includes(category)
            ? prev.filter(c => c !== category)
            : [...prev, category]
        );
    };

    const filteredProducts = selectedCategories.length > 0
        ? products.filter(p => selectedCategories.includes(p.productCategory))
        : products;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="hero min-h-[30vh] bg-base-200 rounded-box mb-12">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                    <h1 className="text-5xl font-bold">Shop</h1>
                    <p className="py-6">Browse our collection of high-quality fitness products and apparel to support your journey.</p>
                    </div>
                </div>
            </div>
        
            <div className="flex flex-col md:flex-row gap-8">
                <CategorySidebar 
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
                />
                
                <div className="flex-grow">
                {isLoading ? (
                    <div className="flex justify-center pt-20"><Spinner /></div>
                ) : (
                    <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map(product => (
                        <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                    {filteredProducts.length === 0 && !isLoading && (
                        <div className="text-center text-base-content/60 py-20 col-span-full">
                        <p>No products found matching your selected filters.</p>
                        </div>
                    )}
                    </>
                )}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;

