import type { NavItem, FooterSection } from "@/types/navigation";
import { GITHUB_REPO_URL, DATA_SOURCE_URL } from "./site";

/** Navigation items */
export const NAV_ITEMS: NavItem[] = [
  { label: "API Playground", href: "/playground" },
  { label: "Surah Catalog", href: "/surah" },
  { label: "Quickstart", href: "/#quickstart" },
  { label: "Status", href: "/status" },
  { label: "About", href: "/about" },
];

/** Footer sections */
export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "API Playground", href: "/playground" },
      { label: "Surah Catalog", href: "/surah" },
      { label: "Quickstart", href: "/#quickstart" },
      { label: "Status", href: "/status" },
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "GitHub Repository", href: GITHUB_REPO_URL, external: true },
      { label: "Kemenag RI", href: DATA_SOURCE_URL, external: true },
      { label: "License (MIT)", href: `${GITHUB_REPO_URL}/blob/data/LICENSE.md`, external: true },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Issues", href: `${GITHUB_REPO_URL}/issues`, external: true },
      { label: "Pull Requests", href: `${GITHUB_REPO_URL}/pulls`, external: true },
      { label: "Discussions", href: `${GITHUB_REPO_URL}/discussions`, external: true },
    ],
  },
];
