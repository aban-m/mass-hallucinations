import Image, { ImageProps } from "next/image";
import { creation } from "@/lib/db/schema";
import Link from "next/link";

type CreationViewProps = Omit<
  ImageProps & typeof creation.$inferSelect,
  "src" | "alt"
>;

export default function CreationView(props: CreationViewProps) {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg p-2">
      <Image
        src={`/api/image/${props.id}`}
        alt={props.title}
        unoptimized
        width={360}
        height={480}
        className="rounded-md"
      />
      <div className="mt-2">
        <Link
          href={`/studio?buildOn=${props.id}`}
          className="text-blue-500 underline"
        >
          Clone
        </Link>
        <code className="block text-sm text-gray-500">{props.id}</code>
        <Link href={`/piece/${props.id}`}>
          <p className="font-medium">{props.title}</p>
        </Link>
        <i className="text-sm text-gray-600">Prompt: {props.prompt}</i>
      </div>
    </div>
  );
}
