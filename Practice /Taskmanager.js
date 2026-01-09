const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// const Task_FILE = "tasks.json";

// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next(); // pass control to next middleware
// });


// function readTasks() {
//   if (!fs.existsSync(Task_FILE)) return [];
//   const data = fs.readFileSync(Task_FILE, "utf-8");
//   return JSON.parse(data || "[]");
// }

// const writefile = (data) => {
//   fs.writeFileSync(Task_FILE, JSON.stringify(data, null, 2), "utf-8");
// };

// // Get all tasks
// app.get("/tasks", (req, res) => {
//   const tasks = readTasks();
//   res.send(tasks);
// });

// app.post("/tasks", (req, res) => {
//   const tasks = readTasks();
//   const newTask = {
//     id: Date.now(),
//     text: req.body.text,
//   };
//   tasks.push(newTask);
//   writefile(tasks);
//   res.status(200).send(newTask);
// });

// app.delete("/tasks/:id", (req, res) => {
//   const tasks = readTasks();
//   const _id = req.params.id;
//   const filtertasks = tasks.filter((task) => task.id !== _id);
//   writefile(filtertasks);
//   res.status(200).send({ message: "Task deleted" });
// });

const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://krishnakant_db_user:Krishna%4010@cluster0.ttpqlds.mongodb.net/mernAuth?retryWrites=true&w=majority")
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const { Schema } = mongoose;

const TaskSchema=new Schema({
    text:{type:String,required:true}
})

const Task = mongoose.model("Task", TaskSchema);

app.get('/tasks',async(req,res)=>{
    const tasks=await Task.find();
    res.send(tasks);
})

app.post('/tasks',async(req,res)=>{
    const newTask=new Task({text:req.body.text});
    await newTask.save();
    res.status(200).send(newTask);
})

app.delete('/tasks/:id',async(req,res)=>{
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).send({message:"Task deleted"});
})

app.listen(3001, () => {
  console.log("app running on port 3001");
});
