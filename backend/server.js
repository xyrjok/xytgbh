const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const app = express();
const port = 3000;

app.use(bodyParser.json());

// 数据库初始化
const db = new sqlite3.Database("./database.sqlite");
db.run(`CREATE TABLE IF NOT EXISTS tg_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone_number TEXT NOT NULL,
  status TEXT DEFAULT 'inactive',
  last_active TEXT
)`);

// 添加账号
app.post("/accounts", (req, res) => {
  const { phone } = req.body;
  db.run("INSERT INTO tg_accounts(phone_number) VALUES(?)", [phone], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// 获取账号列表
app.get("/accounts", (req, res) => {
  db.all("SELECT * FROM tg_accounts", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 删除账号
app.delete("/accounts/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM tg_accounts WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// 批量保号接口（触发 Python 脚本）
app.post("/keepalive", (req, res) => {
  exec("python3 keepalive.py", (err, stdout, stderr) => {
    if (err) {
      console.error(stderr);
      return res.status(500).json({ error: stderr });
    }
    res.json({ success: true, output: stdout });
  });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
