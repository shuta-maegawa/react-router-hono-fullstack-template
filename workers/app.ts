import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// D1データベースから全ユーザー一覧を取得するAPI例
app.get("/users", async (c) => {
  const db = c.env.DB;
  const { results } = await db.prepare("SELECT id, name FROM test-table").all();
  return c.json(results);
});

// D1データベースに新規ユーザーを追加するAPI例
app.post("/users", async (c) => {
  const body = await c.req.json<{ name: string }>();
  const db = c.env.DB;
  await db.prepare("INSERT INTO test-table (name) VALUES (?)").bind(body.name).run();
  return c.text("User added");
});

export default app;
