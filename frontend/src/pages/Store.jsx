import { useState, useEffect } from 'react';
import ProductCard from '../components/products/ProductCard';
import CategorySidebar from '../components/store/sideBar';
import Spinner from '../components/common/Spinner';
import { productStore } from '../storeData/productStore';

const PRODUCTS_PER_PAGE = 9;

const Store = () => {
    const { products, categories, isLoading, fetchAllProducts } = productStore(); // Assuming fetchAllProducts is in your store
    
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // ✅ State for current page

    // Fetch products when the component mounts
    useEffect(() => {
        // This ensures products are loaded if they haven't been already.
        // If your store already handles this elsewhere, you might not need this.
        if (products.length === 0) {
            fetchAllProducts();
        }
    }, [products.length, fetchAllProducts]);

    const handleCategoryChange = (category) => {
        if (category === '__CLEAR__') {
            setSelectedCategories([]);
        } else {
            setSelectedCategories(prev =>
                prev.includes(category)
                    ? prev.filter(c => c !== category)
                    : [...prev, category]
            );
        }
        setCurrentPage(1); 
    };

    // First, filter the products based on category
    const filteredProducts = selectedCategories.length > 0
        ? products.filter(p => selectedCategories.includes(p.productCategory))
        : products;


    const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
    const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="hero min-h-[30vh] bg-base-200 rounded-box mb-12">
                <div className="hero-content text-center">
                    <div className="max-w-lg">
                        <h1 className="text-5xl font-bold mb-4">Store</h1>
                        <p className="text-lg text-base-content/70">
                            Explore our wide range of fitness products designed to help you achieve your health goals. Whether you're a beginner or a seasoned athlete, we have something for everyone.
                        </p>
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
                                {/* Mapping over the `currentProducts` for the page */}
                                {currentProducts.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>

                            {/* No products message */}
                            {filteredProducts.length === 0 && !isLoading && (
                                <div className="text-center text-base-content/60 py-20 col-span-full">
                                    <p>No products found matching your selected filters.</p>
                                </div>
                            )}

                            {/* PAGINATION CONTROLS */}
                            {totalPages > 1 && (
                                <div className="join mt-12 flex justify-center">
                                    {[...Array(totalPages).keys()].map(number => (
                                        <button
                                            key={number + 1}
                                            onClick={() => setCurrentPage(number + 1)}
                                            className={`join-item btn ${currentPage === number + 1 ? 'btn-active' : ''}`}
                                        >
                                            {number + 1}
                                        </button>
                                    ))}
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