import { NavBar } from "@/components/NavBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils, Plus, Droplet } from "lucide-react";

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

          {/* Quick Add */}
          <Card className="glass-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Today's Meals</h2>
              <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Log Meal
              </Button>
            </div>
            <p className="text-muted-foreground text-center py-8">
              No meals logged yet today. Start tracking your nutrition journey.
            </p>
          </Card>

          {/* Water Intake */}
          <Card className="glass-card p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Droplet className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground">Water Intake</h3>
                <p className="text-muted-foreground text-sm">Track your hydration</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((glass) => (
                <button
                  key={glass}
                  className="glass-card aspect-square flex items-center justify-center text-2xl hover:bg-primary/10 transition-colors"
                >
                  💧
                </button>
              ))}
            </div>
          </Card>

          {/* Wellness Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-gradient">0</div>
              <div className="text-sm text-muted-foreground mt-2">Calories Today</div>
            </Card>
            <Card className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-gradient">0</div>
              <div className="text-sm text-muted-foreground mt-2">Meals Logged</div>
            </Card>
            <Card className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-gradient">0</div>
              <div className="text-sm text-muted-foreground mt-2">Days Streak</div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FoodPrint;
