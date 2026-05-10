"use client";

import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Plus,
  MoreVertical,
  Clock,
  Edit,
  Trash2,
  GripVertical,
  Sun,
  Cloud,
  Utensils,
  Camera,
  Mountain,
  Music,
  Sparkles,
  Share2,
  Download,
  Copy,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, addDays } from "date-fns";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import type { Trip, ItineraryDay, Activity, Destination } from "@/lib/types";

// --- Mock Data Fallbacks (if no real data yet) ---
  id: "1",
  name: "Tokyo & Kyoto Adventure",
  description: "Exploring the perfect blend of tradition and modernity in Japan",
  startDate: addDays(new Date(), 35),
  endDate: addDays(new Date(), 48),
  coverImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600",
  destinations: [
    { name: "Tokyo", country: "Japan", days: 7, image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400" },
    { name: "Kyoto", country: "Japan", days: 4, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400" },
    { name: "Osaka", country: "Japan", days: 2, image: "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400" },
  ],
  budget: { total: 4500, spent: 1200, currency: "USD" },
  collaborators: [
    { name: "John Doe", email: "john@example.com", avatar: "J", role: "Owner", online: true },
    { name: "Sarah Chen", email: "sarah@example.com", avatar: "S", role: "Editor", online: true },
    { name: "Mike Wilson", email: "mike@example.com", avatar: "M", role: "Viewer", online: false },
  ],
  progress: 75,
  isPublic: true,
};

const itinerary = [
  {
    id: "day1",
    date: addDays(new Date(), 35),
    location: "Tokyo",
    weather: { temp: "24°C", condition: "Sunny", icon: Sun },
    activities: [
      {
        id: "a1",
        time: "09:00",
        name: "Senso-ji Temple Visit",
        duration: 120,
        type: "culture",
        description: "Explore Tokyo&apos;s oldest Buddhist temple",
        cost: 0,
        image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400",
      },
      {
        id: "a2",
        time: "12:00",
        name: "Ramen Lunch at Ichiran",
        duration: 60,
        type: "food",
        description: "Famous tonkotsu ramen experience",
        cost: 15,
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
      },
      {
        id: "a3",
        time: "14:00",
        name: "Shibuya Crossing & Shopping",
        duration: 180,
        type: "shopping",
        description: "World&apos;s busiest pedestrian crossing",
        cost: 100,
        image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400",
      },
      {
        id: "a4",
        time: "19:00",
        name: "Golden Gai Nightlife",
        duration: 180,
        type: "nightlife",
        description: "Explore tiny bars in Shinjuku",
        cost: 50,
        image: "https://images.unsplash.com/photo-1554797589-7241bb691973?w=400",
      },
    ],
  },
  {
    id: "day2",
    date: addDays(new Date(), 36),
    location: "Tokyo",
    weather: { temp: "22°C", condition: "Cloudy", icon: Cloud },
    activities: [
      {
        id: "a5",
        time: "08:00",
        name: "Tsukiji Outer Market",
        duration: 120,
        type: "food",
        description: "Fresh sushi breakfast",
        cost: 30,
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400",
      },
      {
        id: "a6",
        time: "11:00",
        name: "teamLab Borderless",
        duration: 180,
        type: "culture",
        description: "Immersive digital art museum",
        cost: 35,
        image: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=400",
      },
      {
        id: "a7",
        time: "15:00",
        name: "Harajuku & Takeshita Street",
        duration: 150,
        type: "shopping",
        description: "Youth culture and fashion",
        cost: 50,
        image: "https://images.unsplash.com/photo-1532236204992-f5e85c024202?w=400",
      },
    ],
  },
  {
    id: "day3",
    date: addDays(new Date(), 37),
    location: "Tokyo",
    weather: { temp: "25°C", condition: "Sunny", icon: Sun },
    activities: [
      {
        id: "a8",
        time: "10:00",
        name: "Meiji Shrine",
        duration: 90,
        type: "culture",
        description: "Peaceful Shinto shrine in forest",
        cost: 0,
        image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400",
      },
      {
        id: "a9",
        time: "13:00",
        name: "Yoyogi Park Picnic",
        duration: 120,
        type: "relaxation",
        description: "Relax in Tokyo&apos;s green oasis",
        cost: 20,
        image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400",
      },
    ],
  },
];

const activityIcons: Record<string, typeof Camera> = {
  culture: Camera,
  food: Utensils,
  shopping: Camera,
  nightlife: Music,
  adventure: Mountain,
  relaxation: Sun,
};

function ActivityCard({ activity }: { activity: (typeof itinerary)[0]["activities"][0] }) {
  const Icon = activityIcons[activity.type] || Camera;

  return (
    <Reorder.Item
      value={activity}
      id={activity.id}
      className="group"
    >
      <motion.div
        layout
        className="flex gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all cursor-grab active:cursor-grabbing"
      >
        <div className="flex flex-col items-center gap-2 shrink-0">
          <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-sm font-medium text-primary">{activity.time}</span>
          <span className="text-xs text-muted-foreground">{activity.duration}min</span>
        </div>

        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
          <Image
            src={activity.image}
            alt={activity.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold line-clamp-1">{activity.name}</h4>
              <p className="text-sm text-muted-foreground line-clamp-1">{activity.description}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8 shrink-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant="outline" className="text-xs">
              <Icon className="w-3 h-3 mr-1" />
              {activity.type}
            </Badge>
            {activity.cost > 0 && (
              <span className="text-xs text-muted-foreground flex items-center">
                <DollarSign className="w-3 h-3" />
                {activity.cost}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Reorder.Item>
  );
}

function DayCard({ day, index }: { day: (typeof itinerary)[0]; index: number }) {
  const [activities, setActivities] = useState(day.activities);
  const WeatherIcon = day.weather.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {index + 1}
              </div>
              <div>
                <CardTitle className="text-lg">Day {index + 1}</CardTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {format(day.date, "EEEE, MMMM d")}
                  <span className="text-muted-foreground/50">•</span>
                  <MapPin className="w-4 h-4" />
                  {day.location}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <WeatherIcon className="w-5 h-5 text-amber-500" />
                <span>{day.weather.temp}</span>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Reorder.Group
            axis="y"
            values={activities}
            onReorder={setActivities}
            className="space-y-3"
          >
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </Reorder.Group>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TripHeader({ tripData }: { tripData: any }) {
  const [selectedDay, setSelectedDay] = useState(0);

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src={tripData.coverImage}
          alt={tripData.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        {/* Back button */}
        <div className="absolute top-4 left-4">
          <Button variant="secondary" size="sm" className="glass" asChild>
            <Link href="/dashboard/trips">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Trips
            </Link>
          </Button>
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="secondary" size="sm" className="glass">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="glass">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit Trip
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Trip
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Trip Info */}
      <div className="container mx-auto px-4 -mt-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Info */}
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl shrink-0">
                🇯🇵
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold">{tripData.name}</h1>
                  {tripData.isPublic && (
                    <Badge variant="secondary" className="text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      Public
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{tripData.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 mt-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm">
                  {format(tripData.startDate, "MMM d")} - {format(tripData.endDate, "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-sm">
                  {tripData.destinations.map((d) => d.name).join(" → ")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <span className="text-sm">
                  ${tripData.budget.spent.toLocaleString()} / ${tripData.budget.total.toLocaleString()} {tripData.budget.currency}
                </span>
              </div>
            </div>
          </div>

          {/* Collaborators */}
          <Card className="lg:w-72 shrink-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Collaborators
                </span>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  <Plus className="w-3 h-3 mr-1" />
                  Invite
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tripData.collaborators.map((collab) => (
                <div key={collab.email} className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-medium text-primary-foreground">
                      {collab.avatar}
                    </div>
                    {collab.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{collab.name}</p>
                    <p className="text-xs text-muted-foreground">{collab.role}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { PackingListTab } from "./packing-list-tab";

export default function TripDetailPage({ params }: { params: { id: string } }) {
  const [trip, setTrip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTrip() {
      try {
        const { data, error } = await supabase
          .from("trips")
          .select(`
            *,
            destinations (*),
            itinerary_days (
              *,
              activities (*)
            ),
            collaborators (*)
          `)
          .eq("id", params.id)
          .single();

        if (error) throw error;
        setTrip(data);
      } catch (error) {
        console.error("Error fetching trip:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTrip();
  }, [params.id, supabase]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  // Map real data to UI format or fallback to mock if incomplete
  const mappedTripData = trip ? {
    name: trip.name,
    description: trip.description || "No description provided.",
    startDate: trip.start_date ? new Date(trip.start_date) : addDays(new Date(), 35),
    endDate: trip.end_date ? new Date(trip.end_date) : addDays(new Date(), 48),
    coverImage: trip.cover_image || "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600",
    destinations: trip.destinations?.length > 0 ? trip.destinations : [{ name: "No destinations yet", country: "" }],
    budget: { total: trip.budget_total || 0, spent: 0, currency: trip.budget_currency || "USD" },
    collaborators: trip.collaborators?.length > 0 ? trip.collaborators : [{ name: "You", role: "Owner", avatar: "Y" }],
    progress: trip.status === "completed" ? 100 : 25,
    isPublic: trip.is_public
  } : tripData;

  const mappedItinerary = trip?.itinerary_days?.length > 0 
    ? trip.itinerary_days.sort((a:any,b:any) => a.order_index - b.order_index).map((day: any) => ({
      id: day.id,
      date: new Date(day.date),
      location: trip.destinations?.find((d:any) => d.id === day.destination_id)?.name || "Unknown",
      weather: { temp: "--", condition: "Unknown", icon: Sun },
      activities: (day.activities || []).sort((a:any, b:any) => a.order_index - b.order_index).map((act: any) => ({
        id: act.id,
        time: act.start_time?.substring(0, 5) || "--:--",
        name: act.name,
        duration: act.duration_minutes,
        type: act.category,
        description: act.description,
        cost: act.cost,
        image: act.image || "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400"
      }))
    }))
    : itinerary;

  return (
    <div className="min-h-screen pb-8">
      <TripHeader tripData={mappedTripData} />

      <div className="container mx-auto px-4 mt-8">
        <Tabs defaultValue="itinerary" className="space-y-6">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto">
            {["itinerary", "map", "budget", "packing", "journal"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent capitalize px-4 py-3"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="itinerary" className="space-y-6 mt-6">
            {/* Progress */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Planning Progress</span>
                  <span className="text-sm text-muted-foreground">{mappedTripData.progress}% complete</span>
                </div>
                <Progress value={mappedTripData.progress} className="h-2" />
              </CardContent>
            </Card>

            {/* AI Suggestion */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">AI Suggestion</h3>
                    <p className="text-sm text-muted-foreground">
                      Day 2 looks packed! Consider moving teamLab Borderless to Day 3 for a more relaxed experience.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Apply
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Day Navigation */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Itinerary</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground px-2">Day 1-3 of 13</span>
                <Button variant="outline" size="icon">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Days */}
            <div className="space-y-6">
              {mappedItinerary.map((day: any, index: number) => (
                <DayCard key={day.id} day={day} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map" className="mt-6">
            <Card className="h-[500px] flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Interactive Map View</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Visualize your entire journey with animated routes and activity markers.
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="mt-6">
            <Card className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Budget Tracker</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Track your expenses and stay within budget with AI optimization.
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="packing" className="mt-6">
            <PackingListTab tripId={params.id} />
          </TabsContent>

          <TabsContent value="journal" className="mt-6">
            <Card className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <Edit className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Travel Journal</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Capture memories, add photos, and create your travel story.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
