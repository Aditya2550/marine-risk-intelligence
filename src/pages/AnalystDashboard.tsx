import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import {
  Map, Activity, TrendingUp, Users, AlertTriangle, MessageSquare,
  Filter, Search, MapPin, Clock, Shield, ThumbsUp, ThumbsDown,
  Zap, Eye, Download, RefreshCw, Radio, BrainCircuit, Terminal
} from "lucide-react";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Services
import { generateMockSourceItem, SourceItem } from "@/services/sources";
import { LLMService, TrendAnalysisResult } from "@/services/llm";

interface User {
  name: string;
  email: string;
  role: 'citizen' | 'analyst';
}

interface Report {
  id: string;
  type: string;
  location: string;
  description: string;
  timestamp: Date;
  status: 'new' | 'reviewing' | 'verified' | 'false-alarm';
  priority: 'low' | 'medium' | 'high' | 'critical';
  coordinates: [number, number];
  citizenName: string;
  confidence?: number;
}

const AnalystDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [reports, setReports] = useState<Report[]>([]);

  // LLM & Simulation State
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
  const [isSimulating, setIsSimulating] = useState(false);
  const [rawFeed, setRawFeed] = useState<SourceItem[]>([]);
  const [processedCount, setProcessedCount] = useState(0);
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysisResult | null>(null);

  const llmServiceRef = useRef<LLMService | null>(null);

  // Initialize user
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.role !== 'analyst') {
        navigate('/citizen');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Simulation Loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isSimulating && apiKey) {
      if (!llmServiceRef.current) {
        llmServiceRef.current = new LLMService(apiKey);
      }

      interval = setInterval(async () => {
        // 1. Generate a mock item
        const newItem = generateMockSourceItem();

        // Update raw feed (keep last 50)
        setRawFeed(prev => [newItem, ...prev].slice(0, 50));
        setProcessedCount(c => c + 1);

        // 2. Analyze with LLM
        if (llmServiceRef.current) {
          try {
            const analysis = await llmServiceRef.current.analyzeHazard(newItem);

            if (analysis && analysis.isRelevant) {
              // Create a new report from the analysis
              const newReport: Report = {
                id: Math.random().toString(36).substring(7),
                type: analysis.hazardType || 'Unknown Hazard',
                location: newItem.location || 'Unknown Location',
                description: analysis.summary || newItem.content,
                timestamp: new Date(),
                status: 'new',
                priority: analysis.priority || 'medium',
                coordinates: [20.5937 + (Math.random() - 0.5) * 10, 78.9629 + (Math.random() - 0.5) * 10], // Random approx coords for now
                citizenName: newItem.author || 'System Monitor',
                confidence: analysis.confidence
              };

              setReports(prev => [newReport, ...prev]);

              toast({
                title: "New Hazard Detected",
                description: `${analysis.hazardType} at ${newItem.location}`,
                variant: analysis.priority === 'critical' ? 'destructive' : 'default'
              });
            }
          } catch (e) {
            console.error("Analysis failed", e);
          }
        }
      }, 4000); // New item every 4 seconds
    }

    return () => clearInterval(interval);
  }, [isSimulating, apiKey, toast]);

  // Periodic Trend Analysis (every 30 seconds of simulation)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isSimulating && apiKey) {
      interval = setInterval(async () => {
        if (rawFeed.length > 5 && llmServiceRef.current) {
          const analysis = await llmServiceRef.current.analyzeTrends(rawFeed.slice(0, 20)); // Analyze last 20 items
          if (analysis) {
            setTrendAnalysis(analysis);
            toast({
              title: "Trend Analysis Updated",
              description: "New insights generated from recent data stream.",
            });
          }
        }
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [isSimulating, apiKey, rawFeed]);


  // Initialize Leaflet map
  useEffect(() => {
    if (selectedTab === 'map') {
      setTimeout(() => {
        const mapContainer = document.getElementById('map');
        if (mapContainer && !mapContainer.hasChildNodes()) {
          const map = (window as any).L.map('map').setView([20.5937, 78.9629], 5);
          (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
          }).addTo(map);

          reports.forEach((report) => {
            const marker = (window as any).L.marker(report.coordinates).addTo(map);
            marker.bindPopup(`
              <div>
                <h3><strong>${report.type}</strong></h3>
                <p>Confidence: ${(report.confidence || 0) * 100}%</p>
                <p>${report.description}</p>
              </div>
            `);
          });
        }
      }, 100);
    }
  }, [selectedTab, reports]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-coral text-coral-foreground';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-coral text-coral-foreground';
      case 'reviewing': return 'bg-primary/20 text-primary';
      case 'verified': return 'bg-seafoam text-seafoam-foreground';
      case 'false-alarm': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-seafoam';
      case 'negative': return 'text-muted-foreground';
      case 'urgent': return 'text-coral';
      default: return 'text-muted-foreground';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="w-4 h-4" />;
      case 'negative': return <ThumbsDown className="w-4 h-4" />;
      case 'urgent': return <Zap className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />

      <div className="container px-4 py-8">

        {/* Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 bg-card p-4 rounded-xl border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BrainCircuit className="text-seafoam" />
              AI Analyst Dashboard
            </h1>
            <p className="text-muted-foreground text-sm">
              LLM-powered hazard detection & trend monitoring
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {!apiKey ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-coral text-coral hover:bg-coral/10">
                    <Zap className="w-4 h-4 mr-2" />
                    Enter API Key
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Gemini API Key Required</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      To enable LLM analysis, please enter a valid Google Gemini API Key.
                      The key is stored only in memory for this session.
                    </p>
                    <Label>API Key</Label>
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={() => document.getElementById('close-dialog')?.click()}>Save</Button>
                    {/* Note: This is a hacky close, usually state controlled dialog is better but trying to be non-intrusive */}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                  API Connected
                </Badge>
                <Button
                  variant={isSimulating ? "destructive" : "default"}
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={isSimulating ? "" : "bg-seafoam hover:bg-seafoam/90"}
                >
                  {isSimulating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Stop Monitoring
                    </>
                  ) : (
                    <>
                      <Radio className="w-4 h-4 mr-2" /> Start Simulation
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Real-time Ticker */}
        {isSimulating && (
          <div className="mb-6 p-3 bg-muted/40 rounded-lg border flex items-center gap-3 overflow-hidden">
            <Terminal className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex-1 text-sm font-mono text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="text-primary font-bold">LIVE FEED: </span>
              {rawFeed[0] ? `[${rawFeed[0].source.toUpperCase()}] ${rawFeed[0].content}` : "Waiting for data..."}
            </div>
            <Badge variant="secondary">{processedCount} processed</Badge>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Raw Feed Panel */}
          <Card className="col-span-1 border-r h-[500px] flex flex-col">
            <CardHeader className="py-4 border-b">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Raw Data Source
                <Badge variant="outline" className="text-[10px]">Real-time</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
              {rawFeed.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  Click "Start Simulation" to begin ingesting raw data.
                </div>
              ) : (
                <div className="divide-y">
                  {rawFeed.map((item) => (
                    <div key={item.id} className="p-3 hover:bg-primary/5 transition-colors text-xs">
                      <div className="flex items-center justify-between mb-1 text-muted-foreground">
                        <span className="font-semibold uppercase text-[10px]">{item.source}</span>
                        <span>{item.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <p className="line-clamp-2">{item.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Dashboard Area */}
          <div className="col-span-1 md:col-span-3">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Insights & Overview</TabsTrigger>
                <TabsTrigger value="reports">Detected Hazards ({reports.length})</TabsTrigger>
                <TabsTrigger value="map">Live Map</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* AI Trend Analysis */}
                {trendAnalysis ? (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-primary" />
                        Current Situation Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-medium text-foreground mb-4">
                        {trendAnalysis.summary}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {trendAnalysis.trendingKeywords?.map(k => (
                          <Badge key={k.word} variant="secondary" className="px-3 py-1">
                            #{k.word} ({k.count})
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="p-8 text-center text-muted-foreground">
                      Waiting for sufficient data to generate AI insights...
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader><CardTitle className="text-sm">Total Reports</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-bold">{reports.length}</p></CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle className="text-sm">Critical Events</CardTitle></CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-red-500">
                        {reports.filter(r => r.priority === 'critical').length}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="reports">
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {reports.length === 0 ? (
                    <div className="text-center p-12 text-muted-foreground">
                      No hazards detected yet. Start the simulation.
                    </div>
                  ) : (
                    reports.map(report => (
                      <Card key={report.id} className="cursor-pointer hover:border-primary transition-all">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold flex items-center gap-2">
                                {report.type}
                                <Badge className={getPriorityColor(report.priority)}>
                                  {report.priority}
                                </Badge>
                              </h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" /> {report.location}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {report.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm bg-muted/50 p-2 rounded italic mb-2">
                            "{report.description}"
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              Confidence: {((report.confidence || 0) * 100).toFixed(0)}%
                            </span>
                            <span>Source: {report.citizenName}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="map">
                <div id="map" className="h-[500px] w-full rounded-xl bg-muted" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalystDashboard;