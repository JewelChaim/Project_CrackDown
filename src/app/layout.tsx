import "./globals.css";
import AppNav from "@/components/AppNav";
import Providers from "./providers";

export const metadata = { title: "Jewel Healthcare — Project CrackDown", description: "Internal QA & Onboarding" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">
        {/* @ts-expect-error Server Component */}
        <AppNav />
        <main className="container py-8"><div className="mx-auto max-w-6xl space-y-8">{children}</div></main>
        <Providers>{/* client providers here */}</Providers>
      </body>
    </html>
  );
}
