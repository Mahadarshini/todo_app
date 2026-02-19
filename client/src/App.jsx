import { useEffect, useState } from "react";
import api from "./api";

export default function App() {
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const getTodos = async () => {
    const res = await api.get("/todo");
    setTodos(res.data);
  };

const addTodo = async () => {
  if (!title.trim()) return;
  await api.post("/todo", {
    title,
    priority,
    due_date: dueDate
  });
  getTodos();
  setTitle("");
};

const deleteTodo = async (id) => {
    await api.delete(`/todo/${id}`);
    getTodos();
  };

  const toggleComplete = async (id, completed) => {
    await api.put(`/todo/${id}`, {
      completed: !completed,
    });
    getTodos();
  };

  useEffect(() => {
    getTodos();
  }, []);

  const filteredTodos = todos.filter((todo) => {
  if (filter === "completed") return todo.completed;
  if (filter === "pending") return !todo.completed;
  return true;
});
const sortedTodos = [...filteredTodos].sort((a, b) => {
  if (!a.due_date) return 1;
  if (!b.due_date) return -1;
  return new Date(a.due_date) - new Date(b.due_date);
});


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 p-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl w-full max-w-xl mx-4">

        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          🚀 My Todo App
        </h1>

        {/* Input Row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={addTodo}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition w-full sm:w-auto"
          >
            Add
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="px-3 py-2 border rounded-xl"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-3 py-2 border rounded-xl"
          />
        </div>

        {/* Filter Row */}
        <p className="text-center text-sm text-gray-500 mb-4">
          {todos.filter(t => !t.completed).length} tasks left
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {["all", "pending", "completed"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full capitalize transition ${
                filter === type
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {todos.length === 0 ? (
          <p className="text-center text-gray-400">
            No tasks yet. Let’s get productive 👀
          </p>
        ) : (
          <ul className="space-y-4">
            {sortedTodos.map((todo) => {
              const isOverdue =
                !todo.completed &&
                todo.due_date &&
                new Date(todo.due_date) < new Date();

              return (
              <li
                key={todo.id}
                className={`flex justify-between items-center p-4 sm:px-6 rounded-2xl shadow-sm transition-all duration-200 cursor-pointer${
                  todo.completed
                  ? "bg-gray-200 opacity-60"
                  : isOverdue && todo.priority === "high"
                  ? "bg-red-200 border border-red-900"
                  : isOverdue && todo.priority === "medium"
                  ? "bg-red-200 border border-red-500"
                  : isOverdue
                  ? "bg-red-100 border border-red-100"
                  : "bg-gray-100 hover:shadow-md"
                }`}
                
                onClick={() => toggleComplete(todo.id, todo.completed)}
              >
                <div className="flex flex-col">
                  <span
                    className={`text-lg ${
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-700"
                    }`}
                  >
                    {todo.title}
                  </span>

                  <div className="flex flex-wrap gap-2 mt-1 text-sm items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-white ${
                        todo.priority === "high"
                          ? "bg-red-500"
                          : todo.priority === "low"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {todo.priority}
                    </span>

                    {todo.due_date && (
                      <span className="text-gray-500">
                        Due: {new Date(todo.due_date).toLocaleDateString()}
                      </span>
                    )}
                    {isOverdue && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                        Overdue
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevents marking complete when deleting
                    deleteTodo(todo.id);
                  }}
                  className="text-red-500 hover:text-red-700 text-xl transition"
                >
                  ✕
                </button>
              </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
