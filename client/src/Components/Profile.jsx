import React from "react";
import "../CSS/Profile.css";
import axios from "axios";
import { useEffect } from "react";




function Profile() {
  const [image, setImage] = React.useState(null);
  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get("http://localhost:4000/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setImage(res.data.profileImage);
      });
  }, [token]);
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setImage(base64Image);
        axios.post(
          "http://localhost:4000/profile",
          { image: base64Image },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      };
      reader.readAsDataURL(file);
    }
  };

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     setImage(URL.createObjectURL(file));
//   };
  return (
    <div className="profile-container">
      <h4>User Profile</h4>
      {image ? (
        <img
          src={image}
          alt="Profile"
          style={{ width: "150px", borderRadius: "50%" }}
        />
      ) : (
        <p>No profile image uploaded</p>
      )}
      <input type="file" accept="image/*" onChange={handleImageUpload} />
    </div>
  );
}

export default Profile;
