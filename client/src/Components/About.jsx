import React from "react";
import "../CSS/About.css";
import { Link } from "react-router-dom";

function About(){
    return(
        <div className="About-container">
            <img src="./Team_img.jpg" width="250px" height="150px" alt="About-Us"/>
            <h4>Our Success</h4>
            <h2 id="values">Delivered Clients</h2>
            <p>10K</p>
            <h2 id="values">Satisfied Clients</h2>
            <p>15K</p>
            <h2 id="values">Years of Expertise</h2>
            <p>5 Years+</p>

            <h4>Our Vision</h4>
            <p id="vision">
                Our vision is to be the leading financial advisory firm that helps clients navigate complex markets and achieve long-term wealth growth.
            </p>
            <Link to="/dashboard">Back to Dashboard</Link>
        </div>
    );
}
export default About;