import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, CheckCircle2, Circle, Trash2 } from "lucide-react";

type Goal = {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: "planned" | "in_progress" | "achieved";
  reflection: string;
  timestamp: Date;
};

export const TimeCapsuleGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [reflection, setReflection] = useState("");

  const handleAddGoal = () => {
    if (!title || !targetDate) {
      toast.error("Please add a title and target date");
      return;
    }

    const newGoal: Goal = {
      id: Date.now().toString(),
      title,
      description,
      targetDate,
      status: "planned",
      reflection,
      timestamp: new Date()
    };

    setGoals([...goals, newGoal]);
    toast.success("Goal added to your Time Capsule!");

    // Reset form
    setTitle("");
    setDescription("");
    setTargetDate("");
    setReflection("");
  };

  const updateGoalStatus = (id: string, status: Goal["status"]) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, status } : goal
    ));
    toast.success(`Goal marked as ${status.replace("_", " ")}`);
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
    toast.success("Goal removed");
  };

  const getStatusColor = (status: Goal["status"]) => {
    switch (status) {
      case "achieved": return "text-primary";
      case "in_progress": return "text-accent";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Create a New Goal</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="goalTitle">Goal Title</Label>
            <Input
              id="goalTitle"
              placeholder="What do you want to achieve?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="goalDescription">Description</Label>
            <Textarea
              id="goalDescription"
              placeholder="Describe your goal and why it matters to you..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="targetDate">Target Date</Label>
            <Input
              id="targetDate"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <Label htmlFor="reflection">Message to Future You (Optional)</Label>
            <Textarea
              id="reflection"
              placeholder="What do you want to tell your future self?"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            onClick={handleAddGoal}
            className="w-full bg-gradient-to-r from-primary to-accent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Time Capsule
          </Button>
        </div>
      </Card>

      {goals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Your Goals Timeline</h3>
          {goals.map((goal) => (
            <Card key={goal.id} className="glass-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      onClick={() => {
                        const statuses: Goal["status"][] = ["planned", "in_progress", "achieved"];
                        const currentIndex = statuses.indexOf(goal.status);
                        const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                        updateGoalStatus(goal.id, nextStatus);
                      }}
                      className={`${getStatusColor(goal.status)} hover:scale-110 transition-transform`}
                    >
                      {goal.status === "achieved" ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </button>
                    <h4 className="text-lg font-semibold text-foreground">{goal.title}</h4>
                  </div>
                  <p className="text-foreground mb-2">{goal.description}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>🎯 Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                    <span>• Status: {goal.status.replace("_", " ")}</span>
                  </div>
                  {goal.reflection && (
                    <div className="mt-3 p-3 glass-card">
                      <p className="text-sm text-muted-foreground italic">"{goal.reflection}"</p>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteGoal(goal.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
