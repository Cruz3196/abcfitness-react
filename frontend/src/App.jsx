import { Route, Routes } from "react-router-dom";


//components
import Navbar from "./components/common/Navbar"
import CTA from "./components/common/CTA";

//Pages 
import Home from "./pages/Home"
import Store from "./pages/Store";
import Classes from "./pages/Classes";
import Trainers from "./pages/Trainers";
import ProductDetail from "./pages/ProductDetail";
import ClassDetail from "./pages/ClassDetail";
import TrainerDetail from "./pages/TrainerDetail";


//Container
import Container from "./components/common/Container";

function App() {
  return (
    <>
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
          </Routes>
        <CTA />
      </Container>
    </>
  )
}

export default App