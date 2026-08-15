/** Navigation link item */
export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

/** Footer section grouping */
export interface FooterSection {
  title: string;
  links: NavItem[];
}

/** Social or external link */
export interface SocialLink {
  label: string;
  href: string;
  iconName: string;
}

/** Project contributor */
export interface Contributor {
  name: string;
  role: string;
  url?: string;
}

/** FAQ item */
export interface FaqItem {
  question: string;
  answer: string;
}

/** Stat display item */
export interface StatItem {
  label: string;
  value: string;
  iconName: string;
  description: string;
}

/** Feature card item */
export interface FeatureItem {
  title: string;
  description: string;
  iconName: string;
}
