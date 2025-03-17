"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function DynamicNavigation() {
    const path = usePathname()
    return (path === '/' ? (
        <></>
    ) : (
        <><Link href='/'>Homepage</Link><br /></>
    ))
}