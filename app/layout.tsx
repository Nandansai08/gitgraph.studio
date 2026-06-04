import type { Metadata } from "next";
import "../src/index.css";

export const metadata: Metadata = {
  title: "GitGraph Studio",
  description: "An interactive, developer-centric toolkit to design, generate, and automate GitHub contribution graph pixel art.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0f1115] text-[#e5e7eb] font-sans">
        {children}
      </body>
    </html>
  );
}
