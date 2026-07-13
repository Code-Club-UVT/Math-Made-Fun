import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SimPage from "./pages/SimPage.jsx";

// Router root — top-level page layout lives in src/pages/*
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* marketing/home page */}
        <Route path="/" element={<Landing />} />
        {/* sim gallery grid */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* individual simulation */}
        <Route path="/sim/:id" element={<SimPage />} />
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
