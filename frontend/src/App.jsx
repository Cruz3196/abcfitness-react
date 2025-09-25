import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { userStore } from "./storeData/userStore";
import { useEffect } from "react";

//components
import Navbar from "./components/common/Navbar"
import CTA from "./components/common/CTA";
import ProtectedRoute from "./components/common/ProtectedRoute";

//Authentication Pages
import LogIn from "./pages/LogIn"
import SignUp from "./pages/SignUp"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPasswordPage from "./pages/ResetPasswordPage";

//PUBLIC PAGES
import Home from "./pages/Home"
import Store from "./pages/Store";
import Classes from "./pages/Classes";
import Trainers from "./pages/Trainers";
import ProductDetail from "./pages/ProductDetail";
import ClassDetail from "./pages/ClassDetail";
import TrainerDetail from "./pages/TrainerDetail";

// USER PAGES
import ProfilePage from "./pages/ProfilePage";

// ADMIN PAGES
import AdminDashboard from "./pages/AdminDashboard";

// TRAINER PAGES 
import TrainerDashboard from "./pages/TrainerDashboard";
import TrainerProfileSetup from "./pages/TrainerProfileSetup";
import TrainerClassDetail from "./pages/TrainerClassDetail";

// Payment Pages
import CartSummary from "./pages/CartSummary";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import BookingCancelPage from "./pages/BookingCancelPage";

//Container
import Container from "./components/common/Container";

function App() {
  const { user, checkAuthStatus } = userStore();
  
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <>
      <Container>
        <Navbar /> 
          <Routes>

            {/* Authentication Routes */}
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* Public Routes  */}
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/classes/:id" element={<ClassDetail />} />
            <Route path="/trainers" element={<Trainers />} />
            <Route path="/trainers/:id" element={<TrainerDetail />} />
          
          {/* Cart Routes  */}
            <Route path="/cart" element={<CartSummary />} />
            <Route path="/purchase-success" element={<PurchaseSuccessPage />} />
            <Route path="/purchase-cancel" element={<PurchaseCancelPage />} />
            <Route path="/booking-success" element={<BookingSuccessPage />} />
            <Route path="/booking-cancel" element={<BookingCancelPage />} />

            {/* Protected Routes */}
            <Route 
              path="/admindashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/trainerdashboard" 
              element={
                <ProtectedRoute allowedRoles={['trainer']}>
                  <TrainerDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Trainer Profile Setup Route */}
            <Route 
              path="/trainer-setup" 
              element={
                <ProtectedRoute allowedRoles={['trainer']}>
                  <TrainerProfileSetup />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/trainer/my-classes/:classId" 
              element={
                <ProtectedRoute allowedRoles={['trainer']}>
                  <TrainerClassDetail />
                </ProtectedRoute>
              } 
            />

            {/* Protected Profile Route */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        <CTA />
      </Container>
      <Toaster position="top-center" reverseOrder={false} toastOptions={{duration: 4000,}}/> {/* Toast notifications */}
    </>
  )
}

export default App;