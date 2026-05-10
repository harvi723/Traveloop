"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Filter,
  Plane,
  Home,
  Utensils,
  Camera,
  ShoppingBag,
  MoreVertical,
  Edit,
  Trash2,
  Sparkles,
  ArrowRight,
  PieChart,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const budgetCategories = [
  {
    id: "transport",
    name: "Transportation",
    icon: Plane,
    color: "bg-blue-500",
    budget: 1200,
    spent: 850,
  },
  {
    id: "accommodation",
    name: "Accommodation",
    icon: Home,
    color: "bg-emerald-500",
    budget: 1500,
    spent: 1200,
  },
  {
    id: "food",
    name: "Food & Dining",
    icon: Utensils,
    color: "bg-orange-500",
    budget: 800,
    spent: 420,
  },
  {
    id: "activities",
    name: "Activities",
    icon: Camera,
    color: "bg-purple-500",
    budget: 600,
    spent: 380,
  },
  {
    id: "shopping",
    name: "Shopping",
    icon: ShoppingBag,
    color: "bg-pink-500",
    budget: 400,
    spent: 150,
  },
];

const recentExpenses = [
  {
    id: "1",
    name: "Flight to Tokyo",
    category: "transport",
    amount: 850,
    date: "2026-06-15",
    trip: "Tokyo Adventure",
  },
  {
    id: "2",
    name: "Hotel Booking",
    category: "accommodation",
    amount: 1200,
    date: "2026-06-15",
    trip: "Tokyo Adventure",
  },
  {
    id: "3",
    name: "teamLab Tickets",
    category: "activities",
    amount: 70,
    date: "2026-06-16",
    trip: "Tokyo Adventure",
  },
  {
    id: "4",
    name: "Sushi Dinner",
    category: "food",
    amount: 120,
    date: "2026-06-17",
    trip: "Tokyo Adventure",
  },
  {
    id: "5",
    name: "JR Pass",
    category: "transport",
    amount: 250,
    date: "2026-06-18",
    trip: "Tokyo Adventure",
  },
];

const trips = [
  { id: "1", name: "Tokyo Adventure", budget: 4500, spent: 2850 },
  { id: "2", name: "Paris Getaway", budget: 2000, spent: 500 },
];

function AddExpenseDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input placeholder="e.g., Dinner at local restaurant" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="number" placeholder="0.00" className="pl-8" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {budgetCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full", cat.color)} />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Trip</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select trip" />
              </SelectTrigger>
              <SelectContent>
                {trips.map((trip) => (
                  <SelectItem key={trip.id} value={trip.id}>
                    {trip.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button className="flex-1">Add Expense</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CategoryCard({ category }: { category: (typeof budgetCategories)[0] }) {
  const percentage = Math.round((category.spent / category.budget) * 100);
  const isOverBudget = category.spent > category.budget;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <Card className={cn(
        "hover:border-primary/50 transition-all",
        isOverBudget && "border-destructive/50"
      )}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white", category.color)}>
                <category.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground">
                  ${category.spent.toLocaleString()} of ${category.budget.toLocaleString()}
                </p>
              </div>
            </div>
            {isOverBudget && (
              <Badge variant="destructive" className="text-xs">
                Over budget
              </Badge>
            )}
          </div>
          <Progress
            value={Math.min(percentage, 100)}
            className={cn("h-2", isOverBudget && "[&>div]:bg-destructive")}
          />
          <div className="flex items-center justify-between mt-2 text-sm">
            <span className={cn(
              "font-medium",
              isOverBudget ? "text-destructive" : percentage > 80 ? "text-amber-500" : "text-muted-foreground"
            )}>
              {percentage}% used
            </span>
            <span className="text-muted-foreground">
              ${(category.budget - category.spent).toLocaleString()} left
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ExpenseRow({ expense }: { expense: (typeof recentExpenses)[0] }) {
  const category = budgetCategories.find((c) => c.id === expense.category);
  const Icon = category?.icon || DollarSign;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
    >
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0", category?.color)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{expense.name}</h4>
        <p className="text-sm text-muted-foreground">
          {expense.trip} • {expense.date}
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold">${expense.amount.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground capitalize">{expense.category}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}

export default function BudgetPage() {
  const totalBudget = budgetCategories.reduce((acc, cat) => acc + cat.budget, 0);
  const totalSpent = budgetCategories.reduce((acc, cat) => acc + cat.spent, 0);
  const remaining = totalBudget - totalSpent;
  const percentageUsed = Math.round((totalSpent / totalBudget) * 100);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Budget Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Manage your travel expenses and stay on budget
          </p>
        </div>
        <AddExpenseDialog />
      </div>

      {/* Overview Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Spent</p>
                  <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="text-2xl font-bold text-emerald-500">${remaining.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-sm font-medium">{percentageUsed}%</p>
              </div>
              <Progress value={percentageUsed} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">
                {percentageUsed < 50
                  ? "On track! Keep it up."
                  : percentageUsed < 80
                    ? "You're spending moderately."
                    : "Watch your spending!"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">AI Budget Insight</h3>
                <p className="text-sm text-muted-foreground">
                  Your food expenses are 25% lower than average travelers in Japan. Consider allocating $100 more for
                  unique dining experiences like a traditional kaiseki dinner!
                </p>
              </div>
              <Button variant="secondary" size="sm" className="shrink-0">
                Optimize
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Categories */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Categories</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {budgetCategories.map((category, i) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Expenses</h2>
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </div>
          <Card>
            <CardContent className="p-2 space-y-1">
              {recentExpenses.slice(0, 5).map((expense, i) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ExpenseRow expense={expense} />
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
