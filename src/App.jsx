import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import SimsPage from "./pages/SimsPage.jsx";
import SimPage from "./pages/SimPage.jsx";

// Router root — top-level page layout lives in src/pages/*
// /sims and /sims/:id are flat sibling routes (not React Router nested
// routes/Outlet) — the two pages share no persistent UI, so nesting would
// add indirection with no payoff. The URL shape alone expresses the
// collection/member relationship.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* marketing/home page */}
        <Route path="/" element={<Landing />} />
        {/* sim gallery grid (collection) */}
        <Route path="/sims" element={<SimsPage />} />
        {/* individual simulation (member) */}
        <Route path="/sims/:id" element={<SimPage />} />
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
