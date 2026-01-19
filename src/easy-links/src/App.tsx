import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateSection from "@/pages/CreateSection";
import SectionPage from "@/pages/SectionPage";
import EditSection from "@/pages/EditSection";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: any) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
        <Route path="/create" element={ <ProtectedRoute> <CreateSection /> </ProtectedRoute> } />
        <Route path="/section/:id/edit" element={<ProtectedRoute> <EditSection /> </ProtectedRoute>} />
        <Route path="/section/:id" element={<ProtectedRoute> <SectionPage /> </ProtectedRoute>} />
      </Routes>
    </Router>
  );
}
