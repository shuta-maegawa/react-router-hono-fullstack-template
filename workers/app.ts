import { Hono } from "hono";

type Bindings = {
  D1bind: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8" />
      <title>ユーザー登録</title>
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <style>
        body { font-family: sans-serif; background: #f7f7f7; }
        .container { max-width: 400px; margin: 2rem auto; padding: 24px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; }
        input, button { width: 100%; padding: 8px; margin-bottom: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>ユーザー登録</h2>
        <form id="userForm">
          <input type="text" id="name" placeholder="ユーザー名" required />
          <button type="submit">登録</button>
        </form>
        <div id="message"></div>
      </div>
      <script>
        document.getElementById('userForm').onsubmit = async function(e) {
          e.preventDefault();
          const name = document.getElementById('name').value;
          const res = await fetch('/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
          });
          const text = await res.text();
          document.getElementById('message').textContent = text;
          document.getElementById('name').value = '';
        };
      </script>
    </body>
    </html>
  `);
});

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
