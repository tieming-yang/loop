//@ts-nocheck
import Loop from "@/data/loop";
import { PageObjectResponse } from "@notionhq/client";
import Link from "next/link";

export default async function LoopPage() {
  const chapters = await Loop.getAllManuScripts();
  console.log("server chapters", chapters);

  if (!chapters || chapters.length === 0) {
    return <p>No chapters found</p>;
  }

  return (
    <ul>
      {chapters.map((chap) => {
        const page = chap as PageObjectResponse;
        const id = page.id;
        const title = page.properties.Title.title[0]?.plain_text;
        const chapter = page.properties.Chapter.number;
        const createdTime = Date(page.created_time).toLocaleString();

        return (
          <li key={page.id}>
            <Link href={`/loop/${page.id}`}>
              {chapter} - {title} - {createdTime}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
