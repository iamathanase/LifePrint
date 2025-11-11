import { NavBar } from "@/components/NavBar";
import { Clock } from "lucide-react";
import { TimeCapsuleGoals } from "@/components/TimeCapsuleGoals";

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

          {/* Time Capsule Goals */}
          <TimeCapsuleGoals />
        </div>
      </main>
    </div>
  );
};

export default TimeCapsule;
