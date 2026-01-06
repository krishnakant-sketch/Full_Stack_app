const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const app = express();
const http = require("http");
app.use(express.json());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://krishnakant_db_user:<password>@cluster0.ttpqlds.mongodb.net/mernAuth?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User model
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  profileImage: String,
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

app.use(cors());
// Upload or update profile image
// app.post("/profile", async (req, res) => {
//   const { image } = req.body; // Base64 string or URL
//   try {
//     const user = await User.findByIdAndUpdate(
//       req.user.id,
//       { profileImage: image },
//       { new: true }
//     );
//     res.json({ message: "Profile image updated", profileImage: user.profileImage });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update profile image" });
//   }
// });

const multer = require("multer");
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5 MB

app.post("/profile", upload.single("image"), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: req.file.path }, // store file path or URL
      { new: true }
    );
    res.json({
      message: "Profile image updated",
      profileImage: user.profileImage,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile image" });
  }
});

// app.get("/profile", async (req, res) => {
//   try {
//     console.log("Fetching profile for user:", req.user.id);
//     res.json({ profileImage: "http://localhost:4000/path/to/default/image.jpg" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch profile image" });
//   }
// });

app.get("/profile", authMiddleware, async (req, res) => {
  try {
    console.log("Fetching profile for user:", req.user.id);
    res.json({
      profileImage: "http://localhost:4000/path/to/default/image.jpg",
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile image" });
  }
});

// make sure to install: npm install node-fetch

// app.get("/gold", async (req, res) => {
//   try {
//     const response = await fetch("https://www.goldapi.io/api/XAU/INR", {
//       method: "GET",
//       headers: {
//         "x-access-token": "goldapi-abtui9smk0tevn1-io", // your API key
//         "Content-Type": "application/json",
//       },
//     });

//     const data = await response.json();
//     res.json(data); // send gold rate to frontend
//   } catch (error) {
//     console.error("Error fetching gold rate:", error);
//     res.status(500).json({ error: "Failed to fetch gold rate" });
//   }
// });

async function getGoldRate() {
  const response = await fetch("https://www.goldapi.io/api/XAU/INR", {
    method: "GET",
    headers: {
      "x-access-token": "goldapi-abtui9smk0tevn1-io",
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // allow frontend
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id); // Send updates every 60 seconds const
  interval = setInterval(async () => {
    try {
      const data = await getGoldRate();
      socket.emit("goldRateUpdate", data);
    } catch (err) {
      console.error("Error fetching gold rate:", err);
    }
  }, 60000);
  socket.on("disconnect", () => {
    clearInterval(interval);
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(5000, () => console.log("WebSocket server running on port 5000"));

app.listen(4000, () => console.log("Server running on port 4000"));
