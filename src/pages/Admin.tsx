import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Target, Utensils, Shield } from "lucide-react";
import { toast } from "sonner";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

export default function Admin() {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStories: 0,
    totalGoals: 0,
    totalFoodLogs: 0,
  });
  const [users, setUsers] = useState<any[]>([]);

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

    fetchStats();
    fetchUsers();
  }, [isAdmin, isAuthenticated, navigate]);

  const fetchStats = async () => {
    const [
      { count: usersCount },
      { count: storiesCount },
      { count: goalsCount },
      { count: foodLogsCount }
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("stories").select("*", { count: "exact", head: true }),
      supabase.from("time_capsule_goals").select("*", { count: "exact", head: true }),
      supabase.from("food_logs").select("*", { count: "exact", head: true }),
    ]);

    setStats({
      totalUsers: usersCount || 0,
      totalStories: storiesCount || 0,
      totalGoals: goalsCount || 0,
      totalFoodLogs: foodLogsCount || 0,
    });
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*, user_roles(role)")
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error && data) {
      setUsers(data);
    }
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
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold text-gradient">Admin Panel</h1>
            </div>
            <p className="text-muted-foreground">Manage users and monitor platform activity</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gradient">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Stories</CardTitle>
                <FileText className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gradient">{stats.totalStories}</div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Goals</CardTitle>
                <Target className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gradient">{stats.totalGoals}</div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Food Logs</CardTitle>
                <Utensils className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gradient">{stats.totalFoodLogs}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Latest registered users on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border">
                    <div>
                      <p className="font-medium">{user.full_name || "Anonymous"}</p>
                      <p className="text-sm text-muted-foreground">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {user.user_roles?.some((r: any) => r.role === 'admin') && (
                        <Badge variant="default">Admin</Badge>
                      )}
                      {user.user_roles?.some((r: any) => r.role === 'user') && (
                        <Badge variant="outline">User</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}