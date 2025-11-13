import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const comprehensiveQuestions = [
  {
    category: "Social Preferences",
    question: "How do you prefer to spend your free time?",
    options: ["Reading or learning", "Socializing with friends", "Physical activities", "Creative pursuits"]
  },
  {
    category: "Decision Making",
    question: "When making decisions, you rely more on:",
    options: ["Logic and analysis", "Intuition and feelings", "Past experiences", "Others' advice"]
  },
  {
    category: "Motivation",
    question: "What motivates you most?",
    options: ["Achievement and success", "Helping others", "Personal growth", "Stability and security"]
  },
  {
    category: "Social Behavior",
    question: "In social situations, you are typically:",
    options: ["The life of the party", "A good listener", "Thoughtful observer", "Selective engager"]
  },
  {
    category: "Work Style",
    question: "Your ideal work environment is:",
    options: ["Structured and organized", "Flexible and creative", "Collaborative and social", "Independent and quiet"]
  },
  {
    category: "Stress Management",
    question: "When stressed, you tend to:",
    options: ["Analyze the problem logically", "Seek support from others", "Take time alone to reflect", "Stay busy with activities"]
  },
  {
    category: "Communication",
    question: "Your communication style is:",
    options: ["Direct and concise", "Warm and expressive", "Thoughtful and deliberate", "Adaptive to the situation"]
  },
  {
    category: "Conflict Resolution",
    question: "When facing conflict, you:",
    options: ["Address it immediately", "Avoid confrontation", "Seek compromise", "Analyze all perspectives"]
  },
  {
    category: "Learning Style",
    question: "You learn best through:",
    options: ["Reading and research", "Hands-on experience", "Discussion and collaboration", "Visual demonstrations"]
  },
  {
    category: "Values",
    question: "What do you value most in relationships?",
    options: ["Honesty and transparency", "Emotional support", "Shared experiences", "Intellectual connection"]
  },
  {
    category: "Risk Taking",
    question: "When it comes to taking risks, you are:",
    options: ["Calculated and cautious", "Adventurous and spontaneous", "Balanced and moderate", "Prefer stability"]
  },
  {
    category: "Time Management",
    question: "How do you manage your time?",
    options: ["Detailed schedules and plans", "Flexible and spontaneous", "Priority-based approach", "Go with the flow"]
  },
  {
    category: "Creativity",
    question: "You express creativity through:",
    options: ["Art and design", "Problem-solving", "Writing and storytelling", "Music or performance"]
  },
  {
    category: "Goal Setting",
    question: "How do you approach goals?",
    options: ["Set clear, specific targets", "Keep flexible aspirations", "Break into small steps", "Focus on the journey"]
  },
  {
    category: "Emotional Expression",
    question: "You express emotions:",
    options: ["Openly and freely", "In close relationships only", "Through actions not words", "Reserved and private"]
  }
];

export const EnhancedAssessmentWizard = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentStep]: answer });
    
    if (currentStep < comprehensiveQuestions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    toast.loading("Analyzing your responses...");

    try {
      // Call edge function to generate personality insights
      const { data, error } = await supabase.functions.invoke('generate-personality-insights', {
        body: { answers: Object.values(answers) }
      });

      if (error) throw error;

      // Store the assessment results
      const { error: insertError } = await supabase
        .from('persona_assessments')
        .insert({
          assessment_data: answers,
          personality_type: data.personalityType,
          strengths: data.strengths,
          areas_for_growth: data.areasForGrowth
        });

      if (insertError) throw insertError;

      toast.success("Assessment complete! Your PersonaPrint is ready.");
      setTimeout(onComplete, 1500);
    } catch (error) {
      console.error('Error completing assessment:', error);
      toast.error("Failed to complete assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / comprehensiveQuestions.length) * 100;
  const isLastQuestion = currentStep === comprehensiveQuestions.length - 1;
  const isAnswered = answers[currentStep] !== undefined;

  return (
    <Card className="glass-card p-8 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentStep + 1} of {comprehensiveQuestions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-primary mt-2">{comprehensiveQuestions[currentStep].category}</p>
        </div>

        <div className="min-h-[300px] flex flex-col justify-center">
          <h3 className="text-2xl font-semibold text-foreground mb-6">
            {comprehensiveQuestions[currentStep].question}
          </h3>
          
          <div className="grid gap-3">
            {comprehensiveQuestions[currentStep].options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(option)}
                disabled={isSubmitting}
                className={`glass-card p-4 text-left transition-all duration-300 hover:bg-primary/10 hover:scale-105 disabled:opacity-50 ${
                  answers[currentStep] === option ? "bg-primary/20 ring-2 ring-primary" : ""
                }`}
              >
                <span className="text-foreground">{option}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0 || isSubmitting}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {isLastQuestion && isAnswered ? (
            <Button 
              onClick={handleComplete} 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-primary to-accent"
            >
              Complete Assessment
              <Check className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentStep(Math.min(comprehensiveQuestions.length - 1, currentStep + 1))}
              disabled={!isAnswered || isSubmitting}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};