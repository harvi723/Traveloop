"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Check, Loader2, Wand2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PackingItem, PackingCategory } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES: { label: string; value: PackingCategory }[] = [
  { label: "Clothing", value: "clothing" },
  { label: "Toiletries", value: "toiletries" },
  { label: "Electronics", value: "electronics" },
  { label: "Documents", value: "documents" },
  { label: "Health", value: "health" },
  { label: "Accessories", value: "accessories" },
  { label: "Misc", value: "misc" }
];

export function PackingListTab({ tripId }: { tripId: string }) {
  const [items, setItems] = useState<PackingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<PackingCategory>("clothing");
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    fetchItems();
  }, [tripId]);

  async function fetchItems() {
    try {
      const { data, error } = await supabase
        .from("packing_items")
        .select("*")
        .eq("trip_id", tripId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      console.error("Error fetching packing items:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function addItem(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem = {
      trip_id: tripId,
      name: newItemName.trim(),
      category: newItemCategory,
      quantity: 1,
      packed: false,
    };

    setNewItemName("");

    try {
      const { data, error } = await supabase
        .from("packing_items")
        .insert(newItem)
        .select()
        .single();

      if (error) throw error;
      if (data) setItems([data, ...items]);
    } catch (error: any) {
      console.error("Error adding item:", error);
      toast({ title: "Error adding item", variant: "destructive" });
    }
  }

  async function togglePacked(id: string, currentPacked: boolean) {
    // Optimistic update
    setItems(items.map((item) => (item.id === id ? { ...item, packed: !currentPacked } : item)));

    try {
      const { error } = await supabase
        .from("packing_items")
        .update({ packed: !currentPacked })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      // Revert on error
      setItems(items.map((item) => (item.id === id ? { ...item, packed: currentPacked } : item)));
      toast({ title: "Error updating item", variant: "destructive" });
    }
  }

  async function deleteItem(id: string) {
    setItems(items.filter((item) => item.id !== id));
    try {
      const { error } = await supabase.from("packing_items").delete().eq("id", id);
      if (error) throw error;
    } catch (error) {
      fetchItems(); // revert all
      toast({ title: "Error deleting item", variant: "destructive" });
    }
  }

  const itemsByCategory = ITEMS_GROUPED(items);
  const totalItems = items.length;
  const packedItems = items.filter(i => i.packed).length;
  const progress = totalItems === 0 ? 0 : Math.round((packedItems / totalItems) * 100);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Progress */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="w-full max-w-md">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">Packing Progress</h3>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <Button 
          variant="outline"
          className="bg-primary/5 hover:bg-primary/10 border-primary/20"
          onClick={() => {
            // Placeholder: AI Generation hook up
            toast({ title: "AI Generation coming soon!" })
          }}
        >
          <Wand2 className="w-4 h-4 mr-2 text-primary" />
          Auto-Suggest AI
        </Button>
      </div>

      {/* Add New Item */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={addItem} className="flex gap-4 items-center">
            <Input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Add a new item... (e.g. Passport, Sunglasses)"
              className="flex-1"
            />
            <Select value={newItemCategory} onValueChange={(val: PackingCategory) => setNewItemCategory(val)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* List per Category */}
      <div className="grid md:grid-cols-2 gap-6">
        {CATEGORIES.map((category) => {
          const categoryItems = itemsByCategory[category.value] || [];
          if (categoryItems.length === 0) return null;

          return (
            <Card key={category.value}>
              <CardHeader className="py-4 border-b">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>{category.label}</span>
                  <Badge variant="secondary">{categoryItems.filter((i) => i.packed).length} / {categoryItems.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <AnimatePresence>
                  {categoryItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={item.packed} 
                          onCheckedChange={() => togglePacked(item.id, item.packed)}
                          className="w-5 h-5"
                        />
                        <span className={item.packed ? "line-through text-muted-foreground transition-all" : "transition-all"}>
                          {item.name}
                        </span>
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive shrink-0" onClick={() => deleteItem(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {totalItems === 0 && (
         <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
           <p>Your packing list is empty!</p>
           <p className="text-sm mt-1">Add items manually or use AI to generate a list.</p>
         </div>
      )}
    </div>
  );
}

function ITEMS_GROUPED(items: PackingItem[]) {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, PackingItem[]>);
}