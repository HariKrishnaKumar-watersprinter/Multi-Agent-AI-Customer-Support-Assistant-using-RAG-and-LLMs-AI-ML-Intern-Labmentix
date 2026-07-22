import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "🏬TechMart AI Support",
  description: "Multi-Agent AI Customer Support Assistant",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      style={{
        // @ts-expect-error custom properties
        "--font-display": "'Space Grotesk', sans-serif",
        "--font-body": "'IBM Plex Sans', sans-serif",
        "--font-mono": "'IBM Plex Mono', monospace",
      }}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-['var(--font-body)'] antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
