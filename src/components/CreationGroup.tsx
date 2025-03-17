import { creation as creationTable } from "@/lib/db/schema";
import CreationView from "./CreationView";

export default function CreationGroup({
  creations,
}: {
  creations: (typeof creationTable.$inferSelect)[];
}) {
  return (
    <>
      <h3>Listing {creations.length} creations.</h3>
      {creations.map((creation) => (
        <CreationView {...creation} key={creation.id} />
      ))}
    </>
  );
}
