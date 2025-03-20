"use client";
import { useParams } from "next/navigation";
import { trpc } from "@/client/trpc";
import CreationView from "@/components/CreationView";
import Link from "next/link";

export default function PiecePage() {
  const { imageUUID } = useParams<{ imageUUID: string }>();
  const { data: creation, isLoading, error } = trpc.piece.useQuery(imageUUID);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <h1>ERROR: {error.message}</h1>;
  }
  return (
    <>
      <CreationView {...creation!} />
      <p>{creation.description}</p>
      <p>
        <Link href={`/profile/${creation.userId}`}>Go to creator</Link>
      </p>
    </>
  );
}
