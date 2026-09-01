import type { Metadata } from "next";
import { AccountHeader } from "@/components/account/account-header";
import { AccountNavigation } from "@/components/account/account-navigation";
import { AccountAuthGuard } from "@/components/account/account-auth-guard";
import { SITE_PAGE_METADATA } from "@/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_PAGE_METADATA.account.title,
  description: SITE_PAGE_METADATA.account.description,
  path: SITE_PAGE_METADATA.account.path,
});

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AccountAuthGuard>
      <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12">
        <AccountHeader />
        <AccountNavigation />
        <main>{children}</main>
      </div>
    </AccountAuthGuard>
  );
}
