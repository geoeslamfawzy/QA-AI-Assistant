import type { Metadata } from "next";
import { JetBrains_Mono, DM_Sans } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "QA AI Agent | Yassir Mobility",
  description:
    "AI-powered QA assistant for analyzing user stories, generating test cases, detecting impact, and maintaining project context.",
  keywords: [
    "QA",
    "AI",
    "Test Cases",
    "User Stories",
    "Yassir",
    "Mobility",
    "B2B",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen bg-background`}
      >
        <TooltipProvider delayDuration={300}>
          {children}
        </TooltipProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "hsl(var(--card))",
              color: "hsl(var(--card-foreground))",
              border: "1px solid hsl(var(--border))",
            },
          }}
        />
      </body>
    </html>
  );
}
