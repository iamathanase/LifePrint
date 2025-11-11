import { NavBar } from "@/components/NavBar";
import { Card } from "@/components/ui/card";
import { Utensils } from "lucide-react";
import { FoodLogger } from "@/components/FoodLogger";

const FoodPrint = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center cosmic-glow">
              <Utensils className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">FoodPrint</h1>
            <p className="text-muted-foreground text-lg">Your wellness journey tracker</p>
          </div>

          {/* Food Tracking */}
          <FoodLogger />
        </div>
      </main>
    </div>
  );
};

export default FoodPrint;
