import { Link, useNavigate } from "react-router-dom";
import { userStore } from "../../storeData/userStore";
import toast from "react-hot-toast";

const Navbar = () => {
    const { user, logout, isAdmin, isTrainer } = userStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        toast.success("Logged out successfully");
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
    <div className="navbar bg-black text-white px-6">
        <div className="flex-1 justify-start">
            <Link to="/" className="btn btn-ghost normal-case text-xl">ABC Fitness</Link>
            <Link to="/store" className="btn btn-ghost normal-case text-md">Products</Link>
            <Link to="/classes" className="btn btn-ghost normal-case text-md">Classes</Link>
            <Link to="/trainers" className="btn btn-ghost normal-case text-md">Trainers</Link>
        </div>
        <div className="flex-none">
            {/* --- Updated condition to hide cart for Admins and Trainers --- */}
            {user && !isAdmin() && !isTrainer() && (
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle">
                        <div className="indicator">
                        <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        <span className="badge badge-sm indicator-item">8</span>
                        </div>
                    </label>
                    <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
                        <div className="card-body">
                        <span className="font-bold text-lg text-black">8 Items</span>
                        <span className="text-info">Subtotal: $999</span>
                        <div className="card-actions">
                            <Link to="/cart"><button className="btn btn-primary btn-block">View cart</button></Link>
                        </div>
                        </div>
                    </div>
                </div>
            )}
            
            {user ? (
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost">
                        {user.username}
                        {isAdmin() && <span className="badge badge-secondary badge-sm ml-2">Admin</span>}
                        {isTrainer() && <span className="badge badge-primary badge-sm ml-2">Trainer</span>}
                    </label>
                    <div tabIndex={0} className="dropdown-content menu bg-black p-2 shadow rounded-box w-52">
                        <Link 
                            to={getProfileLink()} 
                            className="block px-4 py-2 text-white hover:text-gray-300"
                        >
                            {getProfileText()}
                        </Link>
                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-white hover:text-gray-300">Logout</button>
                    </div>
                </div>
            ) : (
                <Link to="/login" className="btn btn-primary">Login</Link>
            )}
        </div>
    </div>
    )
}

export default Navbar;