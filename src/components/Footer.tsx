import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/logo.png";

const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
  e.preventDefault();
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

export const Footer = () => {
  return (
    <footer className="glass-card border-t border-primary/20 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden cosmic-glow">
                <img src={logo} alt="LifePrint" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold text-gradient">LifePrint</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              The Digital Mirror of You. Discover yourself, evolve, and shape your future.
            </p>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="/#about" 
                  onClick={(e) => handleSmoothScroll(e, 'about')}
                  className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="/#features" 
                  onClick={(e) => handleSmoothScroll(e, 'features')}
                  className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  Features
                </a>
              </li>
              <li>
                <a 
                  href="/#team" 
                  onClick={(e) => handleSmoothScroll(e, 'team')}
                  className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  Our Team
                </a>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">Modules</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">PersonaPrint</li>
              <li className="text-muted-foreground">FoodPrint</li>
              <li className="text-muted-foreground">StoryWeaver</li>
              <li className="text-muted-foreground">Time Capsule</li>
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="text-sm">hello@lifeprint.com</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <a href="tel:+233538198272" className="text-sm hover:text-primary transition-colors">
                  +233 538 198 272
                </a>
              </li>
              <li className="flex items-start space-x-2 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">1 University Ave, Accra, Berekuso, Ghana</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/20 mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} LifePrint. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
