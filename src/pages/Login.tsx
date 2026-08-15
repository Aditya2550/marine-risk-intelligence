import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Activity, 
  MapPin, 
  Radio,
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
    <div className="min-h-screen bg-background flex flex-col">
      <style>{`
        @keyframes waveFlow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-wave-flow {
          animation: waveFlow 22s linear infinite;
        }
        .animate-float-slow {
          animation: floatSlow 6s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulseSlow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      <Header />
      
      {/* Split-screen container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Side: Immersive Brand Showcase (Lg screens only) */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-gradient-to-br from-slate-950 via-[#0b1c30] to-[#072d47] text-white p-12 flex-col justify-between overflow-hidden border-r border-[#ffffff0a]">
          
          {/* Animated Background Gradients & Waves */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#0e3e6b,transparent_50%)] animate-pulse-slow" />
          <div className="absolute inset-x-0 bottom-0 h-40 opacity-10 overflow-hidden pointer-events-none">
            <svg className="absolute bottom-0 w-[200%] h-full animate-wave-flow" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0 C150,90 350,10 500,80 C650,150 850,20 1000,70 C1150,120 1350,40 1500,90 L1500,120 L0,120 Z" fill="currentColor" />
            </svg>
          </div>

          {/* Top Section */}
          <div className="relative z-10 flex items-center space-x-2">
            <Waves className="w-6 h-6 text-seafoam" />
            <span className="text-xs font-mono font-semibold tracking-wider text-seafoam bg-seafoam/10 px-3 py-1 rounded-full border border-seafoam/20 uppercase">
              INCOIS Collaborative Node
            </span>
          </div>

          {/* Middle Section: Main Text & Floating Mockup */}
          <div className="relative z-10 my-auto py-10 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl xl:text-5xl font-bold tracking-tight leading-tight">
                Decentralized Coastal <br />
                <span className="bg-gradient-to-r from-seafoam via-cyan-400 to-primary-foreground bg-clip-text text-transparent">
                  Hazard Analytics
                </span>
              </h2>
              <p className="text-sm xl:text-base text-slate-300 leading-relaxed max-w-md">
                Connecting volunteer citizen nodes with ocean management authorities. We bridge the gap between crowd reporting, local observations, and AI-driven social monitoring for immediate dispatch.
              </p>
            </div>

            {/* Premium System Stats Overlay */}
            <div className="animate-float-slow bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-w-sm">
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                <span className="text-xs font-mono tracking-wider text-slate-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  Live Platform Status
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                  99.9% Up
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Citizen Nodes</span>
                  <span className="text-lg font-bold font-mono text-white">4,812 active</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Signals Analyzed</span>
                  <span className="text-lg font-bold font-mono text-white">12.4K / hr</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Alert Accuracy</span>
                  <span className="text-lg font-bold font-mono text-white">96.8%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Response dispatch</span>
                  <span className="text-lg font-bold font-mono text-white">~3.5 mins</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="relative z-10 text-xs text-slate-400 flex justify-between items-center border-t border-white/5 pt-4">
            <span>Coastal Early Warning System v1.5</span>
            <span className="flex items-center gap-1 hover:text-white cursor-pointer transition">
              View API docs <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Right Side: Auth Forms & Sandbox selector */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-950/20">
          
          <div className="w-full max-w-md space-y-6">
            
            {/* Header info */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-ocean shadow-md mb-2">
                <Waves className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Join or log in to the coastal safety platform
              </p>
            </div>

            {/* SANDBOX PROFILES GRID */}
            <div className="bg-card border border-border/80 shadow-md rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-primary" />
                    Quick-Access Sandbox
                  </h3>
                  <p className="text-[11px] text-muted-foreground">Select a sandbox profile to immediately sign in and evaluate dashboards.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Citizen Profile Card */}
                <button
                  type="button"
                  disabled={loadingProfile !== null || isSubmitLoading}
                  onClick={() => triggerSandboxLogin('citizen')}
                  className="group relative flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-background/50 hover:bg-primary/5 hover:border-primary/40 text-left transition-all hover:shadow-sm"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-foreground block">Citizen Reporter</span>
                    <span className="text-[10px] text-muted-foreground block font-mono">citizen_demo@demo.com</span>
                  </div>
                  {loadingProfile === 'citizen' ? (
                    <Loader2 className="absolute right-3 top-3.5 w-3.5 h-3.5 animate-spin text-emerald-500" />
                  ) : (
                    <div className="absolute right-3 top-3.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </button>

                {/* Analyst Profile Card */}
                <button
                  type="button"
                  disabled={loadingProfile !== null || isSubmitLoading}
                  onClick={() => triggerSandboxLogin('analyst')}
                  className="group relative flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-background/50 hover:bg-primary/5 hover:border-primary/40 text-left transition-all hover:shadow-sm"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-foreground block">Coastal Analyst</span>
                    <span className="text-[10px] text-muted-foreground block font-mono">analyst_demo@demo.com</span>
                  </div>
                  {loadingProfile === 'analyst' ? (
                    <Loader2 className="absolute right-3 top-3.5 w-3.5 h-3.5 animate-spin text-sky-500" />
                  ) : (
                    <div className="absolute right-3 top-3.5 w-1.5 h-1.5 rounded-full bg-sky-500" />
                  )}
                </button>
              </div>
            </div>

            {/* AUTH FORMS CARD */}
            <Card className="border border-border/80 shadow-lg rounded-2xl overflow-hidden bg-card/65 backdrop-blur-sm">
              <Tabs value={isLogin ? "login" : "register"} onValueChange={(value) => {
                setIsLogin(value === "login");
                setShowPassword(false);
              }}>
                <TabsList className="grid w-full grid-cols-2 rounded-t-2xl rounded-b-none bg-muted/50 p-1 border-b">
                  <TabsTrigger value="login" className="flex items-center justify-center gap-2 py-3 text-xs font-semibold rounded-lg transition-all">
                    <LogIn className="w-3.5 h-3.5" />
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="register" className="flex items-center justify-center gap-2 py-3 text-xs font-semibold rounded-lg transition-all">
                    <UserPlus className="w-3.5 h-3.5" />
                    Register
                  </TabsTrigger>
                </TabsList>
                
                {/* SIGN IN VIEW */}
                <TabsContent value="login" className="p-6 focus-visible:outline-none">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-xs font-semibold text-foreground/80">Email address</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="yourname@domain.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        className="input-ocean"
                        disabled={loadingProfile !== null || isSubmitLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="login-password" className="text-xs font-semibold text-foreground/80">Password</Label>
                        <span className="text-[10px] text-primary hover:underline cursor-pointer">Forgot password?</span>
                      </div>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginData.password}
                          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                          className="input-ocean pr-10"
                          disabled={loadingProfile !== null || isSubmitLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                          disabled={loadingProfile !== null || isSubmitLoading}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full btn-ocean mt-2 flex items-center justify-center gap-2 h-11"
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
                    <div className="space-y-2">
                      <Label htmlFor="register-name" className="text-xs font-semibold text-foreground/80">Full Name</Label>
                      <Input
                        id="register-name"
                        placeholder="John Doe"
                        value={registerData.name}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                        className="input-ocean"
                        disabled={loadingProfile !== null || isSubmitLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-xs font-semibold text-foreground/80">Email address</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="yourname@domain.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                        className="input-ocean"
                        disabled={loadingProfile !== null || isSubmitLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Min. 8 characters"
                          value={registerData.password}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                          className="input-ocean pr-10"
                          disabled={loadingProfile !== null || isSubmitLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                          disabled={loadingProfile !== null || isSubmitLoading}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    {/* Visual Card Selector for Register Role */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-foreground/80 block">Choose Platform Role</Label>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {/* Role Citizen Option */}
                        <button
                          type="button"
                          onClick={() => setRegisterData(prev => ({ ...prev, role: 'citizen' }))}
                          className={`group relative flex flex-col items-center justify-center p-3 rounded-xl border-2 text-center transition-all ${
                            registerData.role === 'citizen'
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-border bg-background text-muted-foreground hover:border-muted-foreground/30 hover:bg-slate-50/50'
                          }`}
                          disabled={loadingProfile !== null || isSubmitLoading}
                        >
                          {registerData.role === 'citizen' && (
                            <Check className="absolute top-2 right-2 w-3.5 h-3.5 text-primary" />
                          )}
                          <User className="w-5 h-5 mb-1 group-hover:scale-105 transition-transform" />
                          <span className="font-bold text-[11px] block">Citizen / Volunteer</span>
                          <span className="text-[9px] text-muted-foreground mt-0.5 leading-tight block">Report hazards & share observations</span>
                        </button>

                        {/* Role Analyst Option */}
                        <button
                          type="button"
                          onClick={() => setRegisterData(prev => ({ ...prev, role: 'analyst' }))}
                          className={`group relative flex flex-col items-center justify-center p-3 rounded-xl border-2 text-center transition-all ${
                            registerData.role === 'analyst'
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-border bg-background text-muted-foreground hover:border-muted-foreground/30 hover:bg-slate-50/50'
                          }`}
                          disabled={loadingProfile !== null || isSubmitLoading}
                        >
                          {registerData.role === 'analyst' && (
                            <Check className="absolute top-2 right-2 w-3.5 h-3.5 text-primary" />
                          )}
                          <Shield className="w-5 h-5 mb-1 group-hover:scale-105 transition-transform" />
                          <span className="font-bold text-[11px] block">Official / Analyst</span>
                          <span className="text-[9px] text-muted-foreground mt-0.5 leading-tight block">Monitor hazards & analyze media feeds</span>
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full btn-ocean mt-2 flex items-center justify-center gap-2 h-11"
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
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;