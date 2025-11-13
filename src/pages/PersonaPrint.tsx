import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Smile, TrendingUp, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { EnhancedAssessmentWizard } from "@/components/EnhancedAssessmentWizard";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PersonalityProfile {
  personality_type: string;
  strengths: string[];
  areas_for_growth: string[];
  created_at: string;
}

const PersonaPrint = () => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const [profile, setProfile] = useState<PersonalityProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPersonalityProfile();
    }
  }, [user]);

  const loadPersonalityProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('persona_assessments')
        .select('personality_type, strengths, areas_for_growth, created_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading personality profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    toast.success(`Mood "${mood}" logged successfully!`);
  };

  const handleAssessmentComplete = () => {
    setShowAssessment(false);
    loadPersonalityProfile();
  };

  if (showAssessment) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <EnhancedAssessmentWizard onComplete={handleAssessmentComplete} />
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center">Loading your profile...</div>
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
            {profile ? (
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-2">Personality Type</h3>
                    <p className="text-lg text-primary font-semibold">{profile.personality_type}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Assessed on {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-2">Your Strengths</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.strengths.map((strength, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-2">Growth Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.areas_for_growth.map((area, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-secondary/10 text-secondary-foreground text-sm">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setShowAssessment(true)}
                  variant="outline"
                  className="w-full"
                >
                  Retake Assessment
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Smile className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-2">Complete Your Assessment</h3>
                    <p className="text-muted-foreground text-sm">
                      Start your journey by taking our comprehensive 15-question personality assessment. Discover your strengths, values, and growth areas across all aspects of life.
                    </p>
                    <Button 
                      onClick={() => setShowAssessment(true)}
                      className="mt-4 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
                    >
                      Begin Assessment
                    </Button>
                  </div>
                </div>
              </div>
            )}
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
