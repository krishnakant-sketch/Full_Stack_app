import React from "react";
import "../CSS/Profile.css";
import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import profile from "../../src/Assets/Profilepic.jpg";




function Profile() {
  const [image, setImage] = React.useState(null);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");

  const data= localStorage.getItem("InvestmentFormData");
  useEffect(() => {
    if (data) {
      const parsedData = JSON.parse(data);
      setName(parsedData.name);
      setEmail(parsedData.email);
    }
  }, [data]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get("http://localhost:4000/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setImage(res.data.profileImage);
      });
  }, [token]);
  // const handleImageUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const base64Image = reader.result;
  //       setImage(base64Image);
  //       axios.post(
  //         "http://localhost:4000/profile",
  //         { image: base64Image },
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     setImage(URL.createObjectURL(file));
//   };
  return (
    <div className="profile-background">
      <div className="profile-content">
      {/* {image ? (
        <img
          src={image}
          alt="Profile"
          // style={{ width: "150px", borderRadius: "50%" }}
        />
      ) : (
        <p>No profile image uploaded</p>
      )}
      <input type="file" accept="image/*" onChange={handleImageUpload} /> */}
      <img src={profile} alt="Profile" />
      <h3>Name: {name}</h3>
      <h3>Email: {email}</h3>
      <Link to="/dashboard" style={{color:"black", fontWeight:"bold", padding:"10px"}}>Back to Dashboard</Link>
            </div>
    </div>
  );
}

export default Profile;
