import { ImageProps } from "next/image";
import { creation } from "@/lib/db/schema";
import Link from "next/link";
import { Card, CardContent } from "^/card";
import { Button } from "^/button";

type CreationViewProps = Omit<
  ImageProps & typeof creation.$inferSelect,
  "src" | "alt"
>;

export default function CreationView({ id, title, prompt }: CreationViewProps) {
  return (
    <Card className="relative overflow-hidden rounded-2xl shadow-md p-3 flex flex-col items-center">
      <img
        src={`/api/image/${id}`}
        alt={title}
        width={360}
        height={480}
        className="rounded-lg hover:opacity-90 transition-all duration-150"
      />
      <CardContent className="w-full mt-3 flex flex-col items-center text-center p-0">
        <p className="font-medium text-lg">{title}</p>
        <i className="text-sm text-gray-500">{prompt}</i>
        <div className="flex gap-2 mt-2">
          <Button size="sm" variant="outline" asChild>
            <Link href={`/studio?buildOn=${id}`}>Clone</Link>
          </Button>
          <Button size="sm" variant="link" asChild>
            <Link href={`/piece/${id}`}>View</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
