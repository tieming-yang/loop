//@ts-nocheck
import Loop from "@/data/loop";
import { PageObjectResponse } from "@notionhq/client";
import Link from "next/link";

export default async function LoopPage() {
  const manuScripts = await Loop.getAllManuScripts();

  if (!manuScripts || manuScripts.length === 0) {
    return <p>No chapters found</p>;
  }

  return (
    <ul>
      {manuScripts.map((manuScript) => {
        const { id, title, chapter, createdTime } = manuScript;

        return (
          <li key={id}>
            <Link href={`/loop/${chapter}-${title}`}>
              {chapter} - {title} - {createdTime}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
