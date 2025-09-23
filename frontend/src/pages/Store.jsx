import { useState } from 'react';
import ProductCard from '../components/products/ProductCard';
import CategorySidebar from '../components/store/sideBar';
import Spinner from '../components/common/Spinner';
import { productStore } from '../storeData/productStore';

const Store = () => {
    // Use the productStore instead of mock data
    const { products, categories, isLoading } = productStore();
    
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

export default Store;