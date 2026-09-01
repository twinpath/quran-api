import type { Metadata } from "next";
import {
  Fraunces,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
  Aref_Ruqaa,
  Amiri_Quran,
} from "next/font/google";
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

export const dynamic = "force-dynamic";

const frauncesHeading = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "font-sans",
        plusJakartaSans.variable,
        frauncesHeading.variable,
        jetbrainsMono.variable,
        amiriQuran.variable,
        arefRuqaa.variable
      )}
    >
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
