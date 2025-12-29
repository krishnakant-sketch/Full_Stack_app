const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());



mongoose.connect(
  "mongodb+srv://krishnakant_db_user:Krishna%4010@cluster0.ttpqlds.mongodb.net/mernAuth?retryWrites=true&w=majority"
)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));


// User model
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);

// Register route
const bcrypt = require("bcryptjs");
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });
  await user.save();
  res.json({ message: "User registered successfully" });
});

// Login route
const jwt = require("jsonwebtoken");
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: "1h" });
  res.json({ token });
});

// Middleware to protect routes
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, "secretKey", (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
}

// Protected route
app.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: `Welcome user ${req.user.id}` });
});
console.log("Hello")
app.listen(4000, () => console.log("Server running on port 4000"));
