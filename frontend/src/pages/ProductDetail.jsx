import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productStore } from '../storeData/productStore.js';
import Spinner from '../components/common/Spinner';
import PeopleAlsoBought from '../components/products/PeopleAlsoBought.jsx';
import Breadcrumbs from '../components/common/Breadcrumbs';
import useCartStore from '../storeData/cartStore.js';
import { userStore } from '../storeData/userStore.js';
import { toast } from 'react-hot-toast';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCartStore();
    const { user } = userStore();
    const { 
        products, // This is the actual products array
        isLoading, 
        getProductById, 
        fetchAllProducts, // This is the function
        recommendedProducts, 
    } = productStore();

    useEffect(() => {
        if (products.length === 0) {
            fetchAllProducts();
        }
        // Remove this line since fetchRecommendedProducts might not exist
        // fetchRecommendedProducts(id);
    }, [id, products.length, fetchAllProducts]);

    const product = getProductById(id);

    if (isLoading && !product) {
        return <div className="flex justify-center pt-20"><Spinner /></div>;
    }
    
    const handleAddToCart = () => {
        if (!user) {
            toast.error("Please log in to add items to your cart");
            return;
        } else {
            addToCart(product);
        }
    };

    if (!product) {
        return (
            <div className="text-center py-20">
                <h2 className="text-3xl font-bold">Product Not Found</h2>
                <Link to="/products" className="btn btn-primary mt-6">Back to Shop</Link>
            </div>
        );
    }

    const breadcrumbPaths = [
        { name: 'Home', link: '/' },
        { name: 'Products', link: '/store' },
        { name: product.productName, link: `/products/${id}` }
    ];

    // Filter out the current product from the recommendations
    const filteredProducts = products.filter(p => p._id !== id);
    
    // Optionally, limit to first 4-8 products for better performance
    const recommendedProductsToShow = filteredProducts.slice(0, 4);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-6">
                <Breadcrumbs paths={breadcrumbPaths} />
            </div>

            {/* Main Product Details Card */}
            <div className="card lg:card-side bg-base-100 shadow-xl">
                <figure className="lg:w-1/2 p-4 bg-white">
                    <img 
                        src={product.productImage || 'https://placehold.co/600x400?text=No+Image'} 
                        alt={product.productName} 
                        className="w-full h-96 object-contain rounded-lg"
                    />
                </figure>
                <div className="card-body lg:w-1/2">
                    <div className="badge badge-secondary">{product.productCategory}</div>
                    <h1 className="card-title text-4xl font-bold mt-2">{product.productName}</h1>
                    <p className="text-2xl text-primary font-semibold my-4">${product.productPrice.toFixed(2)}</p>
                    <p className="text-base-content/80">{product.productDescription}</p>
                    <div className="card-actions justify-end mt-6">
                        <button 
                            className="btn btn-primary btn-lg"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            {/* Recommended Products Section */}
            <div className="mt-16">
                <PeopleAlsoBought
                    products={recommendedProductsToShow} // Pass the actual products array
                    title="You Might Also Like"
                    subtitle="Explore other products that might interest you."
                />
            </div>
        </div>
    );
};

export default ProductDetail;