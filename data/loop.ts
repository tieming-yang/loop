//@ts-nocheck
import { assertIsDefined } from "@/lib/utils";
import { Client, PageObjectResponse } from "@notionhq/client";

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
      const { results } = await notion.databases.query({
        database_id: process.env.WIKI_DB_ID!,
        filter: {
          property: "ID",
          rich_text: {
            equals: id,
          },
        },
      });
      return results[0];
    } catch (error) {
      console.error("Error fetching wiki entry:", error);
      throw new Error("Failed to fetch wiki entry");
    }
  },
};

export default Loop;
