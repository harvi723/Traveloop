"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Plane,
  Clock,
  DollarSign,
  CheckCircle2,
  Circle,
  ChevronRight,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const upcomingTrips = [
  {
    id: "1",
    name: "Tokyo & Kyoto Adventure",
    dates: "June 15 - June 28, 2026",
    daysUntil: 35,
    coverImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
    destinations: ["Tokyo", "Kyoto"],
    progress: 75,
    collaborators: 2,
    budget: { spent: 1200, total: 4500 },
  },
  {
    id: "2",
    name: "Paris Weekend Getaway",
    dates: "July 10 - July 14, 2026",
    daysUntil: 60,
    coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    destinations: ["Paris"],
    progress: 45,
    collaborators: 1,
    budget: { spent: 500, total: 2000 },
  },
];

const recentActivity = [
  { type: "itinerary", action: "Added new activity", trip: "Tokyo Adventure", time: "2 hours ago" },
  { type: "budget", action: "Updated budget", trip: "Paris Getaway", time: "5 hours ago" },
  { type: "collaborator", action: "Sarah joined", trip: "Tokyo Adventure", time: "Yesterday" },
  { type: "packing", action: "Created packing list", trip: "Tokyo Adventure", time: "2 days ago" },
];

const quickActions = [
  { icon: Plane, label: "New Trip", href: "/dashboard/trips/new", color: "from-primary to-accent" },
  { icon: Sparkles, label: "AI Generate", href: "#", color: "from-amber-500 to-orange-500" },
  { icon: Users, label: "Invite", href: "#", color: "from-emerald-500 to-teal-500" },
  { icon: Globe, label: "Explore", href: "#", color: "from-pink-500 to-rose-500" },
];

const trendingDestinations = [
  { name: "Bali", country: "Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400" },
  { name: "Santorini", country: "Greece", image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400" },
  { name: "Maldives", country: "Maldives", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400" },
];

const stats = [
  { label: "Countries Visited", value: "12", icon: Globe, trend: "+2 this year" },
  { label: "Trips Planned", value: "8", icon: Plane, trend: "3 upcoming" },
  { label: "Miles Traveled", value: "48.2K", icon: TrendingUp, trend: "+15% vs last year" },
  { label: "Travel Days", value: "89", icon: Calendar, trend: "23 planned" },
];

function TripCard({ trip }: { trip: (typeof upcomingTrips)[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link href={`/dashboard/trips/${trip.id}`}>
        <Card className="overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
          <div className="relative h-40 overflow-hidden">
            <Image
              src={trip.coverImage}
              alt={trip.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                <Clock className="w-3 h-3 mr-1" />
                {trip.daysUntil} days
              </Badge>
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="font-semibold text-white text-lg mb-1">{trip.name}</h3>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Calendar className="w-4 h-4" />
                {trip.dates}
              </div>
            </div>
          </div>

          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {trip.destinations.map((dest) => (
                  <Badge key={dest} variant="outline" className="text-xs">
                    <MapPin className="w-3 h-3 mr-1" />
                    {dest}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <div className="flex -space-x-2">
                  {Array.from({ length: trip.collaborators }).map((_, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Planning Progress</span>
                <span className="font-medium">{trip.progress}%</span>
              </div>
              <Progress value={trip.progress} className="h-2" />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                Budget
              </div>
              <span className="font-medium">
                ${trip.budget.spent.toLocaleString()} / ${trip.budget.total.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function StatCard({
  stat,
  index,
}: {
  stat: (typeof stats)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              <p className="text-xs text-primary mt-1">{stat.trend}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, <span className="gradient-text">John</span> 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to plan your next adventure?
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-primary to-accent hover:opacity-90 w-full md:w-auto"
          asChild
        >
          <Link href="/dashboard/trips/new">
            <Plus className="w-4 h-4 mr-2" />
            Create New Trip
          </Link>
        </Button>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {quickActions.map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <Link href={action.href}>
              <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br text-white transition-transform group-hover:scale-110",
                      action.color
                    )}
                  >
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{action.label}</span>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Trips */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Upcoming Trips</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/trips">
                View all
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          {upcomingTrips.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {upcomingTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Plane className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No trips planned yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start planning your next adventure!
                </p>
                <Button asChild>
                  <Link href="/dashboard/trips/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Trip
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.trip} • {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Trending Destinations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Trending Now</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingDestinations.map((dest, i) => (
                <motion.div
                  key={dest.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{dest.name}</p>
                    <p className="text-xs text-muted-foreground">{dest.country}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* AI Suggestion Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">AI Suggestion</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Based on your travel style, you might love visiting Portugal in fall!
                    </p>
                    <Button size="sm" variant="secondary">
                      Explore Portugal
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
