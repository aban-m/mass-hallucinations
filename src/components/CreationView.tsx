import Image, { ImageProps } from "next/image";
import { creation } from "@/lib/db/schema";
import Link from "next/link";

type CreationViewProps = Omit<
  ImageProps & typeof creation.$inferSelect,
  "src" | "alt"
>;

export default function CreationView(props: CreationViewProps) {
  return (
    <div>
      <Link href={`/piece/${props.id}`}>
        <Image
          src={`/api/image/${props.id}`}
          alt={props.title}
          unoptimized
          width={360}
          height={480}
        />
      </Link>
      <Link href={`/studio?buildOn=${props.id}`}>Clone</Link>
      <pre>{props.id}</pre>
      <p>{props.title}</p>
      <i>Prompt: {props.prompt}</i>
    </div>
  );
}
