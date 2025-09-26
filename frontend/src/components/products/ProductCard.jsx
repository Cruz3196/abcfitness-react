import { Link } from 'react-router-dom';
// import { useCartStore } from '../../store/cartStore';

const ProductCard = ({ product }) => {
    // const addToCart = useCartStore((state) => state.addToCart);

    return (
        <div className="card card-compact w-full bg-base-100 shadow-xl transition-transform duration-300 hover:scale-105">
            <Link to={`/product/${product._id}`}>
                <figure>
                    <img
                        src={product.productImage || 'https://placehold.co/400x225?text=No+Image'}
                        alt={product.productName}
                        className="h-48 w-full object-cover"
                        loading="lazy" // ✅ ADD THIS LINE
                        width="400" // Optional: Add dimensions to prevent layout shift
                        height="225" // Optional: Add dimensions to prevent layout shift
                    />
                </figure>
            </Link>

            <div className="card-body">
                <h2 className="card-title truncate" title={product.productName}>
                    <Link to={`/product/${product._id}`} className="hover:text-primary">
                        {product.productName}
                    </Link>
                </h2>
                <p className="text-lg font-semibold">${product.productPrice.toFixed(2)}</p>
                <div className="card-actions justify-end">
                    <button
                        // onClick={() => addToCart(product._id)}
                        className="btn btn-primary"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;