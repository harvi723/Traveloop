import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Traveloop — AI-Powered Travel Planning",
  description:
    "Plan your dream trips with AI. Discover hidden gems, build collaborative itineraries, and create unforgettable travel experiences.",
  keywords: [
    "travel planning",
    "AI travel",
    "itinerary builder",
    "trip planner",
    "collaborative travel",
  ],
  authors: [{ name: "Traveloop Team" }],
  openGraph: {
    title: "Traveloop — AI-Powered Travel Planning",
    description:
      "Plan your dream trips with AI. Discover hidden gems, build collaborative itineraries, and create unforgettable travel experiences.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Traveloop — AI-Powered Travel Planning",
    description: "Plan your dream trips with AI.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a12" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
