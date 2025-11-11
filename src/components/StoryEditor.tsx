import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save, Trash2 } from "lucide-react";

type Story = {
  id: string;
  title: string;
  content: string;
  moodTag: string;
  privacy: string;
  timestamp: Date;
};

export const StoryEditor = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [moodTag, setMoodTag] = useState("");
  const [privacy, setPrivacy] = useState("private");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = () => {
    if (!title || !content) {
      toast.error("Please add a title and content");
      return;
    }

    if (editingId) {
      setStories(stories.map(story => 
        story.id === editingId 
          ? { ...story, title, content, moodTag, privacy }
          : story
      ));
      toast.success("Story updated!");
      setEditingId(null);
    } else {
      const newStory: Story = {
        id: Date.now().toString(),
        title,
        content,
        moodTag,
        privacy,
        timestamp: new Date()
      };
      setStories([newStory, ...stories]);
      toast.success("Story saved!");
    }

    // Reset form
    setTitle("");
    setContent("");
    setMoodTag("");
    setPrivacy("private");
  };

  const handleEdit = (story: Story) => {
    setTitle(story.title);
    setContent(story.content);
    setMoodTag(story.moodTag);
    setPrivacy(story.privacy);
    setEditingId(story.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    setStories(stories.filter(story => story.id !== id));
    toast.success("Story deleted");
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">
          {editingId ? "Edit Your Story" : "Write Your Story"}
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Give your story a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="content">Your Story</Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts, feelings, and reflections..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="moodTag">Mood Tag</Label>
              <Select value={moodTag} onValueChange={setMoodTag}>
                <SelectTrigger>
                  <SelectValue placeholder="How are you feeling?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grateful">😊 Grateful</SelectItem>
                  <SelectItem value="reflective">🤔 Reflective</SelectItem>
                  <SelectItem value="hopeful">🌟 Hopeful</SelectItem>
                  <SelectItem value="nostalgic">💭 Nostalgic</SelectItem>
                  <SelectItem value="inspired">✨ Inspired</SelectItem>
                  <SelectItem value="contemplative">🧘 Contemplative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="privacy">Privacy</Label>
              <Select value={privacy} onValueChange={setPrivacy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">🔒 Private</SelectItem>
                  <SelectItem value="friends">👥 Friends Only</SelectItem>
                  <SelectItem value="public">🌍 Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-primary to-accent"
          >
            <Save className="w-4 h-4 mr-2" />
            {editingId ? "Update Story" : "Save Story"}
          </Button>
        </div>
      </Card>

      {stories.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Your Stories</h3>
          {stories.map((story) => (
            <Card key={story.id} className="glass-card p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-lg font-semibold text-foreground">{story.title}</h4>
                  <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                    <span>{story.timestamp.toLocaleDateString()}</span>
                    {story.moodTag && <span>• {story.moodTag}</span>}
                    <span>• {story.privacy}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(story)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(story.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-foreground whitespace-pre-wrap">{story.content}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
