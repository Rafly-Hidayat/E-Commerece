import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProductsPage from "./pages/ProductsPage";
import { useAuthStore } from "./stores/authStore";

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({
  element,
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [isAuthenticated]);

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  const initialize = useAuthStore((state) => state.initialize);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initialize();
    setIsInitialized(true);
  }, [initialize]);

  if (!isInitialized) {
    return <div>Initializing...</div>; // Or a proper loading component
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/products"
          element={<ProtectedRoute element={<ProductsPage />} />}
        />
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
