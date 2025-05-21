// app/ring/page.tsx  (Server Component)
import Loop from "@/data/loop";
import Link from "next/link";


export default async function LoopPage() {
  const chapters = await Loop.getAllManuScripts()
  console.log("server chapters", chapters);

  if (!chapters || chapters.length === 0) {
    return <p>No chapters found</p>;
  }

   return (
    <ul>
      {chapters.map((chap) => (
        <li key={chap.id}>
          <Link href={`/ring/${chap.id}`}>
            {chap.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}