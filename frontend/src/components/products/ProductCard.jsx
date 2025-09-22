// This component is a reusable card for displaying a single product.
// It is styled using DaisyUI's card component for a clean, modern look.
const ProductCard = ({ product }) => {
    return (
        <div className="card card-compact w-full bg-base-100 shadow-xl transition-transform duration-300 hover:scale-105">
            <figure>
                <img 
                src={product.productImage || 'https://placehold.co/400x225?text=No+Image'} 
                alt={product.productName}
                className="h-48 w-full object-cover" 
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title truncate" title={product.productName}>
                {product.productName}
                </h2>
                <p className="text-lg font-semibold">${product.productPrice.toFixed(2)}</p>
                <div className="card-actions justify-end">
                <button 
                    // This onClick handler is ready for when you connect your cart store
                    onClick={() => console.log(`Added ${product.productName} to cart`)}
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

