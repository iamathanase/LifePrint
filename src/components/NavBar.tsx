import { Link, useLocation, useNavigate } from "react-router-dom";
import { Brain, Home, Utensils, BookOpen, Clock, User, LogOut, Shield, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/MobileNav";
import logo from "@/assets/logo.png";

const publicNavItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/#about" },
  { label: "Features", path: "/#features" },
  { label: "Team", path: "/#team" },
];

const appNavItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Brain, label: "PersonaPrint", path: "/persona" },
  { icon: Utensils, label: "FoodPrint", path: "/food" },
  { icon: BookOpen, label: "StoryWeaver", path: "/stories" },
  { icon: Clock, label: "Time Capsule", path: "/capsule" },
];

export const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-primary/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MobileNav />
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-full overflow-hidden cosmic-glow flex items-center justify-center bg-card">
                <img src={logo} alt="LifePrint Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-bold text-gradient">LifePrint</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                {appNavItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300",
                        isActive
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
                {isAdmin && (
                  <>
                    <Link
                      to="/admin"
                      className={cn(
                        "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300",
                        location.pathname === "/admin"
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-medium">Admin</span>
                    </Link>
                    <Link
                      to="/analytics"
                      className={cn(
                        "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300",
                        location.pathname === "/analytics"
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span className="text-sm font-medium">Analytics</span>
                    </Link>
                  </>
                )}
                <Link
                  to="/profile"
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300",
                    location.pathname === "/profile"
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Profile</span>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="ml-2"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                {publicNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
