import { Link, useLocation } from "react-router-dom";
import { Brain, Home, Utensils, BookOpen, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Brain, label: "PersonaPrint", path: "/persona" },
  { icon: Utensils, label: "FoodPrint", path: "/food" },
  { icon: BookOpen, label: "StoryWeaver", path: "/stories" },
  { icon: Clock, label: "Time Capsule", path: "/capsule" },
];

export const NavBar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-primary/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden cosmic-glow flex items-center justify-center bg-card">
              <img src={logo} alt="LifePrint Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-bold text-gradient">LifePrint</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
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
          </div>
        </div>
      </div>
    </nav>
  );
};
