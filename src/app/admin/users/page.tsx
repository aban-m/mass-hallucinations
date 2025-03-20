"use client";
import { trpc } from "@/client/trpc";
import { useSession } from "next-auth/react";

export default function UsersListPage() {
  const session = useSession()
  const listUsers = trpc.listUsers.useQuery(undefined, {enabled: false})

  if (!session.data) {
    return (
        <h1>You are not even logged in.</h1>
    )
  }
  else {
    return (
      <main>
        <button onClick={async () => {listUsers.refetch()}}>Fetch</button>
        {listUsers.data ? (
          <ul>
            {listUsers.data.map((user: { email: string }) => (
              <li key={user.email}>{user.email}</li>
            ))}
          </ul>
        ) : (
          <p>Data not loaded yet.</p>
        )}
        </main>
    )
  }
}
