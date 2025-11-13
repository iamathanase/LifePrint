import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Users, UserPlus, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  sender?: {
    full_name: string;
    avatar_url: string;
  };
}

interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  friend?: {
    full_name: string;
    avatar_url: string;
  };
}

interface RecommendedUser {
  user_id: string;
  full_name: string;
  avatar_url: string;
  compatibility_score: number;
  common_interests: string[];
}

const Friends = () => {
  const { user } = useAuth();
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFriendData();
    }
  }, [user]);

  const loadFriendData = async () => {
    try {
      // Load pending friend requests
      const { data: requests, error: requestsError } = await supabase
        .from('friend_requests')
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          created_at,
          sender:profiles!friend_requests_sender_id_fkey(full_name, avatar_url)
        `)
        .eq('receiver_id', user?.id)
        .eq('status', 'pending');

      if (requestsError) throw requestsError;
      setFriendRequests(requests || []);

      // Load existing friends
      const { data: friendships, error: friendsError } = await supabase
        .from('friendships')
        .select(`
          id,
          user_id,
          friend_id,
          friend:profiles!friendships_friend_id_fkey(full_name, avatar_url)
        `)
        .eq('user_id', user?.id);

      if (friendsError) throw friendsError;
      setFriends(friendships || []);

      // Load recommendations based on personality assessments
      await loadRecommendations();
    } catch (error) {
      console.error('Error loading friend data:', error);
      toast.error('Failed to load friends data');
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      // Get user's personality assessment
      const { data: myAssessment } = await supabase
        .from('persona_assessments')
        .select('personality_type, strengths')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!myAssessment) return;

      // Find users with similar personality types
      const { data: similarUsers } = await supabase
        .from('persona_assessments')
        .select('user_id, personality_type, strengths, profiles(full_name, avatar_url)')
        .neq('user_id', user?.id)
        .limit(10);

      if (similarUsers) {
        // Calculate compatibility and filter out existing friends
        const existingFriendIds = friends.map(f => f.friend_id);
        const recommended = similarUsers
          .filter(u => !existingFriendIds.includes(u.user_id))
          .map(u => {
            const commonStrengths = u.strengths?.filter((s: string) => 
              myAssessment.strengths?.includes(s)
            ) || [];
            
            return {
              user_id: u.user_id,
              full_name: u.profiles?.full_name || 'Unknown',
              avatar_url: u.profiles?.avatar_url || '',
              compatibility_score: Math.min(100, (commonStrengths.length * 20) + (u.personality_type === myAssessment.personality_type ? 30 : 0)),
              common_interests: commonStrengths
            };
          })
          .sort((a, b) => b.compatibility_score - a.compatibility_score)
          .slice(0, 5);

        setRecommendations(recommended);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const sendFriendRequest = async (receiverId: string) => {
    try {
      const { error } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: user?.id,
          receiver_id: receiverId
        });

      if (error) throw error;
      toast.success('Friend request sent!');
      loadRecommendations();
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error('Failed to send friend request');
    }
  };

  const handleFriendRequest = async (requestId: string, accept: boolean) => {
    try {
      if (accept) {
        // Update request status
        const { data: request, error: updateError } = await supabase
          .from('friend_requests')
          .update({ status: 'accepted' })
          .eq('id', requestId)
          .select()
          .single();

        if (updateError) throw updateError;

        // Create friendship (bidirectional)
        const { error: friendshipError } = await supabase
          .from('friendships')
          .insert([
            { user_id: request.receiver_id, friend_id: request.sender_id },
            { user_id: request.sender_id, friend_id: request.receiver_id }
          ]);

        if (friendshipError) throw friendshipError;
        toast.success('Friend request accepted!');
      } else {
        const { error } = await supabase
          .from('friend_requests')
          .update({ status: 'rejected' })
          .eq('id', requestId);

        if (error) throw error;
        toast.success('Friend request declined');
      }

      loadFriendData();
    } catch (error) {
      console.error('Error handling friend request:', error);
      toast.error('Failed to process friend request');
    }
  };

  const removeFriend = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);

      if (error) throw error;
      toast.success('Friend removed');
      loadFriendData();
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error('Failed to remove friend');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center cosmic-glow">
              <Users className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">Friends</h1>
            <p className="text-muted-foreground text-lg">Connect with like-minded individuals</p>
          </div>

          <Tabs defaultValue="recommendations" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="requests">
                Requests {friendRequests.length > 0 && `(${friendRequests.length})`}
              </TabsTrigger>
              <TabsTrigger value="friends">Friends ({friends.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="space-y-4">
              {recommendations.length === 0 ? (
                <Card className="glass-card p-8 text-center">
                  <p className="text-muted-foreground">Complete your personality assessment to get friend recommendations!</p>
                </Card>
              ) : (
                recommendations.map((rec) => (
                  <Card key={rec.user_id} className="glass-card p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={rec.avatar_url} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {rec.full_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">{rec.full_name}</h3>
                          <p className="text-sm text-primary">{rec.compatibility_score}% compatible</p>
                          {rec.common_interests.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Common: {rec.common_interests.slice(0, 2).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button onClick={() => sendFriendRequest(rec.user_id)}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Friend
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="requests" className="space-y-4">
              {friendRequests.length === 0 ? (
                <Card className="glass-card p-8 text-center">
                  <p className="text-muted-foreground">No pending friend requests</p>
                </Card>
              ) : (
                friendRequests.map((request) => (
                  <Card key={request.id} className="glass-card p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={request.sender?.avatar_url} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {request.sender?.full_name?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">{request.sender?.full_name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={() => handleFriendRequest(request.id, true)} size="sm">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => handleFriendRequest(request.id, false)} variant="outline" size="sm">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="friends" className="space-y-4">
              {friends.length === 0 ? (
                <Card className="glass-card p-8 text-center">
                  <p className="text-muted-foreground">No friends yet. Start connecting!</p>
                </Card>
              ) : (
                friends.map((friendship) => (
                  <Card key={friendship.id} className="glass-card p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={friendship.friend?.avatar_url} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {friendship.friend?.full_name?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">{friendship.friend?.full_name}</h3>
                        </div>
                      </div>
                      <Button onClick={() => removeFriend(friendship.id)} variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Friends;