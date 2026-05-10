"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  Loader2,
  MapPin,
  Calendar,
  DollarSign,
  Utensils,
  Mountain,
  Sun,
  Maximize2,
  Minimize2,
  Bot,
  User,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useTravelStore, type Message } from "@/lib/store";

const quickPrompts = [
  { icon: MapPin, label: "Find hidden gems", prompt: "Find me hidden gems in my destination" },
  { icon: Calendar, label: "Optimize schedule", prompt: "Help me optimize my itinerary schedule" },
  { icon: DollarSign, label: "Budget tips", prompt: "Give me budget-saving tips for my trip" },
  { icon: Utensils, label: "Food recommendations", prompt: "Recommend local food experiences" },
  { icon: Mountain, label: "Activities", prompt: "Suggest unique activities and experiences" },
  { icon: Sun, label: "Weather advice", prompt: "What should I pack based on the weather?" },
];

const sampleResponses: Record<string, string> = {
  "Find me hidden gems in my destination": `Here are some hidden gems I'd recommend exploring:

🗻 **Secret Viewpoints**
Skip the crowded tourist spots! Head to the local rooftop bars for stunning sunset views that most tourists miss.

🍜 **Local Food Markets**
Visit the morning markets where locals shop. You'll find authentic street food at a fraction of tourist prices.

🎨 **Art Districts**
Explore the emerging art districts - old warehouses converted into galleries and studios. Great for unique souvenirs!

🌿 **Urban Oases**
There's a hidden botanical garden tucked away in the old quarter. Perfect for escaping the crowds.

Would you like me to add any of these to your itinerary?`,

  "Help me optimize my itinerary schedule": `I've analyzed your current itinerary and have some suggestions:

📍 **Route Optimization**
I can reorganize your activities to minimize travel time between locations, saving you ~2 hours of commuting.

⏰ **Timing Adjustments**
- Visit popular attractions early morning (less crowds)
- Schedule outdoor activities for mid-morning
- Keep indoor museums for afternoon heat

🎯 **Suggested Changes:**
1. Move the museum visit to Day 2 afternoon
2. Combine nearby restaurants with sightseeing
3. Add buffer time between major activities

Would you like me to apply these optimizations?`,

  "Give me budget-saving tips for my trip": `Here are smart ways to save on your trip:

💰 **Accommodation**
- Book apartments with kitchens to save on meals
- Stay slightly outside tourist centers
- Consider weekday stays for lower rates

🍽️ **Food & Dining**
- Eat lunch at restaurants (cheaper than dinner menus)
- Visit local markets for fresh groceries
- Ask locals for affordable hidden spots

🚗 **Transportation**
- Get multi-day transit passes
- Walk or bike in city centers
- Use ride-share during off-peak hours

**Estimated Savings: $200-400 on your current trip!**

Want me to update your budget tracker with these estimates?`,

  "default": `I'd be happy to help you with that! As your AI travel copilot, I can:

✈️ **Plan Itineraries** - Generate personalized day-by-day plans
🗺️ **Find Destinations** - Discover places that match your style
💰 **Optimize Budget** - Track expenses and find savings
📦 **Pack Smart** - Create weather-aware packing lists
🍴 **Recommend Food** - Find local culinary experiences
⏰ **Schedule Perfectly** - Optimize your daily timeline

What would you like me to help with today?`
};

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "")}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
          isUser
            ? "bg-gradient-to-br from-primary to-accent"
            : "bg-muted"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-primary-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-primary" />
        )}
      </div>

      <div className={cn("flex-1 max-w-[85%]", isUser ? "text-right" : "")}>
        <div
          className={cn(
            "inline-block px-4 py-3 rounded-2xl text-sm",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted rounded-tl-sm"
          )}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>

        {!isUser && (
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={copyToClipboard}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function AICopilot() {
  const { copilotOpen, setCopilotOpen, copilotMessages, addCopilotMessage } = useTravelStore();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [copilotMessages, isTyping]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date().toISOString(),
    };
    addCopilotMessage(userMessage);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const responseContent = sampleResponses[messageText] || sampleResponses["default"];
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: responseContent,
      timestamp: new Date().toISOString(),
    };
    addCopilotMessage(aiMessage);
    setIsTyping(false);
  };

  if (!copilotOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCopilotOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25 z-50 animate-pulse-glow"
      >
        <Sparkles className="w-6 h-6 text-primary-foreground" />
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={cn(
          "fixed z-50 bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden",
          isExpanded
            ? "inset-4 md:inset-8"
            : "bottom-6 right-6 w-[400px] h-[600px] max-h-[80vh]"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">AI Travel Copilot</h3>
              <p className="text-xs text-muted-foreground">Powered by AI</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() => setCopilotOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {copilotMessages.length === 0 ? (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">How can I help you today?</h3>
                <p className="text-sm text-muted-foreground">
                  I&apos;m your AI travel assistant. Ask me anything!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt.label}
                    onClick={() => handleSend(prompt.prompt)}
                    className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-muted text-left text-sm transition-colors"
                  >
                    <prompt.icon className="w-4 h-4 text-primary shrink-0" />
                    <span className="truncate">{prompt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {copilotMessages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border bg-muted/30">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your trip..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isTyping}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {isTyping ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
