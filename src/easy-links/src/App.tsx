import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateSection from "@/pages/CreateSection";
import SectionPage from "@/pages/SectionPage";
import EditSection from "@/pages/EditSection";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateSection />} />
        <Route path="/section/:id/edit" element={<EditSection />} />
        <Route path="/section/:id" element={<SectionPage />} />
      </Routes>
    </Router>
  );
}
