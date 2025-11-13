import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PersonaPrint from "./pages/PersonaPrint";
import FoodPrint from "./pages/FoodPrint";
import StoryWeaver from "./pages/StoryWeaver";
import TimeCapsule from "./pages/TimeCapsule";
import Friends from "./pages/Friends";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/persona" element={<ProtectedRoute><PersonaPrint /></ProtectedRoute>} />
        <Route path="/food" element={<ProtectedRoute><FoodPrint /></ProtectedRoute>} />
        <Route path="/stories" element={<ProtectedRoute><StoryWeaver /></ProtectedRoute>} />
        <Route path="/capsule" element={<ProtectedRoute><TimeCapsule /></ProtectedRoute>} />
        <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
    <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
