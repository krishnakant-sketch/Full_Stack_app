import React from "react";

export default function PayButton() {
  const createOrder = async (amountPaise) => {
    const res = await fetch("http://localhost:4000/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amountPaise }),
    });
    return res.json();
  };

  const handlePay = async () => {
    const order = await createOrder(50000); // ₹500.00
    const options = {
      key: "rzp_test_yourKeyId",
      amount: order.amount,
      currency: order.currency,
      name: "Your App",
      description: "Test Transaction",
      order_id: order.id,
      handler: function (response) {
        // Razorpay will capture payment server-side if payment_capture=1
        // Webhook will notify backend → DB → WebSocket → React updates
        console.log("Payment handler response:", response);
      },
      prefill: { email: "test@example.com", contact: "9999999999" },
      theme: { color: "#F37254" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return <button onClick={handlePay}>Pay ₹500</button>;
}
