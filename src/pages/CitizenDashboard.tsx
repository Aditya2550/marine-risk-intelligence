/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Camera,
  Upload,
  Send,
  Map,
  AlertTriangle,
  Shield,
  Navigation,
  Smartphone,
  Globe,
  Wifi,
  WifiOff,
  Clock,
  CheckCircle,
  Activity,
} from "lucide-react";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface User {
  name: string;
  email: string;
  role: "citizen" | "analyst";
}

interface HazardReport {
  id: string;
  type: string;
  location: string;
  description: string;
  timestamp: Date;
  status: "submitted" | "reviewing" | "verified";
}

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [reports, setReports] = useState<HazardReport[]>([]);
  const [isOffline, setIsOffline] = useState(false);

  const [reportData, setReportData] = useState({
    type: "",
    location: "",
    description: "",
    coordinates: { lat: "", lng: "" },
    media: null as File | null,
  });

  const hazardTypes = [
    "Tsunami Warning",
    "Coastal Flooding",
    "High Tide Alert",
    "Storm Surge",
    "Coastal Erosion",
    "Debris on Shore",
    "Water Quality Issue",
    "Marine Life Distress",
    "Infrastructure Damage",
    "Other",
  ];

  const safeLocations = [
    { name: "Community Center", distance: "0.5 km", type: "Shelter" },
    { name: "Hospital", distance: "1.2 km", type: "Medical" },
    { name: "High Ground Park", distance: "0.8 km", type: "Evacuation" },
    { name: "Emergency Services", distance: "2.1 km", type: "Emergency" },
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      if (parsedUser.role !== "citizen") {
        navigate("/analyst");
        return;
      }
    } else {
      navigate("/login");
      return;
    }

    // Simulate some existing reports
    setReports([
      {
        id: "1",
        type: "Coastal Flooding",
        location: "Marina Beach, Chennai",
        description: "Water levels rising near the shore",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: "verified",
      },
      {
        id: "2",
        type: "High Tide Alert",
        location: "Kovalam Beach, Kerala",
        description: "Unusually high waves observed",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        status: "reviewing",
      },
    ]);

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setReportData((prev) => ({
            ...prev,
            coordinates: {
              lat: position.coords.latitude.toString(),
              lng: position.coords.longitude.toString(),
            },
            location: `Lat: ${position.coords.latitude.toFixed(
              4
            )}, Lng: ${position.coords.longitude.toFixed(4)}`,
          }));
        },
        (error) => {
          console.log("Location access denied:", error);
        }
      );
    }

    // Check network status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [navigate]);

  // Initialize map when showMapView becomes true
  useEffect(() => {
    if (showMapView) {
      // Cleanup existing map first
      if ((window as any).citizenMap) {
        (window as any).citizenMap.remove();
        (window as any).citizenMap = null;
      }
      // Delay to ensure DOM is ready and Leaflet is loaded
      setTimeout(initializeMap, 200);
    }

    // Cleanup on unmount
    return () => {
      if ((window as any).citizenMap) {
        (window as any).citizenMap.remove();
        (window as any).citizenMap = null;
      }
    };
  }, [showMapView, reports]);

  const initializeMap = () => {
    console.log("initializeMap called");
    const mapElement = document.getElementById("citizen-map");
    if (!mapElement) {
      console.error("Map container not found");
      return;
    }

    // Check if Leaflet is loaded
    if (!(window as any).L) {
      console.error("Leaflet is not loaded, retrying...");
      setTimeout(initializeMap, 500); // Retry after 500ms
      return;
    }

    console.log("Leaflet is loaded, initializing map...");

    try {
      // Initialize map centered on India
      const map = (window as any).L.map("citizen-map").setView(
        [20.5937, 78.9629],
        5
      );
      (window as any).citizenMap = map;
      console.log("Map created successfully");

      // Add OpenStreetMap tiles
      (window as any).L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          attribution: "© OpenStreetMap contributors",
        }
      ).addTo(map);

      // Add citizen's current location if available
      if (reportData.coordinates.lat && reportData.coordinates.lng) {
        const lat = parseFloat(reportData.coordinates.lat);
        const lng = parseFloat(reportData.coordinates.lng);
        const userMarker = (window as any).L.marker([lat, lng]).addTo(map);
        userMarker
          .bindPopup("<b>Your Location</b><br>You are here")
          .openPopup();
        map.setView([lat, lng], 12);
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          const userMarker = (window as any).L.marker([lat, lon]).addTo(map);
          userMarker
            .bindPopup("<b>Your Location</b><br>You are here")
            .openPopup();
          map.setView([lat, lon], 12);
        });
      }

      // Sample hazard reports (color-coded pins)
      const hazards = [
        {
          type: "Flood",
          coords: [28.6139, 77.209],
          desc: "Severe flooding near Delhi",
          severity: "high",
        },
        {
          type: "High Waves",
          coords: [19.076, 72.8777],
          desc: "High tides reported in Mumbai",
          severity: "medium",
        },
        {
          type: "Oil Spill",
          coords: [13.0827, 80.2707],
          desc: "Oil slick spotted in Chennai",
          severity: "high",
        },
        {
          type: "Coastal Erosion",
          coords: [11.9416, 79.8083],
          desc: "Beach erosion in Puducherry",
          severity: "low",
        },
        {
          type: "Tsunami Warning",
          coords: [8.5241, 76.9366],
          desc: "Tsunami alert in Kerala",
          severity: "critical",
        },
      ];

      // Define colors for hazard types and severity
      const hazardColors: { [key: string]: string } = {
        critical: "#dc2626", // red-600
        high: "#ea580c", // orange-600
        medium: "#ca8a04", // yellow-600
        low: "#16a34a", // green-600
      };

      // Add hazard markers
      hazards.forEach(function (hazard) {
        const marker = (window as any).L.circleMarker(hazard.coords, {
          color: hazardColors[hazard.severity],
          radius: 8,
          fillOpacity: 0.8,
          weight: 2,
        }).addTo(map);

        marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: ${
            hazardColors[hazard.severity]
          }; font-weight: bold;">
            ${hazard.type}
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px;">${hazard.desc}</p>
          <div style="font-size: 12px; color: #666;">
            <span style="background: ${
              hazardColors[hazard.severity]
            }; color: white; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
              ${hazard.severity}
            </span>
          </div>
        </div>
      `);
      });

      // Add user's own reports to the map
      reports.forEach(function (report) {
        if (report.location && report.location.includes("Lat:")) {
          const coords = report.location.replace("Lat: ", "").split(", Lng: ");
          const lat = parseFloat(coords[0]);
          const lng = parseFloat(coords[1]);

          if (!isNaN(lat) && !isNaN(lng)) {
            const marker = (window as any).L.circleMarker([lat, lng], {
              color: "#3b82f6", // blue-500
              radius: 6,
              fillOpacity: 0.8,
              weight: 2,
            }).addTo(map);

            marker.bindPopup(`
            <div style="min-width: 180px;">
              <h3 style="margin: 0 0 8px 0; color: #3b82f6; font-weight: bold;">
                Your Report: ${report.type}
              </h3>
              <p style="margin: 0 0 8px 0; font-size: 14px;">${report.description}</p>
              <div style="font-size: 12px; color: #666;">
                Status: <span style="color: #3b82f6;">${report.status}</span>
              </div>
            </div>
          `);
          }
        }
      });

      // Add hotspot/danger zones (red circles)
      const hotspots = [
        {
          center: [28.61, 77.2],
          radius: 15000,
          desc: "Delhi Flood Zone: High risk area",
        },
        {
          center: [19.07, 72.87],
          radius: 12000,
          desc: "Mumbai Coastal Zone: High wave risk",
        },
        {
          center: [13.08, 80.27],
          radius: 10000,
          desc: "Chennai Port: Oil spill contamination zone",
        },
      ];

      hotspots.forEach(function (hotspot) {
        const circle = (window as any).L.circle(hotspot.center, {
          color: "#dc2626",
          fillColor: "#fca5a5",
          fillOpacity: 0.2,
          radius: hotspot.radius,
          weight: 2,
        }).addTo(map);

        circle.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: #dc2626; font-weight: bold;">
            ⚠️ Danger Zone
          </h3>
          <p style="margin: 0; font-size: 14px;">${hotspot.desc}</p>
        </div>
      `);
      });
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSubmitReport = () => {
    if (!reportData.type || !reportData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in hazard type and description.",
        variant: "destructive",
      });
      return;
    }

    const newReport: HazardReport = {
      id: Date.now().toString(),
      type: reportData.type,
      location: reportData.location || "Manual Location",
      description: reportData.description,
      timestamp: new Date(),
      status: "submitted",
    };

    setReports((prev) => [newReport, ...prev]);

    // Reset form
    setReportData({
      type: "",
      location: reportData.location, // Keep location
      description: "",
      coordinates: reportData.coordinates, // Keep coordinates
      media: null,
    });

    setShowReportForm(false);

    if (isOffline) {
      toast({
        title: "Report Saved Offline",
        description: "Your report will be synced when connection is restored.",
      });
    } else {
      toast({
        title: "Report Submitted",
        description: "Thank you for helping protect the community!",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-seafoam text-seafoam-foreground";
      case "reviewing":
        return "bg-primary/20 text-primary";
      case "submitted":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-4 h-4" />;
      case "reviewing":
        return <Activity className="w-4 h-4" />;
      case "submitted":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleSOSClick = () => {
    toast({
      title: "SOS Alert Triggered",
      description: "Emergency services have been notified of your location.",
      variant: "destructive",
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />

      {/* SOS Emergency Button */}
      <Button
        onClick={handleSOSClick}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        size="icon"
      >
        SOS
      </Button>

      {/* Network Status */}
      {isOffline && (
        <div className="bg-coral text-coral-foreground px-4 py-2 text-center text-sm font-medium">
          <WifiOff className="inline w-4 h-4 mr-2" />
          Offline Mode - Reports will sync when connection is restored
        </div>
      )}

      <div className="container px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.name}
          </h1>
          <p className="text-muted-foreground">
            Help protect your community by reporting coastal hazards in
            real-time.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card
                className="card-ocean cursor-pointer"
                onClick={() => setShowReportForm(!showReportForm)}
              >
                <CardContent className="flex items-center p-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-coral/10 mr-4">
                    <AlertTriangle className="w-6 h-6 text-coral" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Report Hazard
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Submit new hazard report
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="card-ocean cursor-pointer"
                onClick={() => setShowMapView(!showMapView)}
              >
                <CardContent className="flex items-center p-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mr-4">
                    <Map className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">View Map</h3>
                    <p className="text-sm text-muted-foreground">
                      Interactive hazard map
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interactive Map View */}
            {showMapView && (
              <Card className="card-ocean">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="w-5 h-5" />
                    Interactive Hazard Map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Your Location</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                        <span>Critical Hazards</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                        <span>High Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                        <span>Medium Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        <span>Low Risk</span>
                      </div>
                    </div>
                    <div
                      id="citizen-map"
                      className="rounded-lg overflow-hidden border"
                      style={{
                        height: "500px",
                        width: "100%",
                        minHeight: "500px",
                        backgroundColor: "#f0f0f0",
                      }}
                    ></div>
                    <Button
                      variant="outline"
                      onClick={() => setShowMapView(false)}
                      className="w-full"
                    >
                      Close Map
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Report Form */}
            {showReportForm && (
              <Card className="card-ocean">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-coral" />
                    Submit Hazard Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hazard-type">Hazard Type</Label>
                      <Select
                        value={reportData.type}
                        onValueChange={(value) =>
                          setReportData((prev) => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger className="input-ocean">
                          <SelectValue placeholder="Select hazard type" />
                        </SelectTrigger>
                        <SelectContent>
                          {hazardTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="flex gap-2">
                        <Input
                          id="location"
                          placeholder="Enter location or use GPS"
                          value={reportData.location}
                          onChange={(e) =>
                            setReportData((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          className="input-ocean"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="shrink-0"
                          onClick={() => {
                            if (navigator.geolocation) {
                              navigator.geolocation.getCurrentPosition(
                                (position) => {
                                  setReportData((prev) => ({
                                    ...prev,
                                    location: `GPS: ${position.coords.latitude.toFixed(
                                      4
                                    )}, ${position.coords.longitude.toFixed(
                                      4
                                    )}`,
                                  }));
                                  toast({
                                    title: "Location Updated",
                                    description:
                                      "GPS coordinates captured successfully.",
                                  });
                                }
                              );
                            }
                          }}
                        >
                          <Navigation className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the hazard in detail..."
                      rows={4}
                      value={reportData.description}
                      onChange={(e) =>
                        setReportData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="input-ocean resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="media">Photo/Video Upload</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        Take Photo
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Upload File
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      className="btn-coral flex-1"
                      onClick={handleSubmitReport}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Report
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowReportForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* My Reports */}
            <Card className="card-ocean">
              <CardHeader>
                <CardTitle>My Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No reports submitted yet.</p>
                      <p className="text-sm">
                        Help protect your community by reporting hazards.
                      </p>
                    </div>
                  ) : (
                    reports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-coral/10">
                          <AlertTriangle className="w-5 h-5 text-coral" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-foreground">
                              {report.type}
                            </h4>
                            <Badge
                              className={`${getStatusColor(
                                report.status
                              )} text-xs`}
                            >
                              {getStatusIcon(report.status)}
                              <span className="ml-1 capitalize">
                                {report.status}
                              </span>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {report.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {report.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {report.timestamp.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="card-ocean">
              <CardHeader>
                <CardTitle className="text-lg">Your Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Reports Submitted
                    </span>
                    <span className="font-semibold text-lg text-primary">
                      {reports.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Verified Reports
                    </span>
                    <span className="font-semibold text-lg text-seafoam">
                      {reports.filter((r) => r.status === "verified").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Community Score
                    </span>
                    <span className="font-semibold text-lg text-coral">85</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nearest Safe Locations */}
            <Card className="card-ocean">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-seafoam" />
                  Nearest Safe Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {safeLocations.map((location, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-seafoam/5 rounded-lg"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-seafoam/20">
                        <MapPin className="w-4 h-4 text-seafoam" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-foreground">
                          {location.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {location.distance} • {location.type}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Language & Offline Features */}
            <Card className="card-ocean">
              <CardHeader>
                <CardTitle className="text-lg">Quick Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="w-4 h-4 mr-2" />
                  Change Language
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  {isOffline ? (
                    <WifiOff className="w-4 h-4 mr-2" />
                  ) : (
                    <Wifi className="w-4 h-4 mr-2" />
                  )}
                  {isOffline ? "Offline Mode" : "Online Mode"}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Emergency Contacts
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
