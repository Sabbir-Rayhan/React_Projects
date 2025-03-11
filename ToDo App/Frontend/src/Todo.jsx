import React, { useEffect, useState } from "react";
import "./style.css"; // Correct path if the file is in src/

function Todo() {
  const [edit, setedit] = useState(null);
  const [text, setText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [edittext, seteditText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/addtask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        setText("");
        fetchTask();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTask = async () => {
    const res = await fetch("http://localhost:3000/alltask");
    const data = await res.json();
    if (data.success) {
      const sortedTasks = data.task.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTasks(sortedTasks);
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/deltask/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        fetchTask();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleComplete = async (id, completed) => {
    try {
      const res = await fetch(`http://localhost:3000/complete/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !completed }),
      });
      const data = await res.json();
      if (data.success) {
        fetchTask();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (id, text) => {
    setedit(id);
    seteditText(text);
  };

  const handleSaveEdit = async (id) => {
    try {
      const resp = await fetch(`http://localhost:3000/saveedit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ edittext }),
      });
      const data = await resp.json();
      if (data.success) {
        setedit(null);
        fetchTask();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    return { date: formattedDate, time: formattedTime };
  };

  return (
    <div className="w-full min-h-screen bg-[#346673] flex justify-center items-center">
      <div className="w-[450px] h-[650px] bg-[#2c5863] p-6 rounded-md flex flex-col">
        {/* Fixed Heading and Input Box */}
        <div className="flex-shrink-0">
          <h1 className="font-bold text-3xl text-center text-white mb-6 mt-3">To-Do-List</h1>
          <form onSubmit={handleSubmit}>
            <input
              onChange={handleChange}
              required
              type="text"
              name="text"
              value={text}
              placeholder="Add Task..."
              className="w-[80%] border-2 border-[#346673] text-white rounded-md p-2 outline-none mb-3 bg-[#4a8493]"
            />
            <button type="submit" className="font-bold text-[#ccc] px-4 py-2 rounded-md ml-2 bg-[#1f4752] cursor-pointer">
              Add
            </button>
          </form>
        </div>

        {/* Scrollable Task List */}
        <div className="flex-grow overflow-y-auto scrollbar-hide">
          {tasks.map((value, index) => {
            const { date: taskDate, time: taskTime } = formatDate(value.date);
            return (
              <div key={index} className="w-full h-auto p-4 bg-[#346673] mb-3 shadow-xl rounded-md">
                <h1 className="font-bold text-xs text-[#b8b1b1] mb-2">
                  {taskDate} at {taskTime}
                </h1>
                <div className="w-full h-auto flex justify-between">
                  {edit === value._id ? (
                    <div className="flex justify-between">
                      <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(value._id); }}>
                        <input
                          type="text"
                          value={edittext}
                          onChange={(e) => seteditText(e.target.value)}
                          className="w-[60%] p-2 outline-none border-1 border-white rounded-md"
                        />
                        <button type="submit" className="font-bold mx-2 text-sm text-white bg-[#2ec02e] rounded-md px-3 py-1 cursor-pointer">
                          Save
                        </button>
                        <button type="button" onClick={() => setedit(null)} className="font-bold text-sm text-white bg-[#d62f2f] rounded-md px-2 py-1 cursor-pointer">
                          Cancel
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="w-full h-auto flex justify-between">
                      <div className="content flex gap-2">
                        <input
                          type="checkbox"
                          checked={value.completed}
                          onChange={() => handleComplete(value._id, value.completed)}
                        />
                        <p className={`font-semibold font-serif mt-[3px] ${value.completed ? "line-through text-[#a6a0a0]" : "text-[#ece4e4]"}`}>
                          {value.task}
                        </p>
                      </div>
                      <div className="icon">
                        <span>
                          <i onClick={() => handleEdit(value._id, value.task)} className="fa-solid text-[#ccc] mx-2 cursor-pointer fa-pen-to-square"></i>
                        </span>
                        <span>
                          <i onClick={() => handleDelete(value._id)} className="fa-solid text-[#ccc] mx-2 cursor-pointer fa-xmark text-[16px]"></i>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Todo;