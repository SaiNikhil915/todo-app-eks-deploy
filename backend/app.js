const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

mongoose.connect("mongodb://mongo:27017/todoApplication", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const todoSchema = new mongoose.Schema({
  id: Number,
  todo: String,
  priority: String,
  status: String,
});

const Todo = mongoose.model("Todo", todoSchema);

// GET all todos with search/priority/status
app.get("/todos", async (req, res) => {
  const { search_q = "", priority, status } = req.query;
  const query = {
    todo: { $regex: search_q, $options: "i" },
    ...(priority && { priority }),
    ...(status && { status }),
  };
  const todos = await Todo.find(query);
  res.send(todos);
});

// GET single todo
app.get("/todos/:todoId", async (req, res) => {
  const todo = await Todo.findOne({ id: req.params.todoId });
  res.send(todo);
});

// POST new todo
app.post("/todos", async (req, res) => {
  const todo = new Todo(req.body);
  await todo.save();
  res.send("Todo Successfully Added");
});

// PUT to update
app.put("/todos/:todoId", async (req, res) => {
  const updateField = Object.keys(req.body)[0];
  await Todo.updateOne({ id: req.params.todoId }, { $set: req.body });
  res.send(`${updateField.charAt(0).toUpperCase() + updateField.slice(1)} Updated`);
});

// DELETE a todo
app.delete("/todos/:todoId", async (req, res) => {
  await Todo.deleteOne({ id: req.params.todoId });
  res.send("Todo Deleted");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
