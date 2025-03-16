"use client";

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyPrivateGalleryPage() {
  const { data: session } = useSession();
  if (session?.user) {
    return redirect(`/gallery/${session!.user.id}`);
  } else {
    return (
      <>
        <p>Not logged in.</p>
      </>
    );
  }
}
