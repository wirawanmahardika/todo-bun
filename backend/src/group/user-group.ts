import Elysia from "elysia";
import { z } from "zod";
import { jwtConf } from "../config/jwt";
import UserService from "../service/user-service";
import { db } from "../app/db";
import { users } from "../db/schema";

const userGroup = new Elysia({ prefix: "/api/v1/user" })
    .use(jwtConf())
    .get("/info", async ({ jwt, cookie: { auth } }) => {
        const userData =
            typeof auth.value === "string"
                ? await jwt.verify(auth.value)
                : false;
        if (!userData) {
            return new Response("Login is needed", { status: 401 });
        }

        return "user is authenticated";
    })
    .post(
        "/signup",
        async ({ body }) => {
            await db.insert(users).values(body);
            return "berhasil signup";
        },
        {
            body: z.object({
                fullname: z.string().min(1),
                email: z.email("email is not valid"),
                username: z
                    .string()
                    .min(6, "username length should be more than 5"),
                password: z.string().min(1),
            }),
        }
    )
    .post(
        "/login",
        async ({ jwt, body, cookie }) => {
            const authResponse = await UserService.authenticate(body);
            if (authResponse.status < 300) {
                cookie.auth.set({
                    value: await jwt.sign({ username: body.username }),
                    maxAge: 3600 * 24 * 7,
                    path: "/",
                    httpOnly: true,
                    sameSite: "strict",
                });
            }

            return authResponse;
        },
        {
            body: z.object({
                username: z.string().min(1),
                password: z.string().min(1),
            }),
        }
    )
    .delete("/logout", ({ cookie }) => {
        cookie.auth.remove();
        return `Berhasil logout`;
    });

export default userGroup;
