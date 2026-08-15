import Link from "next/link";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      {/* Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <FileQuestion className="h-10 w-10" />
      </div>

      {/* Heading */}
      <h1 className="font-heading text-5xl font-bold tracking-tight sm:text-6xl">404</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Page not found. The path you requested does not exist.
      </p>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" className="gap-2" nativeButton={false} render={<Link href="/" />}>
          <Home className="h-4 w-4" />
          Back to Home
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="gap-2"
          nativeButton={false}
          render={<Link href="/about" />}
        >
          <ArrowLeft className="h-4 w-4" />
          About
        </Button>
      </div>
    </section>
  );
}
