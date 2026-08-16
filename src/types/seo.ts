import type { Metadata } from "next";

export type PageSeoInput = {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  openGraph?: Metadata["openGraph"];
  twitter?: Metadata["twitter"];
};

export type SitePageMetadataItem = {
  title: string;
  description: string;
  path: string;
};

export type SitePageMetadataMap = Record<string, SitePageMetadataItem>;
