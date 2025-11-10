import { NavBar } from "@/components/NavBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Heart, MessageCircle } from "lucide-react";

const StoryWeaver = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center cosmic-glow">
              <BookOpen className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">StoryWeaver</h1>
            <p className="text-muted-foreground text-lg">Your digital journal and storytelling space</p>
          </div>

          {/* Create Story */}
          <Card className="glass-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Your Stories</h2>
              <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Write Story
              </Button>
            </div>
            
            <div className="text-center py-12 space-y-4">
              <div className="text-6xl mb-4">✨</div>
              <p className="text-muted-foreground">
                Your story begins here. Share your thoughts, dreams, and reflections.
              </p>
            </div>
          </Card>

          {/* Story Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card p-6 hover:bg-primary/5 transition-colors cursor-pointer">
              <div className="text-3xl mb-3">📖</div>
              <h3 className="font-semibold text-foreground mb-2">Life Chapters</h3>
              <p className="text-sm text-muted-foreground">Major life events and milestones</p>
            </Card>
            <Card className="glass-card p-6 hover:bg-primary/5 transition-colors cursor-pointer">
              <div className="text-3xl mb-3">💭</div>
              <h3 className="font-semibold text-foreground mb-2">Dream Logs</h3>
              <p className="text-sm text-muted-foreground">Record and reflect on your dreams</p>
            </Card>
            <Card className="glass-card p-6 hover:bg-primary/5 transition-colors cursor-pointer">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="font-semibold text-foreground mb-2">Lessons Learned</h3>
              <p className="text-sm text-muted-foreground">Insights and growth moments</p>
            </Card>
          </div>

          {/* Sample Story Card */}
          <Card className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Welcome to StoryWeaver</h3>
                <p className="text-sm text-muted-foreground">A moment ago</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs">
                Reflection
              </div>
            </div>
            <p className="text-foreground/80 leading-relaxed mb-4">
              This is your space to express yourself freely. Write about your day, your dreams, your challenges, and your victories. Every story matters.
            </p>
            <div className="flex items-center space-x-4 text-muted-foreground text-sm">
              <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                <Heart className="w-4 h-4" />
                <span>0</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>0</span>
              </button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StoryWeaver;
