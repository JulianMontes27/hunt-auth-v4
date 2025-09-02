import type { Metadata } from "next";

import "./globals.css";
import { Toaster } from "sonner";
import { Quicksand, Flavors } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
});

const flavors = Flavors({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-flavors",
});

export const metadata: Metadata = {
  title: "Hunt Tickets",
  description: "Auth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${quicksand.variable} ${flavors.variable} antialiased`}
      suppressHydrationWarning
    >
      <head></head>
      <body className="font-quicksand">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
