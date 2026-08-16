import type { Metadata } from "next";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_OPEN_GRAPH,
  SITE_TWITTER,
  SITE_URL,
} from "@/constants";
import type { PageSeoInput } from "@/types/seo";

export function buildPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  keywords = SITE_KEYWORDS,
  openGraph,
  twitter,
}: PageSeoInput = {}): Metadata {
  const canonicalUrl = new URL(path, SITE_URL).toString();
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  return {
    title: pageTitle,
    description,
    keywords,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      ...SITE_OPEN_GRAPH,
      ...openGraph,
      title: openGraph?.title ?? pageTitle,
      description: openGraph?.description ?? description,
      url: openGraph?.url ?? canonicalUrl,
      siteName: openGraph?.siteName ?? SITE_NAME,
    },
    twitter: {
      ...SITE_TWITTER,
      ...twitter,
      title: twitter?.title ?? pageTitle,
      description: twitter?.description ?? description,
      images: twitter?.images ?? SITE_TWITTER.images,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}
