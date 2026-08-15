"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export function HashScroll() {
  const pathname = usePathname();
  const router = useRouter();

  // Helper function to scroll to element with offset
  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    // 1. Intercept clicks on links that point to hash targets
    const handleLinkClick = (e: MouseEvent) => {
      // Find the closest anchor tag
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Match hash links like "#api-playground" or "/#api-playground"
      const hashMatch = href.match(/^(?:\/)?#([a-zA-Z0-9_-]+)$/);
      if (!hashMatch) return;

      const hashName = hashMatch[1];

      // Ignore modifier clicks
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      if (pathname === "/") {
        // Same page (home) -> smooth scroll and prevent default hash URL update
        e.preventDefault();
        scrollToElement(hashName);
      } else {
        // Different page -> prevent default, save target in sessionStorage, navigate to home "/"
        e.preventDefault();
        sessionStorage.setItem("scroll-to-hash", hashName);
        router.push("/");
      }
    };

    document.addEventListener("click", handleLinkClick);

    // 2. Handle scroll on page load/navigation if there is a pending hash in sessionStorage
    if (pathname === "/") {
      const pendingHash = sessionStorage.getItem("scroll-to-hash");
      if (pendingHash) {
        // Clear immediately so it doesn't trigger again
        sessionStorage.removeItem("scroll-to-hash");
        const timer = setTimeout(() => {
          scrollToElement(pendingHash);
        }, 150);
        return () => clearTimeout(timer);
      }

      // 3. If user lands on the page with a hash in URL (e.g. /#api-playground), scroll and strip the hash
      if (window.location.hash) {
        const hashName = window.location.hash.slice(1);
        const timer = setTimeout(() => {
          scrollToElement(hashName);
          // Strip the hash from the URL without reloading
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }, 150);
        return () => clearTimeout(timer);
      }
    }

    return () => {
      document.removeEventListener("click", handleLinkClick);
    };
  }, [pathname, router]);

  return null;
}
