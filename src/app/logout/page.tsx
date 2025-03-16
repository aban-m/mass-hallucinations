"use client";

import { signOut, useSession } from "next-auth/react";

export default function LogoutPage() {
    const session = useSession();

    if (session?.data?.user) {
        return (
            <div>
                <pre>{session?.data.user?.id}</pre>
                <h1>Welcome, {session?.data.user?.email}</h1>
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