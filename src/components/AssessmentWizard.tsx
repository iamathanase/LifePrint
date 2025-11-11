import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

const questions = [
  {
    question: "How do you prefer to spend your free time?",
    options: ["Reading or learning", "Socializing with friends", "Physical activities", "Creative pursuits"]
  },
  {
    question: "When making decisions, you rely more on:",
    options: ["Logic and analysis", "Intuition and feelings", "Past experiences", "Others' advice"]
  },
  {
    question: "What motivates you most?",
    options: ["Achievement and success", "Helping others", "Personal growth", "Stability and security"]
  },
  {
    question: "In social situations, you are typically:",
    options: ["The life of the party", "A good listener", "Thoughtful observer", "Selective engager"]
  },
  {
    question: "Your ideal work environment is:",
    options: ["Structured and organized", "Flexible and creative", "Collaborative and social", "Independent and quiet"]
  }
];

export const AssessmentWizard = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentStep]: answer });
    
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    }
  };

  const handleComplete = () => {
    toast.success("Assessment complete! Your PersonaPrint is being generated...");
    setTimeout(onComplete, 1500);
  };

  const progress = ((currentStep + 1) / questions.length) * 100;
  const isLastQuestion = currentStep === questions.length - 1;
  const isAnswered = answers[currentStep] !== undefined;

  return (
    <Card className="glass-card p-8 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentStep + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="min-h-[300px] flex flex-col justify-center">
          <h3 className="text-2xl font-semibold text-foreground mb-6">
            {questions[currentStep].question}
          </h3>
          
          <div className="grid gap-3">
            {questions[currentStep].options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(option)}
                className={`glass-card p-4 text-left transition-all duration-300 hover:bg-primary/10 hover:scale-105 ${
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
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {isLastQuestion && isAnswered ? (
            <Button onClick={handleComplete} className="bg-gradient-to-r from-primary to-accent">
              Complete Assessment
              <Check className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentStep(Math.min(questions.length - 1, currentStep + 1))}
              disabled={!isAnswered}
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
