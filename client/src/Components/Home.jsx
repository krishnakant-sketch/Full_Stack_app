import React from "react";
import "../CSS/Home.css";

import { jsPDF } from "jspdf";

function downloadPDF() {
  const doc = new jsPDF();
  doc.text("Hello Krishnakant!", 10, 10);
  doc.save("example.pdf");
}


function Home() {
  return (
    <div className="home-container">
      <h3>Welcome to the Home Section</h3>
      <p>This is the home section of the dashboard.</p>
      <button onClick={downloadPDF}>Download PDF</button>
    </div>
  );
}

export default Home;