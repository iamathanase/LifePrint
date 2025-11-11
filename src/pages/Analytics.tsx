import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Activity, Zap } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

export default function Analytics() {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState({
    dailyActiveUsers: 0,
    weeklyGrowth: 0,
    avgStoriesPerUser: 0,
    aiInteractions: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (!isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard");
      return;
    }

    fetchAnalytics();
  }, [isAdmin, isAuthenticated, navigate]);

  const fetchAnalytics = async () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      { count: aiCount },
      { data: recentUsers },
      { data: stories },
      { count: profilesCount }
    ] = await Promise.all([
      supabase.from("ai_interactions").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("created_at").gte("created_at", weekAgo.toISOString()),
      supabase.from("stories").select("user_id"),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
    ]);

    const weeklyGrowth = recentUsers ? ((recentUsers.length / (profilesCount || 1)) * 100).toFixed(1) : "0";
    const avgStories = stories && profilesCount ? (stories.length / profilesCount).toFixed(1) : "0";

    setAnalytics({
      dailyActiveUsers: recentUsers?.length || 0,
      weeklyGrowth: parseFloat(weeklyGrowth),
      avgStoriesPerUser: parseFloat(avgStories),
      aiInteractions: aiCount || 0,
    });
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold text-gradient">Analytics Dashboard</h1>
            </div>
            <p className="text-muted-foreground">Platform insights and user engagement metrics</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="glass-card cosmic-glow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gradient">{analytics.dailyActiveUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
              </CardContent>
            </Card>

            <Card className="glass-card cosmic-glow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Weekly Growth</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gradient">{analytics.weeklyGrowth}%</div>
                <p className="text-xs text-muted-foreground mt-1">New user rate</p>
              </CardContent>
            </Card>

            <Card className="glass-card cosmic-glow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Stories/User</CardTitle>
                <BarChart3 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gradient">{analytics.avgStoriesPerUser}</div>
                <p className="text-xs text-muted-foreground mt-1">Average engagement</p>
              </CardContent>
            </Card>

            <Card className="glass-card cosmic-glow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
                <Zap className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gradient">{analytics.aiInteractions}</div>
                <p className="text-xs text-muted-foreground mt-1">Total requests</p>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
              <CardDescription>Key metrics and performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">User Engagement</h3>
                  <p className="text-sm text-muted-foreground">
                    Users are actively engaging with the platform, with an average of {analytics.avgStoriesPerUser} stories per user.
                    Weekly growth rate shows {analytics.weeklyGrowth}% increase in new signups.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">AI Features</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered features have been used {analytics.aiInteractions} times, helping users gain insights
                    and personalized recommendations across PersonaPrint, FoodPrint, and StoryWeaver modules.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}