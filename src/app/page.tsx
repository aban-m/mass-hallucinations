"use client";
import { trpc } from "@/client/trpc";
export default function Home() {
  const result = trpc.ping.useQuery(undefined, { enabled: false });
  const reset = trpc.reset.useMutation();

  return (
    <>
      <button onClick={async () => await result.refetch()}>Refetch</button>
      <button onClick={async () => await reset.mutate()}>Reset</button>
      <p>{result.data}</p>
    </>
  );
}
