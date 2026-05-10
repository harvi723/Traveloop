"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Trip, Destination } from "@/lib/types";
import {
  Plus,
  Search,
  Filter,
  Grid,
  List,
  MapPin,
  Calendar,
  Users,
  MoreVertical,
  Clock,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Share2,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface UITrip {
  id: string;
  name: string;
  description: string;
  dates: string;
  daysUntil: number;
  coverImage: string;
  destinations: string[];
  progress: number;
  collaborators: { name: string; avatar: string }[];
  budget: { spent: number; total: number; currency: string };
  status: string;
  isPublic: boolean;
  activities: number;
}

function TripCard({ trip, view }: { trip: UITrip; view: "grid" | "list" }) {
  const statusColors = {
    upcoming: "bg-primary text-primary-foreground",
    planning: "bg-amber-500/10 text-amber-500",
    completed: "bg-emerald-500/10 text-emerald-500",
  };

  if (view === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className="group hover:border-primary/50 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <Link href={`/dashboard/trips/${trip.id}`} className="shrink-0">
                <div className="relative w-32 h-24 rounded-lg overflow-hidden">
                  <Image
                    src={trip.coverImage}
                    alt={trip.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/dashboard/trips/${trip.id}`}>
                      <h3 className="font-semibold hover:text-primary transition-colors line-clamp-1">
                        {trip.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                      {trip.description}
                    </p>
                  </div>
                  <Badge className={cn("shrink-0", statusColors[trip.status as keyof typeof statusColors])}>
                    {trip.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {trip.dates}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {trip.destinations.join(", ")}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    ${trip.budget.spent.toLocaleString()} / ${trip.budget.total.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <Progress value={trip.progress} className="w-24 h-2" />
                    <span className="text-xs text-muted-foreground">{trip.progress}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {trip.collaborators.slice(0, 3).map((c, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background flex items-center justify-center text-[10px] font-medium text-primary-foreground"
                        >
                          {c.avatar}
                        </div>
                      ))}
                      {trip.collaborators.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-medium">
                          +{trip.collaborators.length - 3}
                        </div>
                      )}
                    </div>
                    <TripActions trip={trip} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className="overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
        <Link href={`/dashboard/trips/${trip.id}`}>
          <div className="relative h-48 overflow-hidden">
            <Image
              src={trip.coverImage}
              alt={trip.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <Badge className={cn(statusColors[trip.status as keyof typeof statusColors])}>
                {trip.status}
              </Badge>
              {trip.daysUntil > 0 && (
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                  <Clock className="w-3 h-3 mr-1" />
                  {trip.daysUntil} days
                </Badge>
              )}
            </div>

            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="font-semibold text-white text-lg mb-1 line-clamp-1">{trip.name}</h3>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Calendar className="w-4 h-4" />
                {trip.dates}
              </div>
            </div>
          </div>
        </Link>

        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap gap-1">
            {trip.destinations.map((dest) => (
              <Badge key={dest} variant="outline" className="text-xs">
                <MapPin className="w-3 h-3 mr-1" />
                {dest}
              </Badge>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Planning Progress</span>
              <span className="font-medium">{trip.progress}%</span>
            </div>
            <Progress value={trip.progress} className="h-2" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span>
                ${trip.budget.spent.toLocaleString()} / ${trip.budget.total.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {trip.collaborators.slice(0, 3).map((c, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background flex items-center justify-center text-[10px] font-medium text-primary-foreground"
                  >
                    {c.avatar}
                  </div>
                ))}
              </div>
              <TripActions trip={trip} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TripActions({ trip }: { trip: (typeof trips)[0] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/trips/${trip.id}`}>
            <Eye className="w-4 h-4 mr-2" />
            View
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy className="w-4 h-4 mr-2" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { format, differenceInDays } from "date-fns";

export default function TripsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [trips, setTrips] = useState<UITrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    async function fetchTrips() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('trips')
          .select(`
            *,
            destinations ( name )
          `)
          .eq('user_id', user.id)
          .order('start_date', { ascending: true });

        if (error) throw error;

        const formattedTrips: UITrip[] = (data || []).map((t: any) => {
          const startDate = t.start_date ? new Date(t.start_date) : null;
          const endDate = t.end_date ? new Date(t.end_date) : null;

          let datesStr = "Dates not set";
          if (startDate && endDate) {
            datesStr = `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
          } else if (startDate) {
            datesStr = format(startDate, "MMM d, yyyy");
          }

          let daysUntil = 0;
          if (startDate) {
            daysUntil = differenceInDays(startDate, new Date());
          }

          let status = t.status || 'planning';
          if (status === 'planning' && daysUntil <= 30 && daysUntil > 0 && t.destinations?.length > 0) {
              status = 'upcoming'; // auto upgrade status for UI based on proximity
          }

          return {
            id: t.id,
            name: t.name,
            description: t.description || "No description",
            dates: datesStr,
            daysUntil,
            coverImage: t.cover_image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
            destinations: t.destinations?.map((d: any) => d.name) || [],
            progress: status === "completed" ? 100 : status === "upcoming" ? 75 : 25,
            collaborators: [{ name: "You", avatar: "Y" }], // fetch from DB if needed
            budget: { spent: 0, total: t.budget_total || 0, currency: t.budget_currency || "USD" },
            status: status,
            isPublic: t.is_public,
            activities: 0
          };
        });

        setTrips(formattedTrips);
      } catch (error: any) {
        console.error("Error fetching trips:", error);
        toast({
          title: "Error fetching trips",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrips();
  }, [supabase, toast]);

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.name.toLowerCase().includes(search.toLowerCase()) ||
      trip.destinations.some((d) => d.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "all" || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Trips</h1>
          <p className="text-muted-foreground mt-1">
            {trips.length} trips • {trips.filter((t) => t.status === "upcoming").length} upcoming
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          asChild
        >
          <Link href="/dashboard/trips/new">
            <Plus className="w-4 h-4 mr-2" />
            Create New Trip
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search trips..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border rounded-lg">
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setView("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setView("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Trips Grid/List */}
      <AnimatePresence mode="popLayout">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            Loading your trips...
          </div>
        ) : filteredTrips.length > 0 ? (
          <motion.div
            layout
            className={cn(
              view === "grid"
                ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            )}
          >
            {filteredTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} view={view} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No trips found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
