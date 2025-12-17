import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FeaturedProducts = ({ products, title, subtitle }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-medium">{title}</h2>
          {subtitle && (
            <p className="text-sm text-base-content/60 mt-1">{subtitle}</p>
          )}
        </div>
        <Link
          to="/store"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          See all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
