"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plane,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Mountain,
  Utensils,
  Camera,
  Music,
  Compass,
  Heart,
  Zap,
  Clock,
  DollarSign,
  Users,
  MapPin,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useTravelStore } from "@/lib/store";

const travelStyles = [
  { id: "adventurer", icon: Mountain, label: "Adventurer", description: "Hiking, extreme sports, off-the-beaten-path" },
  { id: "foodie", icon: Utensils, label: "Foodie", description: "Local cuisine, food tours, cooking classes" },
  { id: "culture", icon: Camera, label: "Culture Seeker", description: "Museums, history, architecture, art" },
  { id: "nightlife", icon: Music, label: "Night Owl", description: "Clubs, bars, live music, late nights" },
  { id: "explorer", icon: Compass, label: "Explorer", description: "Hidden gems, local secrets, authentic" },
  { id: "relaxer", icon: Heart, label: "Relaxer", description: "Beaches, spas, slow travel, wellness" },
];

const paceOptions = [
  { id: "relaxed", icon: Heart, label: "Relaxed", description: "2-3 activities per day, plenty of rest" },
  { id: "moderate", icon: Clock, label: "Balanced", description: "4-5 activities, good mix of busy and chill" },
  { id: "adventurous", icon: Zap, label: "Action-Packed", description: "Maximize every moment, see it all!" },
];

const budgetOptions = [
  { id: "budget", icon: DollarSign, label: "Budget", description: "Hostels, street food, public transport" },
  { id: "mid-range", icon: DollarSign, label: "Mid-Range", description: "Nice hotels, good restaurants, some splurges" },
  { id: "luxury", icon: DollarSign, label: "Luxury", description: "5-star everything, premium experiences" },
];

const interests = [
  "Beaches", "Mountains", "Cities", "Countryside", "History", "Art",
  "Food & Wine", "Adventure Sports", "Photography", "Shopping",
  "Nightlife", "Nature", "Architecture", "Local Culture", "Wellness"
];

interface StepProps {
  onNext: () => void;
  onBack?: () => void;
}

function WelcomeStep({ onNext }: StepProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-md mx-auto text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-8"
      >
        <Plane className="w-10 h-10 text-primary-foreground" />
      </motion.div>

      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
        Welcome to <span className="gradient-text">Traveloop</span>
      </h1>
      <p className="text-muted-foreground mb-8 text-pretty">
        Let&apos;s personalize your travel experience. This will only take a minute!
      </p>

      <div className="space-y-4 text-left">
        <div className="space-y-2">
          <Label htmlFor="name">Your name</Label>
          <Input
            id="name"
            placeholder="What should we call you?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12"
          />
        </div>
      </div>

      <Button
        size="lg"
        className="w-full mt-8 bg-gradient-to-r from-primary to-accent hover:opacity-90"
        onClick={onNext}
        disabled={!name || !email}
      >
        Continue
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      <p className="text-xs text-muted-foreground mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}

function TravelStyleStep({ onNext, onBack }: StepProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-balance">
          What&apos;s your travel style?
        </h2>
        <p className="text-muted-foreground">Select all that apply to you</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {travelStyles.map((style, i) => (
          <motion.button
            key={style.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => toggle(style.id)}
            className={cn(
              "relative p-4 rounded-xl border-2 text-left transition-all duration-200",
              selected.includes(style.id)
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
          >
            {selected.includes(style.id) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-primary-foreground" />
              </motion.div>
            )}
            <style.icon className={cn(
              "w-8 h-8 mb-3 transition-colors",
              selected.includes(style.id) ? "text-primary" : "text-muted-foreground"
            )} />
            <h3 className="font-semibold mb-1">{style.label}</h3>
            <p className="text-xs text-muted-foreground">{style.description}</p>
          </motion.button>
        ))}
      </div>

      <div className="flex gap-4">
        <Button variant="outline" size="lg" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          size="lg"
          className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
          onClick={onNext}
          disabled={selected.length === 0}
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}

function PaceStep({ onNext, onBack }: StepProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-balance">
          How do you like to travel?
        </h2>
        <p className="text-muted-foreground">Choose your ideal travel pace</p>
      </div>

      <div className="space-y-4 mb-8">
        {paceOptions.map((option, i) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelected(option.id)}
            className={cn(
              "w-full p-5 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-4",
              selected === option.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
              selected === option.id ? "bg-primary text-primary-foreground" : "bg-muted"
            )}>
              <option.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{option.label}</h3>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
            {selected === option.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-primary-foreground" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      <div className="flex gap-4">
        <Button variant="outline" size="lg" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          size="lg"
          className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
          onClick={onNext}
          disabled={!selected}
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}

function BudgetStep({ onNext, onBack }: StepProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-balance">
          What&apos;s your budget style?
        </h2>
        <p className="text-muted-foreground">This helps us recommend the perfect options</p>
      </div>

      <div className="space-y-4 mb-8">
        {budgetOptions.map((option, i) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelected(option.id)}
            className={cn(
              "w-full p-5 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-4",
              selected === option.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
              selected === option.id ? "bg-primary text-primary-foreground" : "bg-muted"
            )}>
              {option.id === "budget" && <DollarSign className="w-6 h-6" />}
              {option.id === "mid-range" && (
                <div className="flex">
                  <DollarSign className="w-4 h-4" />
                  <DollarSign className="w-4 h-4 -ml-1" />
                </div>
              )}
              {option.id === "luxury" && (
                <div className="flex">
                  <DollarSign className="w-3 h-3" />
                  <DollarSign className="w-3 h-3 -ml-0.5" />
                  <DollarSign className="w-3 h-3 -ml-0.5" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{option.label}</h3>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
            {selected === option.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-primary-foreground" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      <div className="flex gap-4">
        <Button variant="outline" size="lg" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          size="lg"
          className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
          onClick={onNext}
          disabled={!selected}
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}

function InterestsStep({ onNext, onBack }: StepProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (interest: string) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-balance">
          What interests you most?
        </h2>
        <p className="text-muted-foreground">Select your top travel interests</p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {interests.map((interest, i) => (
          <motion.button
            key={interest}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
            onClick={() => toggle(interest)}
            className={cn(
              "px-4 py-2 rounded-full border-2 text-sm font-medium transition-all duration-200",
              selected.includes(interest)
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:border-primary/50"
            )}
          >
            {interest}
          </motion.button>
        ))}
      </div>

      <div className="flex gap-4">
        <Button variant="outline" size="lg" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          size="lg"
          className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
          onClick={onNext}
          disabled={selected.length < 3}
        >
          {selected.length < 3 ? `Select ${3 - selected.length} more` : "Complete Setup"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}

function CompleteStep() {
  const router = useRouter();
  const { setOnboardingComplete } = useTravelStore();

  const handleComplete = () => {
    setOnboardingComplete(true);
    router.push("/dashboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-8"
      >
        <Sparkles className="w-12 h-12 text-primary-foreground" />
      </motion.div>

      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
        You&apos;re all set!
      </h2>
      <p className="text-lg text-muted-foreground mb-8 text-pretty">
        Your personalized travel profile is ready. Let&apos;s start planning your first adventure!
      </p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-2xl p-6 mb-8 text-left"
      >
        <h3 className="font-semibold mb-4">Your Travel Personality</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Compass className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm">Explorer & Culture Seeker</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm">Balanced travel pace</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm">Mid-range budget preference</span>
          </div>
        </div>
      </motion.div>

      <Button
        size="lg"
        className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
        onClick={handleComplete}
      >
        Go to Dashboard
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </motion.div>
  );
}

export default function OnboardingPage() {
  const [step, setStep] = useState(0);

  const steps = [
    { component: WelcomeStep, label: "Welcome" },
    { component: TravelStyleStep, label: "Style" },
    { component: PaceStep, label: "Pace" },
    { component: BudgetStep, label: "Budget" },
    { component: InterestsStep, label: "Interests" },
    { component: CompleteStep, label: "Complete" },
  ];

  const CurrentStep = steps[step].component;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Plane className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold">Traveloop</span>
            </Link>
            <span className="text-sm text-muted-foreground">
              Step {step + 1} of {steps.length}
            </span>
          </div>
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  i <= step ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 pt-32 pb-16">
        <AnimatePresence mode="wait">
          <CurrentStep
            key={step}
            onNext={() => setStep((s) => Math.min(s + 1, steps.length - 1))}
            onBack={() => setStep((s) => Math.max(s - 1, 0))}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}
