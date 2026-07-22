import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: '--font-display' });
const plexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ['400', '500', '600', '700'], variable: '--font-body' });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ['400', '500', '600'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: "🏬TechMart AI Support",
  description: "Multi-Agent AI Customer Support Assistant",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body className="font-['var(--font-body)'] antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}