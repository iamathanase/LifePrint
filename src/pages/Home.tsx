import { Link } from "react-router-dom";
import { Brain, Utensils, BookOpen, Clock, ArrowRight, Target, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import heroBg from "@/assets/hero-bg.jpg";
import team1 from "@/assets/team-1.jpg";
import team2 from "@/assets/team-2.jpg";
import team3 from "@/assets/team-3.jpg";
import team4 from "@/assets/team-4.jpg";
import team5 from "@/assets/team-5.jpg";

const features = [
  {
    icon: Brain,
    title: "PersonaPrint",
    description: "Discover your unique personality blueprint with AI-driven insights and emotional tracking.",
  },
  {
    icon: Utensils,
    title: "FoodPrint",
    description: "Track your wellness journey with personalized nutrition insights and mood-based recommendations.",
  },
  {
    icon: BookOpen,
    title: "StoryWeaver",
    description: "Express yourself through AI-enhanced storytelling and meaningful life reflections.",
  },
  {
    icon: Clock,
    title: "Time Capsule",
    description: "Set goals, track progress, and send messages to your future self.",
  },
];

const team = [
  { name: "Sarah Chen", role: "CEO & Founder", image: team1 },
  { name: "Maya Patel", role: "Chief Product Officer", image: team2 },
  { name: "Alex Rivera", role: "Head of AI", image: team3 },
  { name: "Jordan Kim", role: "Lead Designer", image: team4 },
  { name: "Emily Zhang", role: "Head of Wellness", image: team5 },
];

const Home = () => {
  return (
    <div className="min-h-screen">
      <NavBar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Hero" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background"></div>
        </div>
        
        <div className="container mx-auto px-4 py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-float">
              <span className="text-gradient">The Digital Mirror</span>
              <br />
              <span className="text-foreground">of You</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover yourself, improve your wellness, and shape your future with LifePrint — 
              your holistic digital ecosystem for self-knowledge and growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="cosmic-glow animate-pulse-glow">
                  Start Your Journey <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="glass-card p-8 hover:cosmic-glow transition-all">
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 text-primary mr-3" />
                <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
              </div>
              <p className="text-muted-foreground text-lg">
                To create a holistic, emotionally intelligent digital ecosystem where users understand 
                themselves better, evolve consciously, and leave a lasting digital legacy. We believe 
                in empowering individuals with the tools and insights to live more intentional, 
                meaningful lives.
              </p>
            </div>

            <div className="glass-card p-8 hover:cosmic-glow transition-all">
              <div className="flex items-center mb-4">
                <Heart className="w-8 h-8 text-accent mr-3" />
                <h2 className="text-3xl font-bold text-foreground">Our Vision</h2>
              </div>
              <p className="text-muted-foreground text-lg">
                To become the world's most trusted companion for personal growth and self-discovery. 
                We envision a future where technology serves humanity by helping people understand 
                their authentic selves, make healthier choices, and create lasting positive change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Powerful Features</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Four integrated modules designed to help you understand, improve, express, and evolve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-6 hover:cosmic-glow transition-all group cursor-pointer"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="text-gradient">Meet Our Team</span>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Passionate experts dedicated to creating technology that understands and serves humanity.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <div
                key={index}
                className="text-center group cursor-pointer"
              >
                <div className="glass-card p-4 mb-4 group-hover:cosmic-glow transition-all">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform"
                  />
                  <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                  <p className="text-sm text-primary">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass-card p-12 text-center max-w-4xl mx-auto cosmic-glow">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient">Begin Your Journey Today</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of people discovering their authentic selves and creating meaningful change.
            </p>
            <Link to="/signup">
              <Button size="lg" className="animate-pulse-glow">
                Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
