import FeaturedProducts from '../components/products/FeaturedProducts';
import Hero from '../components/common/Hero';
import Classes from '../components/classes/OurClasses';

// --- MOCK DATA for testing the UI without a backend ---
const mockFeaturedProducts = [
    { _id: '1', productName: 'Premium Yoga Mat', productPrice: 49.99, productImage: 'https://placehold.co/400x225/A3E635/000000?text=Yoga+Mat' },
    { _id: '2', productName: 'Adjustable Dumbbells', productPrice: 129.99, productImage: 'https://placehold.co/400x225/F97316/FFFFFF?text=Dumbbells' },
    { _id: '3', productName: 'Running Shoes', productPrice: 89.99, productImage: 'https://placehold.co/400x225/3B82F6/FFFFFF?text=Shoes' },
];

const mockCategoryProducts = [
    { _id: '4', productName: 'Protein Powder', productPrice: 39.99, productImage: 'https://placehold.co/400x225/FACC15/000000?text=Protein' },
    { _id: '5', productName: 'Resistance Bands Set', productPrice: 24.99, productImage: 'https://placehold.co/400x225/EC4899/FFFFFF?text=Bands' },
    { _id: '6', productName: 'Fitness Tracker', productPrice: 99.99, productImage: 'https://placehold.co/400x225/6366F1/FFFFFF?text=Tracker' },
];

const mockClasses = [
    { _id: 'class1', classTitle: 'Vinyasa Flow Yoga', classPic: 'https://placehold.co/400x225/6D28D9/FFFFFF?text=Yoga', trainer: { user: { username: 'Jane Doe' } } },
    { _id: 'class2', classTitle: 'Advanced CrossFit', classPic: 'https://placehold.co/400x225/BE123C/FFFFFF?text=CrossFit', trainer: { user: { username: 'John Smith' } } },
    { _id: 'class3', classTitle: 'HIIT Cardio Blast', classPic: 'https://placehold.co/400x225/047857/FFFFFF?text=HIIT', trainer: { user: { username: 'Emily White' } } },
];

const Home = () => {
    // In the future, you would fetch this data using your Zustand stores.
    const featured = mockFeaturedProducts;
    const byCategory = mockCategoryProducts;

    return (
        <>
            <Hero />
            {/* You can reuse the FeaturedProducts component for different sections */}
            <FeaturedProducts 
                products={featured} 
                title="Our Featured Products"
                subtitle="Hand-picked selection of top-quality items to kickstart your fitness journey."
            />
            <FeaturedProducts 
                products={byCategory} 
                title="Shop by Category"
                subtitle="Explore our diverse range of products across various categories."
            />
            {/* You can add your <OurClasses /> component here as well */}
            <Classes
                classes={mockClasses}
                title="Explore Our Classes"
                subtitle="Find the perfect class to match your fitness goals and schedule."
            />
        </>
    )
}

export default Home;
