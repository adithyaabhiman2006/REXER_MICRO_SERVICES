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
      className="h-14 rounded-full border-white/25 px-7 text-sm font-bold text-white hover:bg-white/10 hover:text-white"
    >
      Find the right tool <Search className="size-4" />
    </Button>
  );
}
