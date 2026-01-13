import { MapPin, Waves, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import logoWavePin from "@/assets/logo-wave-pin.png";

interface HeaderProps {
  user?: {
    name: string;
    role: 'citizen' | 'analyst';
  } | null;
  onLogout?: () => void;
}

export const Header = ({ user, onLogout }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-ocean">
            <img src={logoWavePin} alt="Coastal Hazard Platform" className="w-6 h-6" />
          </div>
          <div className="hidden md:block">
            <h1 className="font-bold text-lg text-primary">Coastal Hazard Platform</h1>
            <p className="text-xs text-muted-foreground italic">Real-time Citizen & Social Media Powered Ocean Hazard Alerts</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-accent/50 px-3 py-2 rounded-lg">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full capitalize">
                  {user.role}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onLogout}
                className="hover:bg-coral/10 hover:text-coral"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="hover:bg-primary/10"
              >
                Login
              </Button>
              <Button 
                className="btn-coral"
                onClick={() => navigate('/login')}
              >
                Get Started
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};