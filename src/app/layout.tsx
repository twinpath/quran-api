import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  DM_Sans,
  Aref_Ruqaa,
  Amiri_Quran, Noto_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/common/theme-provider";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { HashScroll } from "@/components/common/hash-scroll";
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_URL,
  SITE_ORGANIZATION_SCHEMA,
  SITE_WEBSITE_SCHEMA,
} from "@/constants";
import { buildPageMetadata } from "@/lib/seo";

const playfairDisplayHeading = Playfair_Display({subsets:['latin'],variable:'--font-heading'});

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'});

export const dynamic = "force-dynamic";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const amiriQuran = Amiri_Quran({
  subsets: ["arabic", "latin"],
  weight: ["400"],
  variable: "--font-arabic-read",
  display: "swap",
});

const arefRuqaa = Aref_Ruqaa({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-arabic-display",
  display: "swap",
});

export const metadata: Metadata = {
  ...buildPageMetadata({
    description: SITE_DESCRIPTION,
    path: "/",
  }),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
  authors: [{ name: "Twinpath" }],
  category: "technology",
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", notoSans.variable, playfairDisplayHeading.variable, geistMono.variable, amiriQuran.variable, arefRuqaa.variable)}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(SITE_WEBSITE_SCHEMA),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(SITE_ORGANIZATION_SCHEMA),
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            <div className="relative flex min-h-screen flex-col">
              <HashScroll />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
