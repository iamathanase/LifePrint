-- Create friendships table
CREATE TABLE public.friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

-- Create friend_requests table
CREATE TABLE public.friend_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(sender_id, receiver_id),
  CHECK (sender_id != receiver_id)
);

-- Enable RLS
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for friendships
CREATE POLICY "Users can view their own friendships"
  ON public.friendships FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can delete their own friendships"
  ON public.friendships FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- RLS policies for friend_requests
CREATE POLICY "Users can view requests they sent or received"
  ON public.friend_requests FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create friend requests"
  ON public.friend_requests FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update requests they received"
  ON public.friend_requests FOR UPDATE
  USING (auth.uid() = receiver_id);

CREATE POLICY "Users can delete requests they sent"
  ON public.friend_requests FOR DELETE
  USING (auth.uid() = sender_id);

-- Create trigger for updated_at
CREATE TRIGGER update_friend_requests_updated_at
  BEFORE UPDATE ON public.friend_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_friendships_user_id ON public.friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON public.friendships(friend_id);
CREATE INDEX idx_friend_requests_sender_id ON public.friend_requests(sender_id);
CREATE INDEX idx_friend_requests_receiver_id ON public.friend_requests(receiver_id);
CREATE INDEX idx_friend_requests_status ON public.friend_requests(status);