import Elysia from "elysia";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../app/db";
import { todos } from "../db/schema";
import { jwtConf } from "../config/jwt";
import TodoService from "../service/todo-service";

const todoGroup = new Elysia({ prefix: "/api/v1/todo" })
    .use(jwtConf())
    .state({ username: "" })
    .onBeforeHandle(async ({ jwt, store, cookie: { auth } }) => {
        const userData =
            typeof auth.value === "string"
                ? await jwt.verify(auth.value)
                : false;
        if (!userData)
            return new Response("you are not allowed", { status: 401 });

        store.username = String(userData.username);
    })
    .post(
        "/",
        async ({ body, set, store }) => {
            const idUser = await TodoService.getIdUser(store.username);
            const [inserted] = await db
                .insert(todos)
                .values({ id_user: idUser, activity: body.activity })
                .$returningId();

            const [response] = await db
                .select()
                .from(todos)
                .where(eq(todos.id, inserted.id))
                .limit(1);

            set.status = 201;
            return {
                message: "Berhasil membuat todo baru",
                data: response,
            };
        },
        {
            body: z.object({
                activity: z.string().min(1),
            }),
        }
    )
    .get("/", async ({ store }) => {
        const idUser = await TodoService.getIdUser(store.username);
        const data = await db
            .select()
            .from(todos)
            .where(eq(todos.id_user, idUser));
        return data;
    })
    .delete(
        "/:id",
        async ({ params, store }) => {
            const idUser = await TodoService.getIdUser(store.username);

            await db.transaction(async (tx) => {
                await tx
                    .delete(todos)
                    .where(
                        and(eq(todos.id, params.id), eq(todos.id_user, idUser))
                    );
            });

            return new Response("Berhasil menghapus todo", { status: 200 });
        },
        {
            params: z.object({
                id: z.coerce.number().int().positive(),
            }),
        }
    )
    .patch(
        "/:id",
        async ({ params, body, store }) => {
            const idUser = await TodoService.getIdUser(store.username);

            await db.transaction(async (tx) => {
                const updateData: { activity?: string; finished?: boolean } =
                    {};
                if (body.activity !== undefined) {
                    updateData.activity = body.activity;
                }
                if (body.finished !== undefined) {
                    updateData.finished = body.finished;
                }
                if (Object.keys(updateData).length === 0) return;

                await tx
                    .update(todos)
                    .set(updateData)
                    .where(
                        and(eq(todos.id, params.id), eq(todos.id_user, idUser))
                    );
            });

            return "Berhasil mengubah todo";
        },
        {
            body: z.object({
                activity: z.string().min(1).optional(),
                finished: z.boolean().optional(),
            }),
            params: z.object({
                id: z.coerce.number().int().positive(),
            }),
        }
    );

export default todoGroup;
