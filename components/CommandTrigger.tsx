"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";

export function CommandTrigger() {
  const setOpen = useAppStore((state) => state.setCommandOpen);

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={() => setOpen(true)}
      className="h-14 rounded-full border-white/25 bg-black/10 px-7 text-sm font-bold text-white backdrop-blur hover:bg-white hover:text-black"
    >
      Find the right tool <Search className="size-4" />
    </Button>
  );
}
