import { Route, Routes } from "react-router-dom";

//components
import Navbar from "./components/common/Navbar"
import CTA from "./components/common/CTA";

//Pages 
import Home from "./pages/Home"
import Store from "./pages/Store";
import Classes from "./pages/Classes";

//Container
import Container from "./components/common/Container";

function App() {
  return (
    <>
      <Container>
        <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/classes" element={<Classes />} />
          </Routes>
        <CTA />
      </Container>
    </>
  )
}

export default App
