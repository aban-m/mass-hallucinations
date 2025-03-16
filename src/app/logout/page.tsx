"use client";

import { signOut, useSession } from "next-auth/react";

export default function LogoutPage() {
    const { data: session } = useSession();

    if (session?.user) {
        return (
            <div>
                <pre>{session.user?.id}</pre>
                <h1>Welcome, {session.user?.email}</h1>
                <button onClick={() => signOut()}>Logout</button>
            </div>
        );
    }

    return (
        <div>
            <h1>You are not logged in</h1>
        </div>
    );
}