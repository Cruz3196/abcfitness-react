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
import { Star } from "lucide-react";

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

  // Render stars helper
  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-warning text-warning"
                : "text-base-content/30"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Breadcrumbs paths={breadcrumbPaths} />
      </div>

      {/* Main Product Details Card */}
      <div className="card lg:card-side bg-base-100 shadow-xl">
        <figure className="lg:w-1/2 p-4 bg-white">
          <img
            src={
              product.productImage ||
              "https://placehold.co/600x400?text=No+Image"
            }
            alt={product.productName}
            className="w-full h-96 object-contain rounded-lg"
          />
        </figure>
        <div className="card-body lg:w-1/2">
          <div className="badge badge-secondary">{product.productCategory}</div>
          <h1 className="card-title text-4xl font-bold mt-2">
            {product.productName}
          </h1>

          {/* Rating Display */}
          <div className="flex items-center gap-3 mt-2">
            {renderStars(Math.round(product.productRating || 0))}
            <span className="text-sm text-base-content/70">
              {product.productRating?.toFixed(1) || "0.0"} (
              {productReviews.length} reviews)
            </span>
          </div>

          <p className="text-2xl text-primary font-semibold my-4">
            ${product.productPrice.toFixed(2)}
          </p>
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

      {/* Reviews Section */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            <div className="flex items-center gap-2 mt-1">
              {renderStars(Math.round(product.productRating || 0))}
              <span className="text-sm text-base-content/70">
                {product.productRating?.toFixed(1) || "0.0"} out of 5 ·{" "}
                {productReviews.length}{" "}
                {productReviews.length === 1 ? "review" : "reviews"}
              </span>
            </div>
          </div>
        </div>

        {/* Review Form - Only show for logged in users who haven't reviewed */}
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
        <div>
          {reviewsLoading ? (
            <div className="flex justify-center py-12">
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
            <div className="text-center py-8 text-base-content/60">
              <p>
                No reviews yet.{" "}
                {user ? "Be the first to review this product!" : ""}
              </p>
            </div>
          )}
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
