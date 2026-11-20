import { eq } from "drizzle-orm";
import { db } from "../app/db";
import { users } from "../db/schema";

export default class TodoService {
    static async getIdUser(username: string): Promise<number> {
        const [userdata] = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.username, username))
            .limit(1);

        if (!userdata?.id) {
            throw new Error("user tidak ditemukan");
        }
        return userdata.id;
    }
}
