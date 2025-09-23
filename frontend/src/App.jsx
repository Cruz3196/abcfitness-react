import { Route, Routes } from "react-router-dom";

//context 
import { AuthProvider } from "./context/useAuth";

//components
import Navbar from "./components/common/Navbar"
import CTA from "./components/common/CTA";
import ProtectedRoute from "./components/common/ProtectedRoute";

//Authentication Pages
import LogIn from "./pages/LogIn"
import SignUp from "./pages/SignUp"
import ForgotPassword from "./pages/ForgotPassword"

//Pages 
import Home from "./pages/Home"
import Store from "./pages/Store";
import Classes from "./pages/Classes";
import Trainers from "./pages/Trainers";
import ProductDetail from "./pages/ProductDetail";
import ClassDetail from "./pages/ClassDetail";
import TrainerDetail from "./pages/TrainerDetail";
import ProfilePage from "./pages/ProfilePage";
import CartSummary from "./pages/CartSummary";
import AdminDashboard from "./pages/AdminDashboard";
import TrainerDashboard from "./pages/TrainerDashboard";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import BookingCancelPage from "./pages/BookingCancelPage";

//Container
import Container from "./components/common/Container";

function App() {
  return (
    <AuthProvider>
      <Container>
        <Navbar />
          <Routes>
          {/* Public Routes  */}
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/classes/:id" element={<ClassDetail />} />
            <Route path="/trainers" element={<Trainers />} />
            <Route path="/trainers/:id" element={<TrainerDetail />} />
            <Route path="/profile" element={<ProfilePage />} />
          
          {/* Cart Routes  */}
            <Route path="/cart" element={<CartSummary />} />
            <Route path="/purchase-success" element={<PurchaseSuccessPage />} />
            <Route path="/purchase-cancel" element={<PurchaseCancelPage />} />
            <Route path="/booking-success" element={<BookingSuccessPage />} />
            <Route path="/booking-cancel" element={<BookingCancelPage />} />


            {/* Protected Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/trainer" 
              element={
                <ProtectedRoute allowedRoles={['trainer']}>
                  <TrainerDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Authentication Routes */}
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        <CTA />
      </Container>
    </AuthProvider>
  )
}

export default App;