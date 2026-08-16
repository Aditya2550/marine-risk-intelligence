import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Waves, 
  User, 
  Shield, 
  LogIn, 
  UserPlus, 
  Eye, 
  EyeOff, 
  Check, 
  ExternalLink,
  Loader2
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState<string | null>(null);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'citizen' as 'citizen' | 'analyst'
  });

  // Demo credentials for Sandbox Profile Grid
  const demoAccounts = {
    'citizen_demo@demo.com': {
      password: 'citizen123',
      name: 'Demo Citizen',
      role: 'citizen' as const
    },
    'analyst_demo@demo.com': {
      password: 'analyst123', 
      name: 'Demo Analyst',
      role: 'analyst' as const
    }
  };

  useEffect(() => {
    const role = searchParams.get('role');
    if (role === 'citizen' || role === 'analyst') {
      setRegisterData(prev => ({ ...prev, role }));
    }

    const tab = searchParams.get('tab');
    if (tab === 'register') {
      setIsLogin(false);
    } else if (tab === 'login') {
      setIsLogin(true);
    }
  }, [searchParams]);

  const executeLogin = (email: string, account: typeof demoAccounts[keyof typeof demoAccounts]) => {
    const userData = {
      name: account.name,
      role: account.role,
      email: email
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    toast({
      title: "Login Successful",
      description: `Welcome back, ${account.name}! Redirecting to dashboard...`,
    });
    
    // Redirect based on role
    setTimeout(() => {
      if (account.role === 'citizen') {
        navigate('/citizen');
      } else {
        navigate('/analyst');
      }
    }, 800);
  };

  const handleLogin = () => {
    setIsSubmitLoading(true);
    const account = demoAccounts[loginData.email as keyof typeof demoAccounts];
    
    if (account && account.password === loginData.password) {
      executeLogin(loginData.email, account);
    } else {
      setTimeout(() => {
        setIsSubmitLoading(false);
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Try using the quick-access sandbox profiles below.",
          variant: "destructive",
        });
      }, 600);
    }
  };

  const handleRegister = () => {
    if (!registerData.name || !registerData.email || !registerData.password) {
      toast({
        title: "Registration Failed",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitLoading(true);
    const userData = {
      name: registerData.name,
      role: registerData.role,
      email: registerData.email
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    toast({
      title: "Registration Successful", 
      description: `Welcome to the platform, ${registerData.name}! Redirecting...`,
    });
    
    setTimeout(() => {
      if (registerData.role === 'citizen') {
        navigate('/citizen');
      } else {
        navigate('/analyst');
      }
    }, 800);
  };

  const triggerSandboxLogin = (type: 'citizen' | 'analyst') => {
    const email = type === 'citizen' ? 'citizen_demo@demo.com' : 'analyst_demo@demo.com';
    const account = demoAccounts[email];
    
    setLoadingProfile(type);
    
    // Fill values visually
    setLoginData({
      email,
      password: account.password
    });

    // Simulate login loader to make UX feel responsive and premium
    setTimeout(() => {
      executeLogin(email, account);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1115] flex flex-col font-inter antialiased text-slate-800 dark:text-slate-100">
      
      <Header />
      
      {/* Split-screen container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Side: Solid minimalist brand sidebar (Lg screens only, hidden on mobile) */}
        <div className="hidden lg:flex lg:col-span-5 bg-slate-100 dark:bg-[#16181d] p-16 flex-col justify-between border-r border-slate-200 dark:border-slate-800/80">
          
          {/* Top Brand Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-[4px] bg-blue-600 text-white">
              <Waves className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg text-slate-900 dark:text-white">
              Coastal Hazard Platform
            </span>
          </div>

          {/* Middle Tagline / Branding Info */}
          <div className="my-auto py-10 space-y-3">
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tight leading-tight">
              Real-time Ocean Hazard Alert System
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed max-w-sm">
              Connecting volunteer nodes and ocean management authorities. We bridge crowd reporting, local observations, and alert dispatch on a unified database.
            </p>
          </div>

          {/* Bottom Footer Details */}
          <div className="text-xs text-slate-400 dark:text-slate-500">
            Coastal Sentinel Platform v1.5
          </div>
        </div>

        {/* Right Side: Flat Auth Forms & Sandbox selector (Centered on both mobile and desktop) */}
        <div className="col-span-12 lg:col-span-7 flex flex-col justify-center items-center px-4 py-16 bg-white dark:bg-[#0f1115]">
          
          <div className="w-full max-w-[390px] space-y-6">
            
            {/* Header info */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Welcome back
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Join or log in to the coastal safety platform
              </p>
            </div>

            {/* AUTH FORMS CARD */}
            <Card className="border border-slate-200 dark:border-slate-800/80 rounded-[6px] bg-white dark:bg-[#16181d] shadow-none overflow-hidden">
              <Tabs value={isLogin ? "login" : "register"} onValueChange={(value) => {
                setIsLogin(value === "login");
                setShowPassword(false);
              }}>
                {/* Underline tabs without background pills */}
                <TabsList className="flex w-full bg-transparent border-b border-slate-200 dark:border-slate-800 rounded-none p-0 px-6 h-auto gap-6 justify-start">
                  <TabsTrigger 
                    value="login" 
                    className="relative rounded-none border-b-2 border-transparent bg-transparent px-1 pb-3 pt-4 text-sm font-normal text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:font-semibold shadow-none transition-all duration-150"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="register" 
                    className="relative rounded-none border-b-2 border-transparent bg-transparent px-1 pb-3 pt-4 text-sm font-normal text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:font-semibold shadow-none transition-all duration-150"
                  >
                    Register
                  </TabsTrigger>
                </TabsList>
                
                {/* SIGN IN VIEW */}
                <TabsContent value="login" className="p-6 focus-visible:outline-none">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="login-email" className="text-xs font-semibold text-slate-650 dark:text-slate-350">Email address</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="yourname@domain.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-transparent border border-slate-250 dark:border-slate-800 focus:border-blue-600 dark:focus:border-blue-600 focus-visible:border-blue-600 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-[4px] px-3.5 py-2 text-sm h-10 transition-all duration-150"
                        disabled={loadingProfile !== null || isSubmitLoading}
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="login-password" className="text-xs font-semibold text-slate-650 dark:text-slate-355">Password</Label>
                        <span className="text-xs font-medium text-blue-600 hover:opacity-80 transition-opacity duration-150 cursor-pointer">Forgot password?</span>
                      </div>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginData.password}
                          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                          className="bg-transparent border border-slate-250 dark:border-slate-800 focus:border-blue-600 dark:focus:border-blue-600 focus-visible:border-blue-600 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-[4px] px-3.5 py-2 pr-10 text-sm h-10 transition-all duration-150"
                          disabled={loadingProfile !== null || isSubmitLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors duration-150"
                          disabled={loadingProfile !== null || isSubmitLoading}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-2 h-10 rounded-[4px] bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-150 flex items-center justify-center gap-2"
                      onClick={handleLogin}
                      disabled={loadingProfile !== null || isSubmitLoading}
                    >
                      {isSubmitLoading && loadingProfile === null ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        <>
                          Sign In
                          <LogIn className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
                
                {/* CREATE ACCOUNT VIEW */}
                <TabsContent value="register" className="p-6 focus-visible:outline-none">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="register-name" className="text-xs font-semibold text-slate-650 dark:text-slate-350">Full Name</Label>
                      <Input
                        id="register-name"
                        placeholder="John Doe"
                        value={registerData.name}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-transparent border border-slate-250 dark:border-slate-800 focus:border-blue-600 dark:focus:border-blue-600 focus-visible:border-blue-600 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-[4px] px-3.5 py-2 text-sm h-10 transition-all duration-150"
                        disabled={loadingProfile !== null || isSubmitLoading}
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="register-email" className="text-xs font-semibold text-slate-650 dark:text-slate-350">Email address</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="yourname@domain.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-transparent border border-slate-250 dark:border-slate-800 focus:border-blue-600 dark:focus:border-blue-600 focus-visible:border-blue-600 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-[4px] px-3.5 py-2 text-sm h-10 transition-all duration-150"
                        disabled={loadingProfile !== null || isSubmitLoading}
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="register-password" className="text-xs font-semibold text-slate-650 dark:text-slate-350">Password</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Min. 8 characters"
                          value={registerData.password}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                          className="bg-transparent border border-slate-250 dark:border-slate-800 focus:border-blue-600 dark:focus:border-blue-600 focus-visible:border-blue-600 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-[4px] px-3.5 py-2 pr-10 text-sm h-10 transition-all duration-150"
                          disabled={loadingProfile !== null || isSubmitLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors duration-150"
                          disabled={loadingProfile !== null || isSubmitLoading}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    {/* Visual Selector for Register Role */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-slate-650 dark:text-slate-350 block">Choose Platform Role</Label>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {/* Role Citizen Option */}
                        <button
                          type="button"
                          onClick={() => setRegisterData(prev => ({ ...prev, role: 'citizen' }))}
                          className={`flex flex-col items-center justify-center p-3 rounded-[6px] border-2 text-center transition-colors duration-150 ${
                            registerData.role === 'citizen'
                              ? 'border-blue-600 text-blue-600 bg-transparent'
                              : 'border-slate-200 bg-transparent text-slate-500 dark:border-slate-800 dark:text-slate-400 hover:border-slate-350 dark:hover:border-slate-700'
                          }`}
                          disabled={loadingProfile !== null || isSubmitLoading}
                        >
                          <User className="w-5 h-5 mb-1.5 text-slate-500" />
                          <span className="font-semibold text-xs text-slate-900 dark:text-white block">Citizen Reporter</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-normal block">Report hazards & observations</span>
                        </button>

                        {/* Role Analyst Option */}
                        <button
                          type="button"
                          onClick={() => setRegisterData(prev => ({ ...prev, role: 'analyst' }))}
                          className={`flex flex-col items-center justify-center p-3 rounded-[6px] border-2 text-center transition-colors duration-150 ${
                            registerData.role === 'analyst'
                              ? 'border-blue-600 text-blue-600 bg-transparent'
                              : 'border-slate-200 bg-transparent text-slate-500 dark:border-slate-800 dark:text-slate-400 hover:border-slate-350 dark:hover:border-slate-700'
                          }`}
                          disabled={loadingProfile !== null || isSubmitLoading}
                        >
                          <Shield className="w-5 h-5 mb-1.5 text-slate-500" />
                          <span className="font-semibold text-xs text-slate-900 dark:text-white block">Official / Analyst</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-normal block">Monitor & analyze feeds</span>
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-2 h-10 rounded-[4px] bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-150 flex items-center justify-center gap-2"
                      onClick={handleRegister}
                      disabled={loadingProfile !== null || isSubmitLoading}
                    >
                      {isSubmitLoading && loadingProfile === null ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <UserPlus className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Shared Sandbox Footer inside Card */}
              <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 p-6">
                <p className="text-center text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-normal mb-3">
                  Quick Sandbox Access
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={loadingProfile !== null || isSubmitLoading}
                    onClick={() => triggerSandboxLogin('citizen')}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-[4px] border border-slate-200 hover:bg-slate-100/50 dark:border-slate-800 dark:hover:bg-slate-900/50 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors duration-155"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    <span>Citizen Demo</span>
                    {loadingProfile === 'citizen' && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 ml-1" />
                    )}
                  </button>
                  
                  <button
                    type="button"
                    disabled={loadingProfile !== null || isSubmitLoading}
                    onClick={() => triggerSandboxLogin('analyst')}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-[4px] border border-slate-200 hover:bg-slate-100/50 dark:border-slate-800 dark:hover:bg-slate-900/50 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors duration-155"
                  >
                    <Shield className="w-4 h-4 text-slate-500" />
                    <span>Analyst Demo</span>
                    {loadingProfile === 'analyst' && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 ml-1" />
                    )}
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;