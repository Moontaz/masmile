import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/site/custom-cursor";
import { InitialLoader } from "@/components/site/initial-loader";
import { Navigation } from "@/components/site/navigation";
import { RouteTransition } from "@/components/site/route-transition";

const inter = Inter({
   subsets: ["latin"],
   variable: "--font-inter",
   display: "swap",
});
const spaceGrotesk = Space_Grotesk({
   subsets: ["latin"],
   variable: "--font-space-grotesk",
   display: "swap",
});

export const metadata: Metadata = {
   title: "masmile — See your smile in real time",
   description:
      "A browser-based creative experiment in local face landmarks and smile estimation.",
};

export default function RootLayout({
   children,
}: Readonly<{ children: React.ReactNode }>) {
   return (
      <html lang="en">
         <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
            <InitialLoader />
            <RouteTransition />
            <Navigation />
            <main>{children}</main>
            <CustomCursor />
         </body>
      </html>
   );
}
