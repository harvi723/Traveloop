"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Calendar,
  Users,
  Sparkles,
  Plus,
  X,
  Search,
  Loader2,
  DollarSign,
  Check,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { DateRange } from "react-day-picker";

import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

const suggestedDestinations = [
  { id: "tokyo", name: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400" },
  { id: "paris", name: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400" },
  { id: "bali", name: "Bali", country: "Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400" },
  { id: "nyc", name: "New York", country: "USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400" },
  { id: "santorini", name: "Santorini", country: "Greece", image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400" },
  { id: "london", name: "London", country: "UK", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400" },
  { id: "dubai", name: "Dubai", country: "UAE", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400" },
  { id: "rome", name: "Rome", country: "Italy", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400" },
];

interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
}

export default function NewTripPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tripName, setTripName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDestinations, setSelectedDestinations] = useState<Destination[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), 30),
    to: addDays(new Date(), 37),
  });
  const [budget, setBudget] = useState("3000");
  const [currency, setCurrency] = useState("USD");
  const [isPublic, setIsPublic] = useState(false);
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDestinations = suggestedDestinations.filter(
    (d) =>
      (d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.country.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !selectedDestinations.find((s) => s.id === d.id)
  );

  const addDestination = (dest: Destination) => {
    setSelectedDestinations([...selectedDestinations, dest]);
  };

  const removeDestination = (id: string) => {
    setSelectedDestinations(selectedDestinations.filter((d) => d.id !== id));
  };

  const addCollaborator = () => {
    if (collaboratorEmail && !collaborators.includes(collaboratorEmail)) {
      setCollaborators([...collaborators, collaboratorEmail]);
      setCollaboratorEmail("");
    }
  };

  const removeCollaborator = (email: string) => {
    setCollaborators(collaborators.filter((c) => c !== email));
  };

  const handleGenerateItinerary = async () => {
    setIsGenerating(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to create a trip.",
          variant: "destructive",
        });
        return;
      }

      // 1. Create Trip
      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .insert({
          user_id: user.id,
          name: tripName || "Untitled Trip",
          description: description || null,
          cover_image: selectedDestinations[0]?.image || null,
          start_date: dateRange?.from ? dateRange.from.toISOString() : null,
          end_date: dateRange?.to ? dateRange.to.toISOString() : null,
          budget_total: Number(budget) || 0,
          budget_currency: currency,
          is_public: isPublic,
          status: 'planning'
        })
        .select()
        .single();

      if (tripError) throw tripError;

      // 2. Create Destinations
      if (selectedDestinations.length > 0) {
        const destInserts = selectedDestinations.map((dest, index) => ({
          trip_id: trip.id,
          name: dest.name,
          country: dest.country,
          image: dest.image,
          order_index: index,
        }));
        
        const { error: destError } = await supabase
          .from('destinations')
          .insert(destInserts);
          
        if (destError) throw destError;
      }

      toast({
        title: "Success!",
        description: "Your trip has been created successfully.",
      });
      
      router.push(`/dashboard/trips/${trip.id}`);
    } catch (error: any) {
      console.error('Error creating trip:', error);
      toast({
        title: "Something went wrong",
        description: error.message || "Failed to create your trip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedDestinations.length > 0;
      case 2:
        return tripName.trim() && dateRange?.from && dateRange?.to;
      case 3:
        return true;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard/trips">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold">Create New Trip</h1>
                <p className="text-sm text-muted-foreground">Step {step} of 3</p>
              </div>
            </div>

            {/* Progress */}
            <div className="hidden md:flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    s === step
                      ? "bg-primary text-primary-foreground"
                      : s < step
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {s < step ? <Check className="w-4 h-4" /> : s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <AnimatePresence mode="wait">
          {/* Step 1: Destinations */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Where do you want to go?
                </h2>
                <p className="text-muted-foreground">
                  Select one or more destinations for your trip
                </p>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>

              {/* Selected Destinations */}
              {selectedDestinations.length > 0 && (
                <div className="space-y-3">
                  <Label>Selected Destinations</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedDestinations.map((dest) => (
                      <Badge
                        key={dest.id}
                        variant="secondary"
                        className="pl-1 pr-2 py-1 gap-2"
                      >
                        <Image
                          src={dest.image}
                          alt={dest.name}
                          width={24}
                          height={24}
                          className="rounded-sm object-cover"
                        />
                        {dest.name}
                        <button
                          onClick={() => removeDestination(dest.id)}
                          className="ml-1 hover:text-destructive transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Destination Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredDestinations.map((dest, i) => (
                  <motion.button
                    key={dest.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => addDestination(dest)}
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden"
                  >
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2 text-left">
                      <p className="font-semibold text-white text-sm">{dest.name}</p>
                      <p className="text-white/70 text-xs">{dest.country}</p>
                    </div>
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                        <Plus className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Trip Details
                </h2>
                <p className="text-muted-foreground">
                  Give your trip a name and set your dates
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="tripName">Trip Name</Label>
                    <Input
                      id="tripName"
                      placeholder="e.g., Summer Japan Adventure"
                      value={tripName}
                      onChange={(e) => setTripName(e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="What's this trip about?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Travel Dates</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start h-12 text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {dateRange?.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span className="text-muted-foreground">Pick your dates</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange?.from}
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Budget</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="3000"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="h-12 flex-1"
                      />
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="h-12 px-3 rounded-lg border border-input bg-background"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Collaborators (optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="friend@email.com"
                        value={collaboratorEmail}
                        onChange={(e) => setCollaboratorEmail(e.target.value)}
                        className="h-12"
                        onKeyDown={(e) => e.key === "Enter" && addCollaborator()}
                      />
                      <Button onClick={addCollaborator} variant="secondary">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {collaborators.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {collaborators.map((email) => (
                          <Badge key={email} variant="secondary">
                            {email}
                            <button
                              onClick={() => removeCollaborator(email)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">Public Trip</p>
                        <p className="text-xs text-muted-foreground">
                          Others can view and clone this trip
                        </p>
                      </div>
                    </div>
                    <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: AI Generate */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Ready to create your trip!
                </h2>
                <p className="text-muted-foreground">
                  Review your trip and let AI generate the perfect itinerary
                </p>
              </div>

              {/* Trip Summary */}
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={selectedDestinations[0]?.image || ""}
                        alt={tripName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{tripName || "Untitled Trip"}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {selectedDestinations.map((dest) => (
                          <Badge key={dest.id} variant="outline">
                            <MapPin className="w-3 h-3 mr-1" />
                            {dest.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Dates</p>
                        <p className="font-medium text-sm">
                          {dateRange?.from && dateRange?.to
                            ? `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d")}`
                            : "Not set"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="font-medium text-sm">
                          {currency} {Number(budget).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Travelers</p>
                        <p className="font-medium text-sm">
                          {collaborators.length + 1} {collaborators.length === 0 ? "person" : "people"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Generate Button */}
              <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                      <Sparkles className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-semibold text-lg mb-1">AI Itinerary Generator</h3>
                      <p className="text-sm text-muted-foreground">
                        Our AI will create a personalized day-by-day itinerary based on your
                        destinations, dates, budget, and travel style preferences.
                      </p>
                    </div>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-primary to-accent hover:opacity-90 w-full md:w-auto"
                      onClick={handleGenerateItinerary}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Itinerary
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Or create manually */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  or{" "}
                  <button
                    onClick={() => router.push("/dashboard/trips/1")}
                    className="text-primary hover:underline"
                  >
                    create manually without AI
                  </button>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          {step < 3 && (
            <Button
              onClick={() => setStep(Math.min(3, step + 1))}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
