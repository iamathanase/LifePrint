import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

type MealLog = {
  id: string;
  mealType: string;
  foodItems: string;
  calories: string;
  waterIntake: string;
  mood: string;
  timestamp: Date;
};

export const FoodLogger = () => {
  const [logs, setLogs] = useState<MealLog[]>([]);
  const [mealType, setMealType] = useState("");
  const [foodItems, setFoodItems] = useState("");
  const [calories, setCalories] = useState("");
  const [waterIntake, setWaterIntake] = useState("");
  const [mood, setMood] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mealType || !foodItems) {
      toast.error("Please fill in meal type and food items");
      return;
    }

    const newLog: MealLog = {
      id: Date.now().toString(),
      mealType,
      foodItems,
      calories,
      waterIntake,
      mood,
      timestamp: new Date()
    };

    setLogs([newLog, ...logs]);
    toast.success("Meal logged successfully!");
    
    // Reset form
    setMealType("");
    setFoodItems("");
    setCalories("");
    setWaterIntake("");
    setMood("");
  };

  const deleteLog = (id: string) => {
    setLogs(logs.filter(log => log.id !== id));
    toast.success("Log deleted");
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Log Your Meal</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mealType">Meal Type</Label>
              <Select value={mealType} onValueChange={setMealType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="calories">Calories (optional)</Label>
              <Input
                id="calories"
                type="number"
                placeholder="e.g., 500"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="foodItems">Food Items</Label>
            <Input
              id="foodItems"
              placeholder="e.g., Grilled chicken, salad, rice"
              value={foodItems}
              onChange={(e) => setFoodItems(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="waterIntake">Water Intake (L)</Label>
              <Input
                id="waterIntake"
                type="number"
                step="0.1"
                placeholder="e.g., 0.5"
                value={waterIntake}
                onChange={(e) => setWaterIntake(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="mood">Mood After Meal</Label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger>
                  <SelectValue placeholder="How do you feel?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="energized">Energized</SelectItem>
                  <SelectItem value="satisfied">Satisfied</SelectItem>
                  <SelectItem value="tired">Tired</SelectItem>
                  <SelectItem value="bloated">Bloated</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent">
            <Plus className="w-4 h-4 mr-2" />
            Log Meal
          </Button>
        </form>
      </Card>

      {logs.length > 0 && (
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">Recent Logs</h3>
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="glass-card p-4 flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary font-medium capitalize">{log.mealType}</span>
                    <span className="text-muted-foreground text-sm">
                      {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-foreground mb-1">{log.foodItems}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    {log.calories && <span>🔥 {log.calories} cal</span>}
                    {log.waterIntake && <span>💧 {log.waterIntake}L</span>}
                    {log.mood && <span>😊 {log.mood}</span>}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteLog(log.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
