"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Grid,
  List,
  Sun,
  Cloud,
  CloudRain,
  Utensils,
  Camera,
  Mountain,
  Music,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format, addDays, startOfWeek, eachDayOfInterval } from "date-fns";

const trips = [
  { id: "1", name: "Tokyo & Kyoto Adventure", color: "bg-primary" },
  { id: "2", name: "Paris Weekend Getaway", color: "bg-amber-500" },
];

const activities = [
  {
    id: "1",
    date: addDays(new Date(), 35),
    tripId: "1",
    time: "09:00",
    name: "Senso-ji Temple",
    location: "Tokyo",
    duration: 120,
    type: "culture",
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400",
  },
  {
    id: "2",
    date: addDays(new Date(), 35),
    tripId: "1",
    time: "12:00",
    name: "Ramen Lunch",
    location: "Tokyo",
    duration: 60,
    type: "food",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
  },
  {
    id: "3",
    date: addDays(new Date(), 35),
    tripId: "1",
    time: "14:00",
    name: "Shibuya Crossing",
    location: "Tokyo",
    duration: 180,
    type: "shopping",
    image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400",
  },
  {
    id: "4",
    date: addDays(new Date(), 36),
    tripId: "1",
    time: "08:00",
    name: "Tsukiji Market",
    location: "Tokyo",
    duration: 120,
    type: "food",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400",
  },
  {
    id: "5",
    date: addDays(new Date(), 36),
    tripId: "1",
    time: "11:00",
    name: "teamLab Borderless",
    location: "Tokyo",
    duration: 180,
    type: "culture",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=400",
  },
  {
    id: "6",
    date: addDays(new Date(), 60),
    tripId: "2",
    time: "10:00",
    name: "Eiffel Tower",
    location: "Paris",
    duration: 150,
    type: "culture",
    image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400",
  },
];

const typeIcons: Record<string, typeof Camera> = {
  culture: Camera,
  food: Utensils,
  shopping: ShoppingBag,
  adventure: Mountain,
  nightlife: Music,
  relaxation: Heart,
};

const typeColors: Record<string, string> = {
  culture: "bg-blue-500/10 text-blue-500",
  food: "bg-orange-500/10 text-orange-500",
  shopping: "bg-pink-500/10 text-pink-500",
  adventure: "bg-green-500/10 text-green-500",
  nightlife: "bg-purple-500/10 text-purple-500",
  relaxation: "bg-teal-500/10 text-teal-500",
};

function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const weekStart = startOfWeek(currentDate);
  const days = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6),
  });

  const getActivitiesForDay = (date: Date) => {
    return activities.filter(
      (a) => format(a.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(addDays(currentDate, -7))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {format(weekStart, "MMMM d")} - {format(addDays(weekStart, 6), "d, yyyy")}
          </h2>
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(addDays(currentDate, 7))}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
          Today
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-4">
        {/* Day Headers */}
        {days.map((day) => (
          <div key={day.toISOString()} className="text-center">
            <p className="text-xs text-muted-foreground uppercase">
              {format(day, "EEE")}
            </p>
            <p className={cn(
              "text-lg font-semibold mt-1 w-10 h-10 rounded-full flex items-center justify-center mx-auto",
              format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") && "bg-primary text-primary-foreground"
            )}>
              {format(day, "d")}
            </p>
          </div>
        ))}

        {/* Activity Slots */}
        {days.map((day) => {
          const dayActivities = getActivitiesForDay(day);
          return (
            <div
              key={`activities-${day.toISOString()}`}
              className="min-h-[200px] rounded-xl border border-border p-2 space-y-2 bg-card/50"
            >
              {dayActivities.map((activity) => {
                const trip = trips.find((t) => t.id === activity.tripId);
                const Icon = typeIcons[activity.type] || Camera;
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "p-2 rounded-lg cursor-pointer hover:scale-105 transition-transform",
                      trip?.color.replace("bg-", "bg-") + "/10"
                    )}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <Icon className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                    <p className="text-xs font-medium line-clamp-2">{activity.name}</p>
                  </motion.div>
                );
              })}
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {trips.map((trip) => (
          <div key={trip.id} className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full", trip.color)} />
            <span className="text-sm text-muted-foreground">{trip.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineView() {
  const groupedActivities = activities.reduce(
    (acc, activity) => {
      const dateKey = format(activity.date, "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(activity);
      return acc;
    },
    {} as Record<string, typeof activities>
  );

  return (
    <div className="space-y-8">
      {Object.entries(groupedActivities).map(([date, dayActivities]) => (
        <motion.div
          key={date}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Date Header */}
          <div className="sticky top-20 z-10 bg-background/80 backdrop-blur-lg py-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {format(new Date(date), "d")}
              </div>
              <div>
                <h3 className="font-semibold">{format(new Date(date), "EEEE")}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(date), "MMMM d, yyyy")}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                <Sun className="w-4 h-4 text-amber-500" />
                24°C
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative pl-8 border-l-2 border-border ml-6 space-y-4">
            {dayActivities.map((activity, index) => {
              const trip = trips.find((t) => t.id === activity.tripId);
              const Icon = typeIcons[activity.type] || Camera;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  {/* Timeline Dot */}
                  <div className={cn(
                    "absolute -left-[25px] w-4 h-4 rounded-full border-4 border-background",
                    trip?.color || "bg-primary"
                  )} />

                  {/* Activity Card */}
                  <Card className="hover:border-primary/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
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
                              <h4 className="font-semibold">{activity.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <Clock className="w-4 h-4" />
                                {activity.time} • {activity.duration} min
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                {activity.location}
                              </div>
                            </div>
                            <Badge className={cn("shrink-0", typeColors[activity.type])}>
                              <Icon className="w-3 h-3 mr-1" />
                              {activity.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function ItineraryPage() {
  const [view, setView] = useState<"calendar" | "timeline">("timeline");

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Itinerary</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all your planned activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-lg">
            <Button
              variant={view === "timeline" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("timeline")}
            >
              <List className="w-4 h-4 mr-2" />
              Timeline
            </Button>
            <Button
              variant={view === "calendar" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("calendar")}
            >
              <Grid className="w-4 h-4 mr-2" />
              Calendar
            </Button>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Activity
          </Button>
        </div>
      </div>

      {/* Trip Filter */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
          All Trips
        </Badge>
        {trips.map((trip) => (
          <Badge
            key={trip.id}
            variant="outline"
            className="cursor-pointer hover:bg-secondary/50"
          >
            <div className={cn("w-2 h-2 rounded-full mr-2", trip.color)} />
            {trip.name}
          </Badge>
        ))}
      </div>

      {/* Content */}
      {view === "calendar" ? <CalendarView /> : <TimelineView />}
    </div>
  );
}
