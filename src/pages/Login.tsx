import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Waves, User, Shield, LogIn, UserPlus } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  email: string;
  password: string;
  name: string;
  role: 'citizen' | 'analyst';
}

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  
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

  // Demo credentials
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

  const handleLogin = () => {
    const account = demoAccounts[loginData.email as keyof typeof demoAccounts];
    
    if (account && account.password === loginData.password) {
      const userData = {
        name: account.name,
        role: account.role,
        email: loginData.email
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      toast({
        title: "Login Successful",
        description: `Welcome back, ${account.name}!`,
      });
      
      // Redirect based on role
      if (account.role === 'citizen') {
        navigate('/citizen');
      } else {
        navigate('/analyst');
      }
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Try demo accounts from the landing page.",
        variant: "destructive",
      });
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

    const userData = {
      name: registerData.name,
      role: registerData.role,
      email: registerData.email
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    toast({
      title: "Registration Successful", 
      description: `Welcome to the platform, ${registerData.name}!`,
    });
    
    // Redirect based on role
    if (registerData.role === 'citizen') {
      navigate('/citizen');
    } else {
      navigate('/analyst');
    }
  };

  const fillDemoCredentials = (type: 'citizen' | 'analyst') => {
    if (type === 'citizen') {
      setLoginData({
        email: 'citizen_demo@demo.com',
        password: 'citizen123'
      });
    } else {
      setLoginData({
        email: 'analyst_demo@demo.com', 
        password: 'analyst123'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-ocean">
                <Waves className="w-8 h-8 text-white animate-wave" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Access Platform
            </h1>
            <p className="text-muted-foreground">
              Join the coastal hazard monitoring network
            </p>
          </div>

          {/* Demo Credentials Card */}
          <Card className="mb-6 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-primary flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Demo Accounts for Jury
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <div className="font-medium">Citizen Demo</div>
                  <div className="text-xs text-muted-foreground">citizen_demo@demo.com | citizen123</div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => fillDemoCredentials('citizen')}
                  className="hover:bg-primary/10"
                >
                  Fill
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <div className="font-medium">Analyst Demo</div>
                  <div className="text-xs text-muted-foreground">analyst_demo@demo.com | analyst123</div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => fillDemoCredentials('analyst')}
                  className="hover:bg-primary/10"
                >
                  Fill
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Auth Forms */}
          <Card className="card-ocean">
            <Tabs value={isLogin ? "login" : "register"} onValueChange={(value) => setIsLogin(value === "login")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Register
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <CardHeader>
                  <CardTitle>Sign In</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      className="input-ocean"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      className="input-ocean"
                    />
                  </div>
                  
                  <Button 
                    className="w-full btn-ocean"
                    onClick={handleLogin}
                  >
                    Sign In
                    <LogIn className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="register">
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      placeholder="Enter your full name"
                      value={registerData.name}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                      className="input-ocean"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Enter your email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      className="input-ocean"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Create a password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      className="input-ocean"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role-select">Role</Label>
                    <Select 
                      value={registerData.role} 
                      onValueChange={(value: 'citizen' | 'analyst') => setRegisterData(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger className="input-ocean">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="citizen">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Citizen / Volunteer
                          </div>
                        </SelectItem>
                        <SelectItem value="analyst">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Analyst / Official
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    className="w-full btn-ocean"
                    onClick={handleRegister}
                  >
                    Create Account
                    <UserPlus className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;