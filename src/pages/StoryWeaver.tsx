import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { BookOpen } from "lucide-react";
import { StoryEditor } from "@/components/StoryEditor";

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

          {/* Story Editor */}
          <StoryEditor />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StoryWeaver;
