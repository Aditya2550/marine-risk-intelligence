import { Waves, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1115] font-inter">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 mx-auto">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex items-center justify-center w-8 h-8 rounded-[4px] bg-blue-600 text-white">
            <Waves className="w-5 h-5" />
          </div>
          <div className="flex items-center">
            <span className="font-semibold text-base text-slate-900 dark:text-white">
              Coastal Hazard Platform
            </span>
            <span className="hidden md:inline-block text-xs text-slate-400 dark:text-slate-500 font-normal ml-3 border-l border-slate-250 dark:border-slate-800 pl-3 leading-normal">
              Real-time Citizen & Social Media Powered Alerts
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-2">
          {user ? (
            <div className="flex items-center space-x-2.5">
              <div className="flex items-center space-x-2 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 rounded-[4px] bg-transparent">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-350">{user.name}</span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-450 px-1.5 py-0.5 rounded-[2px] capitalize font-medium">
                  {user.role}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onLogout}
                className="h-8 w-8 p-0 rounded-[4px] hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-red-600 dark:hover:text-red-500 transition-colors duration-150"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login?tab=login')}
                className="bg-transparent hover:bg-transparent text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-600 font-normal text-sm transition-colors duration-150 shadow-none border-0 h-9 px-3"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate('/login?tab=register')}
                className="bg-blue-600 hover:bg-[#1d4ed8] text-white font-semibold text-sm rounded-[4px] border-0 h-9 px-4 shadow-none transition-colors duration-150"
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