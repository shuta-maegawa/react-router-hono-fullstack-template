import { Hono } from "hono";

type Bindings = {
  D1bind: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// D1データベースから全ユーザー一覧を取得するAPI例
app.get("/users", async (c) => {
  const db = c.env.D1bind;
  try {
    const { results } = await db.prepare("SELECT * FROM \"test-table\"").all();
    return c.json(results);
  } catch (e) {
    return c.text("DB Error: " + (e instanceof Error ? e.message : String(e)), 500);
  }
});

// D1データベースに新規ユーザーを追加するAPI例
app.post("/users", async (c) => {
  const body = await c.req.json<{ name: string }>();
  const db = c.env.D1bind;
  try {
    await db.prepare("INSERT INTO \"test-table\" (name) VALUES (?)").bind(body.name).run();
    return c.text("User added");
  } catch (e) {
    return c.text("DB Error: " + (e instanceof Error ? e.message : String(e)), 500);
  }
});

export default app;
