"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function DynamicNavigation() {
    const path = usePathname();
    return path === "/" ? null : (
      <Button asChild variant="outline">
        <Link href="/">Homepage</Link>
      </Button>
    );
  }