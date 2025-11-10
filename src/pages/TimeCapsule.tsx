import { NavBar } from "@/components/NavBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Plus, Target, Calendar } from "lucide-react";

const TimeCapsule = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center cosmic-glow">
              <Clock className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">Time Capsule 2040</h1>
            <p className="text-muted-foreground text-lg">Your future goals and vision</p>
          </div>

          {/* Create Capsule */}
          <Card className="glass-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Your Capsules</h2>
              <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Create Capsule
              </Button>
            </div>
            
            <div className="text-center py-12 space-y-4">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-foreground">Envision Your Future</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Create messages and goals for your future self. Track your progress and reflect on your journey.
              </p>
            </div>
          </Card>

          {/* Goal Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">Life Goals</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set long-term aspirations and track your progress toward your dream life.
                  </p>
                  <div className="text-3xl font-bold text-gradient">0</div>
                  <div className="text-xs text-muted-foreground">Active Goals</div>
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">Future Messages</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Write letters to your future self to open at specific dates.
                  </p>
                  <div className="text-3xl font-bold text-gradient">0</div>
                  <div className="text-xs text-muted-foreground">Sealed Messages</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Timeline */}
          <Card className="glass-card p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Your Timeline</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 rounded-full bg-primary cosmic-glow flex-shrink-0" />
                <div className="flex-1 glass-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">2025 - Present</span>
                    <span className="text-xs text-muted-foreground">Now</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Your journey begins here</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 opacity-50">
                <div className="w-3 h-3 rounded-full bg-accent flex-shrink-0" />
                <div className="flex-1 glass-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">2030 - Milestone Year</span>
                    <span className="text-xs text-muted-foreground">Future</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Set your 5-year vision</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 opacity-30">
                <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0" />
                <div className="flex-1 glass-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">2040 - Ultimate Vision</span>
                    <span className="text-xs text-muted-foreground">Destiny</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Define your legacy</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TimeCapsule;
