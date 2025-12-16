import { Link } from "react-router-dom";
import useCartStore from "../../storeData/cartStore";
import { userStore } from "../../storeData/userStore";
import { toast } from "react-hot-toast";

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
  };

  return (
    <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden rounded-2xl border border-base-300/50">
      <Link to={`/product/${product._id}`} className="relative overflow-hidden">
        <figure className="relative">
          <img
            src={
              product.productImage ||
              "https://placehold.co/400x225?text=No+Image"
            }
            alt={product.productName}
            className="h-72 w-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            width="400"
            height="225"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base-300/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </figure>
        {/* Category badge */}
        {product.productCategory && (
          <span className="absolute top-3 left-3 badge badge-primary badge-sm font-medium shadow-md">
            {product.productCategory}
          </span>
        )}
      </Link>

      <div className="card-body p-5">
        <h2
          className="card-title text-base font-semibold line-clamp-2 min-h-[3rem]"
          title={product.productName}
        >
          <Link
            to={`/product/${product._id}`}
            className="hover:text-primary transition-colors duration-200"
          >
            {product.productName}
          </Link>
        </h2>

        <div className="flex items-center justify-between mt-2">
          <p className="text-xl font-bold text-primary">
            ${product.productPrice.toFixed(2)}
          </p>
        </div>

        <div className="card-actions mt-4">
          <button
            className="btn btn-primary btn-block gap-2 group/btn"
            onClick={handleAddToCart}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 group-hover/btn:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
