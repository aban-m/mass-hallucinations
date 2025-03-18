"use client";

import {signIn, useSession} from "next-auth/react"
import { redirect } from "next/navigation";

export default function LoginPage() {
  const {data: session} = useSession()
  if (session?.user) { 
    return redirect('/')
  }
  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </div>
  )
}