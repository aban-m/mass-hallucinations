import Image, {ImageProps} from "next/image";
import { creation } from "@/lib/db/schema"

type CreationViewProps = Omit<ImageProps & (typeof creation.$inferSelect), "src" | "alt">

export default function CreationView(props: CreationViewProps) {
    return (
    <div><Image 
        src={`/api/image/${props.id}`}
        alt={props.title}
        unoptimized
        width={360} height={480}
    />
    <p>{props.title}</p>
    <i>Prompt: {props.prompt}</i>
    </div>)
}