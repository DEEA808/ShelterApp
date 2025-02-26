import React, { useEffect, useState } from "react";
import axios from "axios";
import { Shelter } from "../models/Shelter";
import { addDataUrlPrefix } from "../utils/ImageUtils";
import "../GetAllPage.css";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";
import { useShelter } from "../utils/ShelterContext"; // ✅ Import useShelter
import { MoveRight } from "lucide-react";

const SheltersPage: React.FC = () => {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();
  
  const { selectedShelterId, setSelectedShelterId } = useShelter(); // ✅ Get functions from context

  useEffect(() => {
    axios
      .get("http://localhost:8005/shelters/all")
      .then((response) => {
        setShelters(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching shelters:", error);
        setError("Failed to load shelters");
        setLoading(false);
      });
  }, []);

  const filteredShelters = shelters.filter((shelter) =>
    shelter.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShelterClick = (shelterId: number) => {
    setSelectedShelterId(shelterId); // ✅ Save shelter ID globally
    navigate("/dogs"); // ✅ Redirect to /dogs
  };

  if (loading) return <p>Loading shelters...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="shelter-page">
      <div className="sidebar">
        <button className="back-button" onClick={() => navigate("/login")}>←</button>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search shelters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Shelter Grid */}
      <div className="shelter-grid">
        {filteredShelters.length > 0 ? (
          filteredShelters.map((shelter) => {
            const imageType: "png" | "jpeg" = shelter.image.includes("/9j/") ? "jpeg" : "png";
            const imageSrc = shelter.image ? addDataUrlPrefix(shelter.image, imageType) : null;

            return (
              <div
                key={shelter.id}
                className="shelter-card"
                onClick={() => handleShelterClick(shelter.id)} // ✅ Handle click
                style={{ cursor: "pointer" }} // Add cursor pointer for UX
              >
                {imageSrc && <img src={imageSrc} alt={shelter.name} className="shelter-image" />}
                <h3>{shelter.name}</h3>
                <p>Available Dogs: {shelter.availableDogs}</p>
              </div>
            );
          })
        ) : (
          <p>No shelters found</p>
        )}
      </div>
      <div style={{marginRight:"10px",marginTop:"20px",position:"relative", textAlign: "center", padding: "20px" }}><Logout /></div>
    </div>
  );
};

export default SheltersPage;
