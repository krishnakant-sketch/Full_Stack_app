// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Transaction = require("./models/Transaction.js");
const transactionsRoute = require("./routes/transaction.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// JSON for regular routes
app.use(express.json());
app.use(cors());

// IMPORTANT: raw body for webhook signature verification
app.use("/webhook/razorpay", bodyParser.raw({ type: "application/json" }));

// MongoDB connect
mongoose
  .connect(
    "mongodb+srv://krishnakant_db_user:Krishna%4010@cluster0.ttpqlds.mongodb.net/mernAuth?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Razorpay client (use env vars in production)
const razorpay = new Razorpay({
  key_id: "rzp_test_yourKeyId",
  key_secret: "yourKeySecret",
});

// Create an order (frontend calls this, then opens Razorpay Checkout)
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body; // amount in paise (e.g., 50000 = ₹500)
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1,
    });

    // Optionally store a placeholder transaction for tracking
    await Transaction.create({
      orderId: order.id,
      paymentId: null,
      amount: order.amount,
      currency: order.currency,
      status: "created",
    });

    res.json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Razorpay webhook endpoint
app.post("/webhook/razorpay", async (req, res) => {
  const razorpayWebhookSecret = "your_webhook_secret"; // from Razorpay dashboard

  // Verify signature
  const signature = req.headers["x-razorpay-signature"];
  const body = req.body; // raw buffer (bodyParser.raw)
  const expected = crypto
    .createHmac("sha256", razorpayWebhookSecret)
    .update(body)
    .digest("hex");

  if (signature !== expected) {
    console.warn("Webhook signature mismatch");
    return res.status(400).send("Invalid signature");
  }

  // Parse JSON after verification
  const event = JSON.parse(body.toString());

  try {
    // Handle payment captured
    if (event.event === "payment.captured") {
      const p = event.payload.payment.entity;

      const tx = await Transaction.findOneAndUpdate(
        { paymentId: p.id },
        {
          paymentId: p.id,
          orderId: p.order_id,
          amount: p.amount,
          currency: p.currency,
          status: "success",
          method: p.method,
          email: p.email,
          contact: p.contact,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      io.emit("transactionUpdate", tx);
      console.log("Payment success:", p.id);
    }

    // Handle payment failed
    if (event.event === "payment.failed") {
      const p = event.payload.payment.entity;

      const tx = await Transaction.findOneAndUpdate(
        { paymentId: p.id },
        {
          paymentId: p.id,
          orderId: p.order_id,
          amount: p.amount,
          currency: p.currency,
          status: "failed",
          method: p.method,
          email: p.email,
          contact: p.contact,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      io.emit("transactionUpdate", tx);
      console.log("Payment failed:", p.id);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook handling error:", err);
    res.status(500).send("Webhook processing failed");
  }
});

// REST route for initial list
app.use("/transactions", transactionsRoute);

// Socket.IO connection (optional logs)
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

server.listen(8000, () => console.log("Server running on http://localhost:8000"));
