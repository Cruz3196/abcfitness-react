import { useEffect } from 'react';
import { productStore } from '../storeData/productStore.js'; 
import FeaturedProducts from '../components/products/FeaturedProducts';
import Hero from '../components/common/Hero';
import Classes from '../components/classes/OurClasses'; 
import Spinner from '../components/common/Spinner';

const Home = () => {
    // Get the data and loading state from your store
    const { products, isLoading, fetchAllProducts } = productStore();

    // Fetch the data when the page loads
    useEffect(() => {
        fetchAllProducts();
    }, [fetchAllProducts]);

    // Create a list of "featured" products to display
    const featuredProducts = products.slice(0, 4);

    return (
        <>
            <Hero />
            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    {/* Passing the title and products as props */}
                    <FeaturedProducts 
                        products={featuredProducts} 
                        title="Our Featured Products"
                        subtitle="Hand-picked selection of top-quality items to kickstart your fitness journey."
                    />
                    <Classes
                        // ... you would do the same for classes
                    />
                </>
            )}
        </>
    );
};

export default Home;