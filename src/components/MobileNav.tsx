import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Home, Brain, Utensils, BookOpen, Clock, User, LogOut, Shield, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const handleSmoothScroll = (targetId: string) => {
  if (targetId === 'top' || !targetId) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  
  const element = document.getElementById(targetId);
  if (element) {
    const offset = 80; // Account for fixed navbar
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

const publicNavItems = [
  { label: "Home", path: "/#top" },
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

export const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] bg-card/95 backdrop-blur-xl border-primary/20">
          <div className="flex flex-col h-full py-6">
            <div className="flex-1 space-y-2">
              {isAuthenticated ? (
                <>
                  {appNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300",
                      isActive
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
                  })}

                  {isAdmin && (
                  <>
                    <div className="h-px bg-border my-4" />
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300",
                        location.pathname === "/admin"
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">Admin Panel</span>
                    </Link>
                    <Link
                      to="/analytics"
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300",
                        location.pathname === "/analytics"
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      <BarChart3 className="w-5 h-5" />
                      <span className="font-medium">Analytics</span>
                    </Link>
                  </>
                  )}
                </>
              ) : (
                <>
                  {publicNavItems.map((item) => {
                    const isHash = item.path.includes('#');
                    const sectionId = isHash ? item.path.split('#')[1] : '';
                    
                    return (
                      <a
                        key={item.path}
                        href={item.path}
                        onClick={(e) => {
                          if (isHash && sectionId) {
                            e.preventDefault();
                            handleSmoothScroll(sectionId);
                            setOpen(false);
                          }
                        }}
                        className="flex items-center px-4 py-3 rounded-lg transition-all duration-300 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      >
                        <span className="font-medium">{item.label}</span>
                      </a>
                    );
                  })}
                  <div className="h-px bg-border my-4" />
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center px-4 py-3 rounded-lg transition-all duration-300 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  >
                    <span className="font-medium">Sign In</span>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="flex items-center px-4 py-3 rounded-lg transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <span className="font-medium">Get Started</span>
                  </Link>
                </>
              )}
            </div>

            {isAuthenticated && (
              <div className="space-y-2 border-t border-border pt-4">
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300",
                    location.pathname === "/profile"
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 text-muted-foreground hover:text-foreground hover:bg-secondary/50 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};