import { Link } from "react-router-dom";
import useCartStore from "../../storeData/cartStore";
import { userStore } from "../../storeData/userStore";
import { toast } from "react-hot-toast";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => {
  const { user } = userStore();
  const { addToCart } = useCartStore();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to add items to your cart");
      return;
    }
    addToCart(product);
  };

  return (
    <div className="card bg-base-100 border border-base-300 hover:border-primary/50 transition-colors">
      <Link to={`/product/${product._id}`}>
        <figure>
          <img
            src={
              product.productImage ||
              "https://placehold.co/400x300?text=No+Image"
            }
            alt={product.productName}
            className="h-48 w-full object-cover"
            loading="lazy"
          />
        </figure>
      </Link>

      <div className="card-body p-4">
        {product.productCategory && (
          <span className="text-xs text-base-content/60 uppercase tracking-wide">
            {product.productCategory}
          </span>
        )}

        <Link to={`/product/${product._id}`}>
          <h2 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
            {product.productName}
          </h2>
        </Link>

        <p className="text-lg font-bold mt-1">
          ${product.productPrice.toFixed(2)}
        </p>

        <button
          className="btn btn-primary btn-md mt-3 gap-2"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
