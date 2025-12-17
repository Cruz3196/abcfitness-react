import { useState, useEffect } from "react";
import ProductCard from "../components/products/ProductCard";
import CategorySidebar from "../components/store/sideBar";
import Spinner from "../components/common/Spinner";
import { productStore } from "../storeData/productStore";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PRODUCTS_PER_PAGE = 12;

const Store = () => {
  const { products, categories, isLoading, fetchAllProducts } = productStore();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (products.length === 0) {
      fetchAllProducts();
    }
  }, [products.length, fetchAllProducts]);

  const handleCategoryChange = (category) => {
    if (category === "__CLEAR__") {
      setSelectedCategories([]);
    } else {
      setSelectedCategories((prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category]
      );
    }
    setCurrentPage(1);
  };

  const filteredProducts =
    selectedCategories.length > 0
      ? products.filter((p) => selectedCategories.includes(p.productCategory))
      : products;

  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium">Shop</h1>
        <p className="text-sm text-base-content/60 mt-1">
          {filteredProducts.length} product
          {filteredProducts.length !== 1 ? "s" : ""}
          {selectedCategories.length > 0 &&
            ` in ${selectedCategories.join(", ")}`}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <CategorySidebar
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
        />

        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center pt-20">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {filteredProducts.length === 0 && !isLoading && (
                <p className="text-center text-base-content/50 py-12">
                  No products found.
                </p>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="btn btn-sm btn-ghost"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="btn btn-sm btn-ghost"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Store;
