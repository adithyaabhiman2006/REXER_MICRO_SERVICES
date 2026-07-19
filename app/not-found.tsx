import Link from "next/link";
import { Home } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-gradient-accent">404</p>
      <h1 className="mt-4 text-2xl font-semibold">Tool not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The tool you’re looking for doesn’t exist or may have moved.
      </p>
      <Button asChild variant="gradient" className="mt-6">
        <Link href="/">
          <Home className="size-4" />
          Back to all tools
        </Link>
      </Button>
    </div>
  );
}
