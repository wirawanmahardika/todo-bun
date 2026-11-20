import {
    boolean,
    int,
    mysqlTable,
    varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("User", {
    id: int("id").autoincrement().primaryKey(),
    fullname: varchar("fullname", { length: 191 }).notNull(),
    email: varchar("email", { length: 191 }).notNull(),
    username: varchar("username", { length: 191 }).notNull().unique(),
    password: varchar("password", { length: 191 }).notNull(),
});

export const todos = mysqlTable("Todo", {
    id: int("id").autoincrement().primaryKey(),
    id_user: int("id_user")
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
    activity: varchar("activity", { length: 191 }).notNull(),
    finished: boolean("finished").notNull().default(false),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
