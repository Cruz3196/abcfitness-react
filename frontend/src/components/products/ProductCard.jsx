import { Link } from 'react-router-dom';
import useCartStore from '../../storeData/cartStore';
import {userStore} from '../../storeData/userStore';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const { user } = userStore();
    const { addToCart } = useCartStore();

    const handleAddToCart = () => {
        // if the user is not logged, then alert a message
        if (!user) {
            toast.error("Please log in to add items to your cart");
            return;
        } else {
            // if user is logged in, then add to cart
            addToCart(product);
        }
    }


    return (
        <div className="card w-87 card-compact bg-base-200 shadow-md transition-transform duration-300">
            <Link to={`/product/${product._id}`}>
                <figure>
                    <img
                        src={product.productImage || 'https://placehold.co/400x225?text=No+Image'}
                        alt={product.productName}
                        className="h-80 w-full object-scale-down"
                        loading="lazy" 
                        width="400" 
                        height="225" 
                    />
                </figure>
            </Link>

            <div className="card-body">
                <h2 className="card-title text-wrap font-light" title={product.productName}>
                    <Link to={`/product/${product._id}`} className="hover:text-primary">
                        {product.productName}
                    </Link>
                </h2>
                <p className="text-lg font-semibold">${product.productPrice.toFixed(2)}</p>
                <div className="card-actions justify-start items-start">
                    <button
                        // onClick={() => addToCart(product._id)}
                        className="btn btn-primary btn-md"
                        onClick={handleAddToCart}
                    >
                        Add to Bag
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;