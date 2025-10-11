import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { userStore } from "../../storeData/userStore";
import useCartStore from "../../storeData/cartStore";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
    const { user, logout, isAdmin, isTrainer } = userStore();
    const { total, totalQuantity } = useCartStore();

    const formattedTotal = total.toFixed(2);
    const totalItems = totalQuantity;

    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const getProfileLink = () => {
        if (!user) return "/profile";
        
        if (isAdmin()) return "/admindashboard";
        if (isTrainer()) return "/trainerdashboard";
        return "/profile";
    };

    const getProfileText = () => {
        if (!user) return "Profile";
        
        if (isAdmin()) return "Admin Dashboard";
        if (isTrainer()) return "Trainer Dashboard";
        return "Profile";
    };
    
    return (
        <motion.div 
            className="navbar px-6 sticky top-0 z-50 bg-base-100 shadow-md"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex-1 justify-start">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/" className="text-lg btn btn-ghost normal-case md:text-xl font-bold">
                        ABC Fitness
                    </Link>
                </motion.div>
                
                <div className="hidden lg:flex">
                    {[
                        { to: "/store", text: "Products" },
                        { to: "/classes", text: "Classes" },
                        { to: "/trainers", text: "Trainers" },
                    ].map((link) => (
                        <motion.div key={link.to} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link to={link.to} className="btn btn-ghost normal-case text-md">
                                {link.text}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="flex-none gap-0 sm:gap-2">
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Mobile Menu */}
                <div className="dropdown dropdown-end lg:hidden">
                    <label tabIndex={0} className="btn btn-ghost btn-circle">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow rounded-box w-52 bg-base-100 border border-base-300">
                        <li><Link to="/store">Products</Link></li>
                        <li><Link to="/classes">Classes</Link></li>
                        <li><Link to="/trainers">Trainers</Link></li>
                    </ul>
                </div>

                {/* Cart for customers only */}
                {user && !isAdmin() && !isTrainer() && (
                    <div className="dropdown dropdown-end">
                        <motion.label 
                            tabIndex={0} 
                            className="btn btn-ghost btn-circle"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="indicator">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {totalItems > 0 && (
                                    <motion.span 
                                        className="badge badge-sm indicator-item badge-secondary"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        key={totalItems}
                                    >
                                        {totalItems}
                                    </motion.span>
                                )}
                            </div>
                        </motion.label>
                        <motion.div 
                            tabIndex={0} 
                            className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow-xl border border-base-300"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="card-body">
                                <span className="font-bold text-lg">{totalItems} Items</span>
                                <span className="text-info">Subtotal: ${formattedTotal}</span>
                                <div className="card-actions">
                                    <Link to="/cart" className="w-full">
                                        <motion.button 
                                            className="btn btn-primary btn-block"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            View cart
                                        </motion.button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
                
                {/* User Menu */}
                {user ? (
                    <div className="dropdown dropdown-end">
                        <motion.label 
                            tabIndex={0} 
                            className="btn btn-ghost gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="avatar placeholder">
                                <div className="bg-neutral text-neutral-content rounded-full w-8">
                                    <span className="text-xs">
                                        {user.username?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </div>
                            </div>
                            <span className="hidden sm:inline">{user.username}</span>
                            {isAdmin() && <span className="badge badge-secondary badge-sm">Admin</span>}
                            {isTrainer() && <span className="badge badge-primary badge-sm">Trainer</span>}
                        </motion.label>
                        <motion.ul 
                            tabIndex={0} 
                            className="dropdown-content menu p-2 shadow-xl bg-base-100 rounded-box w-52 border border-base-300"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <li>
                                <Link to={getProfileLink()} className="flex items-center gap-2">
                                    <span>{getProfileText()}</span>
                                </Link>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="flex items-center gap-2 text-error">
                                    <span>Logout</span>
                                </button>
                            </li>
                        </motion.ul>
                    </div>
                ) : (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to="/login" className="btn btn-secondary btn-sm">
                            Login
                        </Link>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default Navbar;