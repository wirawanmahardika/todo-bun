import { eq } from "drizzle-orm";
import { db } from "../app/db";
import { users } from "../db/schema";

type bodyType = {
    username: string;
    password: string;
};

export default abstract class UserService {
    static async authenticate(body: bodyType): Promise<Response> {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.username, body.username))
            .limit(1);

        if (!user) {
            return new Response("username tidak pernah terdaftar", {
                status: 401,
            });
        }

        if (body.password !== user.password) {
            return new Response("password salah", {
                status: 401,
            });
        }

        return new Response("berhasil login", { status: 200 });
    }
}
