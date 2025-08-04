import fs from "fs";
import {databaseRoute} from "../../utils/database";

export async function GET() {
  try {
    const file = fs.readFileSync(databaseRoute("games", "list.json"), "utf8");
    return Response.json(JSON.parse(file));
  } catch {
    return new Response.json({message: "games not found"}, {status: 500});
  }
}