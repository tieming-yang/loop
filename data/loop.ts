//@ts-nocheck
import { assertIsDefined } from "@/lib/utils";
import { Client, PageObjectResponse } from "@notionhq/client";
import { NotionConverter } from "notion-to-md";

// TODO: Move notion client to a separate file
const notion = new Client({ auth: process.env.NOTION_TOKEN });

interface ManuScript {
  id: string;
  title: string;
  chapter: number;
  createdTime: string;
}

interface Loop {
  dbID: string;
  getAllManuScripts: () => Promise<ManuScript[]>;
  getManuScriptById: (id: string) => Promise<PageObjectResponse>;
}

const Loop = {
  dbID: process.env.LOOP_DB_ID!,

  getAllManuScripts: async (): Promise<ManuScript[]> => {
    assertIsDefined(Loop.dbID, "Loop.dbID is not defined");

    try {
      const { results } = await notion.databases.query({
        database_id: Loop.dbID,
        sorts: [{ property: "Chapter", direction: "ascending" }],
      });

      return results.map((page: PageObjectResponse) => {
        const id = page.id;
        const title = page.properties.Title.title[0]?.plain_text;
        const chapter = page.properties.Chapter.number;
        const createdTime = page.created_time;

        return {
          id,
          title,
          chapter,
          createdTime,
        };
      });
    } catch (error) {
      console.error("Error fetching wiki entries:", error);
      throw new Error("Failed to fetch wiki entries");
    }
  },

  getManuScriptById: async (id: string) => {
    assertIsDefined(id, "id is not defined");
    assertIsDefined(Loop.dbID, "Loop.dbID is not defined");

    try {
      const n2m = new NotionConverter(notion);
      const result = await n2m.convert(id, {
        withRenderer: "html",
      });

      console.log("Retrieved page:", result);
      return result;
    } catch (error) {
      console.error("Error fetching wiki entry:", error);
      throw new Error("Failed to fetch wiki entry");
    }
  },

  isPageInDB: async (id: string): Promise<boolean> => {
    try {
      const page = await notion.pages.retrieve({ page_id: id });

      return (
        page.parent.type === "database_id" &&
        page.parent.database_id === DB_ID
      );
    } catch (err) {
      console.error("Notion retrieve error:", err);
      return false;
    }
  },
};

export default Loop;
