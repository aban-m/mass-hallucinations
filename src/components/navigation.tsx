"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DynamicNavigation() {
    const path = usePathname();
    return path === "/" ? null : (
      <Button asChild variant="outline">
        <Link href="/">Homepage</Link>
      </Button>
    );
  }