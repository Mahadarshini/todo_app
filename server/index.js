import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running");
});

app.post("/todo", async (req, res) => {
  try {
    const { title, priority, due_date } = req.body;

    const newTodo = await pool.query(
      "INSERT INTO todo (title, priority, due_date) VALUES ($1, $2, $3) RETURNING *",
      [title, priority || "medium", due_date || null]
    );

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/todo", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo ORDER BY id DESC");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.put("/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    await pool.query(
      "UPDATE todo SET completed = $1 WHERE id = $2",
      [completed, id]
    );

    res.json("Updated");
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM todo WHERE id = $1", [id]);

    res.json("Deleted");
  } catch (err) {
    console.error(err.message);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
