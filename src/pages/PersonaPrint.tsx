import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Smile, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AssessmentWizard } from "@/components/AssessmentWizard";
import { cn } from "@/lib/utils";

const PersonaPrint = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentComplete, setAssessmentComplete] = useState(false);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    toast.success(`Mood "${mood}" logged successfully!`);
  };

  if (showAssessment && !assessmentComplete) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <AssessmentWizard onComplete={() => {
            setAssessmentComplete(true);
            setShowAssessment(false);
          }} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center cosmic-glow">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">PersonaPrint</h1>
            <p className="text-muted-foreground text-lg">Your digital identity blueprint</p>
          </div>

          {/* Personality Overview */}
          <Card className="glass-card p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Your Personality Profile</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Smile className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-2">Complete Your Assessment</h3>
                  <p className="text-muted-foreground text-sm">
                    Start your journey by taking our comprehensive personality assessment. Discover your strengths, values, and growth areas.
                  </p>
                  <Button 
                    onClick={() => setShowAssessment(true)}
                    className="mt-4 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
                  >
                    Begin Assessment
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-2">Track Your Growth</h3>
                  <p className="text-muted-foreground text-sm">
                    Monitor your emotional patterns and personality evolution over time with intelligent insights.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Daily Mood */}
          <Card className="glass-card p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Today's Mood</h2>
            <p className="text-muted-foreground mb-4">How are you feeling today?</p>
            <div className="grid grid-cols-5 gap-4">
              {[
                { emoji: "😊", label: "Happy" },
                { emoji: "😐", label: "Neutral" },
                { emoji: "😔", label: "Sad" },
                { emoji: "😤", label: "Frustrated" },
                { emoji: "🤗", label: "Grateful" }
              ].map((mood, i) => (
                <button
                  key={i}
                  onClick={() => handleMoodSelect(mood.label)}
                  className={cn(
                    "glass-card p-4 text-4xl hover:scale-110 transition-all duration-300",
                    selectedMood === mood.label ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-primary/10"
                  )}
                >
                  {mood.emoji}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PersonaPrint;
