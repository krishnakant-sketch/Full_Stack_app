import React, { useState } from "react";
import { useEffect } from "react";
import "../CSS/Form.css";

function Form() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    investmentAmount: "",
    tenure: "",
    plan: "",
  });
  const [results, setResults] = useState(null);

  const calculateResults = (data) => {
    const amount = parseInt(data.investmentAmount);
    const tenure = parseInt(data.tenure);

    const intrest = 0.085;
    if (data.plan === "Standard") intrest = 0.12;
    if (data.plan === "Premium") intrest = 0.15;
    const profit = amount * intrest * tenure;
    const finalAmount = amount + profit;
    return { profit: profit.toFixed(2), finalAmount: finalAmount.toFixed(2) };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    localStorage.setItem("InvestmentFormData", JSON.stringify(formData));
    console.log("Form data saved to local storage.");

    const calcresults = calculateResults(formData);
    setResults(calcresults);
    setFormData({
      name: "",
      email: "",
      investmentAmount: "",
      tenure: "",
    });
    // Here you can add code to send formData to your server or API
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Investment Amount:</label>
          <input
            type="number"
            name="investmentAmount"
            value={formData.investmentAmount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Tenure :</label>
          <input
            type="text"
            name="tenure"
            placeholder="In years"
            value={formData.tenure}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Select a plan </label>
          <select
            name="plan"
            value={formData.plan}
            onChange={handleChange}
            required
          >
            <option value="">--Select a plan--</option>
            <option value="Basic">Plan A</option>
            <option value="Standard">Plan B</option>
            <option value="Premium">Plan C</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
      {results && (
        <div>
          <h2>Results :</h2>
          <p className="form">
            Here is the Investment Plan which will give you highest returns!
          </p>
          <p className="form">Profit: {results.profit}</p>
          <p>Final Amount: {results.finalAmount}</p>
        </div>
      )}
    </div>
  );
}

export default Form;
