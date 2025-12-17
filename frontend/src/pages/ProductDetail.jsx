import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { productStore } from "../storeData/productStore.js";
import Spinner from "../components/common/Spinner";
import PeopleAlsoBought from "../components/products/PeopleAlsoBought.jsx";
import Breadcrumbs from "../components/common/Breadcrumbs";
import ProductReviewForm from "../components/products/ProductReviewForm.jsx";
import ProductReviewCard from "../components/products/ProductReviewCard.jsx";
import useCartStore from "../storeData/cartStore.js";
import { userStore } from "../storeData/userStore.js";
import { toast } from "react-hot-toast";
import { Star, ShoppingCart, Check } from "lucide-react";

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
    // Review-related state and functions
    productReviews,
    reviewsLoading,
    reviewSubmitting,
    fetchProductReviews,
    submitProductReview,
    updateProductReview,
    deleteProductReview,
    hasUserReviewed,
    clearProductReviews,
  } = productStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchAllProducts();
    }
    // Fetch reviews when product ID changes
    fetchProductReviews(id);

    // Cleanup reviews when leaving the page
    return () => clearProductReviews();
  }, [
    id,
    products.length,
    fetchAllProducts,
    fetchProductReviews,
    clearProductReviews,
  ]);

  const product = getProductById(id);

  if (isLoading && !product) {
    return (
      <div className="flex justify-center pt-20">
        <Spinner />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please log in to add items to your cart");
      return;
    } else {
      addToCart(product);
    }
  };

  // Review handlers
  const handleSubmitReview = async (reviewData) => {
    return await submitProductReview(id, reviewData);
  };

  const handleUpdateReview = async (reviewId, updateData) => {
    return await updateProductReview(id, reviewId, updateData);
  };

  const handleDeleteReview = async (reviewId) => {
    return await deleteProductReview(id, reviewId);
  };

  const userHasReviewed = user ? hasUserReviewed(user._id) : false;

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold">Product Not Found</h2>
        <Link to="/products" className="btn btn-primary mt-6">
          Back to Shop
        </Link>
      </div>
    );
  }

  const breadcrumbPaths = [
    { name: "Home", link: "/" },
    { name: "Products", link: "/store" },
    { name: product.productName, link: `/products/${id}` },
  ];

  // Filter out the current product from the recommendations
  const filteredProducts = products.filter((p) => p._id !== id);

  // Optionally, limit to first 4-8 products for better performance
  const recommendedProductsToShow = filteredProducts.slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-4">
        <Breadcrumbs paths={breadcrumbPaths} />
      </div>

      {/* Main Product Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="bg-white rounded-lg p-4 border border-base-300">
          <img
            src={
              product.productImage ||
              "https://placehold.co/600x600?text=No+Image"
            }
            alt={product.productName}
            className="w-full h-auto max-h-[500px] object-contain"
          />
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm text-base-content/60 uppercase tracking-wide mb-1">
            {product.productCategory}
          </p>

          <h1 className="text-2xl font-medium mb-2">{product.productName}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(product.productRating || 0)
                      ? "fill-warning text-warning"
                      : "text-base-content/20"
                  }`}
                />
              ))}
            </div>
            <Link
              to="#reviews"
              className="text-sm text-primary hover:underline"
            >
              {productReviews.length}{" "}
              {productReviews.length === 1 ? "review" : "reviews"}
            </Link>
          </div>

          <div className="border-t border-base-300 pt-4 mb-4">
            <span className="text-3xl font-bold">
              ${product.productPrice.toFixed(2)}
            </span>
          </div>

          <p className="text-base-content/70 mb-6 leading-relaxed">
            {product.productDescription}
          </p>

          <div className="flex items-center gap-2 text-sm text-success mb-4">
            <Check className="w-4 h-4" />
            <span>In Stock</span>
          </div>

          <button
            className="btn btn-primary gap-2 w-full sm:w-auto"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div id="reviews" className="border-t border-base-300 pt-8">
        <h2 className="text-xl font-medium mb-1">Customer Reviews</h2>
        <div className="flex items-center gap-2 mb-6">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(product.productRating || 0)
                    ? "fill-warning text-warning"
                    : "text-base-content/20"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-base-content/60">
            {product.productRating?.toFixed(1) || "0.0"} out of 5 ·{" "}
            {productReviews.length}{" "}
            {productReviews.length === 1 ? "review" : "reviews"}
          </span>
        </div>

        {/* Review Form */}
        {user && !userHasReviewed && (
          <div className="mb-8">
            <ProductReviewForm
              productId={id}
              onSubmit={handleSubmitReview}
              isSubmitting={reviewSubmitting}
            />
          </div>
        )}

        {/* Reviews List */}
        {reviewsLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : productReviews.length > 0 ? (
          <div className="space-y-4">
            {productReviews.map((review) => (
              <ProductReviewCard
                key={review._id}
                review={review}
                currentUser={user}
                onUpdate={handleUpdateReview}
                onDelete={handleDeleteReview}
                isSubmitting={reviewSubmitting}
              />
            ))}
          </div>
        ) : (
          <p className="text-center py-6 text-base-content/50">
            No reviews yet. {user ? "Be the first to review!" : ""}
          </p>
        )}
      </div>

      {/* Recommended Products */}
      <div className="border-t border-base-300 mt-12 pt-8">
        <PeopleAlsoBought
          products={recommendedProductsToShow}
          title="You Might Also Like"
          subtitle="Explore other products that might interest you."
        />
      </div>
    </div>
  );
};

export default ProductDetail;
