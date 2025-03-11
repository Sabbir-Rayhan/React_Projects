import React, { useEffect, useState } from "react";

function Todo() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editText, setEditText] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/alltask");
      const data = await response.json();
      if (data.success) {
        setTasks(data.data.reverse());
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    try {
      await upload(task);
      setTask("");
      fetchData();
    } catch (err) {
      console.error("Failed to upload task:", err);
    }
  };

  const upload = async (task) => {
    try {
      const response = await fetch("http://localhost:3000/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, completed: false }),
      });
      await response.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/delete/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        fetchData();
      }
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await fetch(`http://localhost:3000/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      fetchData();
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const handleEdit = (id, text) => {
    setEditTaskId(id);
    setEditText(text);
  };

  const saveEdit = async (id) => {
    try {
      await fetch(`http://localhost:3000/edit/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editText }),
      });
      setEditTaskId(null);
      fetchData();
    } catch (err) {
      console.error("Failed to edit task:", err);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="w-80 h-96 p-6 bg-[#385785] rounded-md text-white flex flex-col">
        {/* Fixed Header */}
        <h1 className="text-2xl font-bold my-4">To-Do List</h1>

        {/* Fixed Input Field */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 mb-2 bg-[#456892] p-2 rounded-md"
        >
          <input
            type="text"
            className="w-full p-2 rounded-md outline-none bg-transparent text-white placeholder-gray-300"
            placeholder="Add your task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
          />
          <button
            type="submit"
            className="px-3 py-2 font-bold bg-amber-400 text-black rounded-md hover:bg-amber-500 transition cursor-pointer"
          >
            Add
          </button>
        </form>

        {/* Scrollable Task List */}
        <div className="flex flex-col overflow-y-auto scrollbar-hide">
          {tasks.map((value) => (
            <div
              key={value._id}
              className="w-full h-auto p-2 mb-2 bg-[#45689e] rounded-md"
            >
              <h1 className="text-xs font-semibold text-[#ccc]">
                {value.date}
              </h1>
              <div className="w-full flex justify-between items-center">
                <input
                  type="checkbox"
                  checked={value.completed}
                  onChange={() => toggleComplete(value._id, value.completed)}
                  className="w-5 h-5 cursor-pointer"
                />

                {editTaskId === value._id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="text-black outline-none p-1 rounded-md"
                  />
                ) : (
                  <h1
                    className={`font-serif font-semibold my-1 ${
                      value.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {value.text}
                  </h1>
                )}

                <span className="flex gap-2">
                  {editTaskId === value._id ? (
                    <button
                      onClick={() => saveEdit(value._id)}
                      className="bg-green-400 px-2 py-1 rounded-md"
                    >
                      Save
                    </button>
                  ) : (
                    <i
                      onClick={() => handleEdit(value._id, value.text)}
                      className="fa-solid fa-pen mx-2 w-6 h-6 p-1 rounded-md bg-[#385785] text-center cursor-pointer"
                    ></i>
                  )}
                  <i
                    onClick={() => handleDelete(value._id)}
                    className="fa-solid fa-xmark w-6 h-6 p-1 rounded-md bg-[#385785] text-center cursor-pointer"
                  ></i>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Todo;
