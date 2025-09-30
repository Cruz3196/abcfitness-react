import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';

// ✅ FIXED: The component now accepts and uses the 'title' and 'subtitle' props.
const FeaturedProducts = ({ products, title, subtitle }) => {
    if (!products || products.length === 0) {
        return null; 
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center my-8">
                {/* It now displays the title passed in from the parent page */}
                <h2 className="text-3xl font-bold">{title}</h2>
                <p className="text-gray-400 mt-4 max-w-2xl mx-auto">{subtitle}</p>
                <Link to="/store">
                    <button className="btn btn-primary mt-7">Shop Now</button>
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 place-content-evenly gap-4">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default FeaturedProducts;

