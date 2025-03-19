import { Creation } from "@/lib/db/schema";
import CreationView from "./CreationView";

export default function CreationGroup({
  creations,
}: {
  creations: Creation[];
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Listing {creations.length} creations
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {creations.map((creation) => (
          <CreationView {...creation} key={creation.id} />
        ))}
      </div>
    </div>
  );
}
