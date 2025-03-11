const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const app = express();
const tasks = require("./TaskList");

// MidddleWare Section
app.use(bodyparser.json());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/", (req, res) => {
  res.send("maheee");
});

app.post("/addtask", async (req, res) => {
  let { text } = req.body;
  try {
    let task = await tasks.create({
      task: text,
    });
    console.log(task);
    res.json({ success: true, message: "Added Task" });
  } catch (err) {
    console.log(err);
  }
});

app.get("/alltask", async (req, res) => {
  try {
    let task = await tasks.find();
    res.json({ success: true, task });
  } catch (err) {
    console.log(err);
  }
});

app.delete("/deltask/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let del = await tasks.findByIdAndDelete(id);
    if (del) {
      res.json({ success: true, message: "Deleted Task Successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.put("/complete/:id", async (req, res) => {
    try {
      let { id } = req.params;
      let { completed } = req.body;
      let compel = await tasks.findByIdAndUpdate(id, { completed}, { new: true });
      if (compel) {
        res.json({ success: true, message: "Updated Task Successfully" });
      } else {
        res.status(404).json({ success: false, message: "Task not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  
  app.put("/saveedit/:id", async (req, res) => {
    try {
      let { id } = req.params;
      let { edittext } = req.body;
      let compel = await tasks.findByIdAndUpdate(id, {task:edittext}, { new: true });
      if (compel) {
        res.json({ success: true, message: "Updated Task Successfully" });
      } else {
        res.status(404).json({ success: false, message: "Task not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  

app.listen(3000, () => {
  console.log("Server is running");
});
