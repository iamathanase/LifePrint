import { Brain, Utensils, BookOpen, Clock } from "lucide-react";
import { ModuleCard } from "@/components/ModuleCard";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16 animate-float">
          <h1 className="text-5xl md:text-7xl font-bold">
            <span className="text-gradient">Welcome back, {user?.name}</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Continue your journey of self-discovery
          </p>
          <p className="text-foreground/80 max-w-xl mx-auto">
            Explore your modules and track your progress across all areas of your life.
          </p>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <ModuleCard
            title="PersonaPrint"
            description="Discover your digital identity through personality insights, emotional tracking, and self-awareness tools."
            icon={Brain}
            to="/persona"
          />
          <ModuleCard
            title="FoodPrint"
            description="Track your wellness journey with personalized nutrition insights and mindful eating habits."
            icon={Utensils}
            to="/food"
          />
          <ModuleCard
            title="StoryWeaver"
            description="Express yourself through digital journaling, reflection, and emotional storytelling."
            icon={BookOpen}
            to="/stories"
          />
          <ModuleCard
            title="Time Capsule 2040"
            description="Envision and track your future goals with messages to your future self."
            icon={Clock}
            to="/capsule"
          />
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient">0</div>
            <div className="text-sm text-muted-foreground mt-2">Insights Gathered</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient">0</div>
            <div className="text-sm text-muted-foreground mt-2">Stories Written</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-gradient">0</div>
            <div className="text-sm text-muted-foreground mt-2">Goals Set</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
