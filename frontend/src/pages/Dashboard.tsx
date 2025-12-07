import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api, { Task } from "../services/api";
import TaskItem from "../components/TaskItem";

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await api.getTasks();
      setTasks(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      const newTask = await api.createTask(title, description || undefined);
      setTasks([newTask, ...tasks]);
      setTitle("");
      setDescription("");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    }
  };

  const handleToggleDone = async (taskId: string, currentDone: boolean) => {
    try {
      const updatedTask = await api.updateTask(taskId, { done: !currentDone });
      setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  const handleUpdateTask = async (
    taskId: string,
    updates: { title?: string; description?: string }
  ) => {
    try {
      const updatedTask = await api.updateTask(taskId, updates);
      setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  const handleLogout = () => {
    api.removeAuthToken();
    navigate("/login");
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.done;
    if (filter === "completed") return task.done;
    return true;
  });

  const stats = {
    total: tasks.length,
    active: tasks.filter((t) => !t.done).length,
    completed: tasks.filter((t) => t.done).length,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.active}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>

        {/* Create Task Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Create New Task
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description (optional)..."
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Add Task
            </button>
          </form>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-4">
          <div className="flex border-b">
            <button
              onClick={() => setFilter("all")}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                filter === "all"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                filter === "active"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Active ({stats.active})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                filter === "completed"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Completed ({stats.completed})
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {loading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
              Loading tasks...
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
              {filter === "all" && "No tasks yet. Create one above!"}
              {filter === "active" && "No active tasks."}
              {filter === "completed" && "No completed tasks."}
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleDone={handleToggleDone}
                onDelete={handleDeleteTask}
                onUpdate={handleUpdateTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
