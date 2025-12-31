import React from "react";
import "../CSS/About.css";

function About(){
    return(
        <div className="About-container">
            <h4>About Us</h4>
            <p>This is about the company.</p>
            <img src="./About_us.jpg" width="250px" height="150px" alt="About-Us"/>
        </div>
    );
}
export default About;