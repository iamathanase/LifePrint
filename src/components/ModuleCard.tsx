import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  gradient?: string;
}

export const ModuleCard = ({ title, description, icon: Icon, to, gradient }: ModuleCardProps) => {
  return (
    <Link to={to}>
      <Card className="glass-card group relative overflow-hidden border-primary/20 transition-all duration-500 hover:border-primary/50 hover:scale-105 animate-pulse-glow cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative p-6 space-y-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center cosmic-glow">
            <Icon className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};
