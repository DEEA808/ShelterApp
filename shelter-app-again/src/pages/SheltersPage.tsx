import React, { useEffect, useState } from "react";
import axios from "axios";
import { Shelter } from "../models/Shelter";
import { addDataUrlPrefix } from "../utils/ImageUtils";
import "../GetAllPage.css";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";
import { useShelter } from "../utils/ShelterContext";
import { getRolesFromToken } from "../utils/Auth";
import logo from "../assets/app_logo-removebg.png"
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";


const SheltersPage: React.FC = () => {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();
  const userRoles = getRolesFromToken();
  const [myShelter, setMyShelter] = useState<Shelter | null>(null);
  const [filterType, setFilterType] = useState<string>("All");
  const [filterLocation, setFilterLocation] = useState<string>("");
  const { selectedShelterId, setSelectedShelterId } = useShelter();

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

  const filteredByType = filteredShelters.filter((shelter) =>
    filterType === "All" || shelter.type.toLowerCase() === filterType.toLowerCase()
  );

  const filterByLocation = filteredByType.filter((shelter) =>
    (shelter.city ?? "").toLowerCase().includes(filterLocation.toLowerCase())
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication error: Please log in.");
      return;
    }

    axios
      .get("http://localhost:8005/shelters/mine", { headers: { Authorization: `Bearer ${token}` } }) // Added token in headers
      .then((response) => {
        setMyShelter(response.data);
      })
      .catch((error) => {
        console.error("Error checking your shelter: ", error);
        setError("Checking your shelter failed");
      });
  }, []);


  const handleShelterClick = (shelterId: number) => {
    setSelectedShelterId(shelterId);
    navigate(`/shelterDetails/${shelterId}`);
  };

  const handleShelterImageClick = (shelterId: number) => {
    setSelectedShelterId(shelterId);
    navigate("/dogs");
  };

  const handleAddButtonClick = () => {
    navigate("/addShelter");
  };

  const handleForwardClick = () => {
    navigate("/appointments");
  }

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterType(event.target.value);
  };


  if (loading) return <p>Loading shelters...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="shelter-page">
      <div className="sidebar">
        <button className="back-button" onClick={() => navigate("/login")}>←</button>
        <img src={logo} className="logo" alt="Logo" />
        <div className="logout-button"><Logout /></div>
        {(userRoles.includes("ROLE_ADMIN") && (!myShelter || Object.keys(myShelter).length === 0)) && (<button className="add-button" onClick={handleAddButtonClick}>Add your shelter</button>)}
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

        <input
          type="text"
          className="search-location"
          placeholder="Filter by location..."
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <FormControl sx={{ width: 180, marginLeft: 5, marginTop: "6px" }} size="small">
          <Select
            displayEmpty
            value={filterType}
            onChange={handleFilterChange}
            inputProps={{ 'aria-label': 'Type' }}
            sx={{
              height: 30,
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "gray" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "orange" },
            }}
            renderValue={(selected) => {
              if (!selected || selected === "All") {
                return <span style={{ color: "black" }}>Type</span>; // 👈 custom placeholder color
              }
              return selected;
            }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Shelter">Shelter</MenuItem>
            <MenuItem value="Kennel">Kennel</MenuItem>
          </Select>
        </FormControl>



      </div>

      {/* Shelter Grid */}
      <div className="shelter-grid">
        {filterByLocation.length > 0 ? (
          filterByLocation.map((shelter) => {
            const imageType: "png" | "jpeg" = shelter.image.includes("/9j/") ? "jpeg" : "png";
            const imageSrc = shelter.image ? addDataUrlPrefix(shelter.image, imageType) : null;

            return (
              <div
                key={shelter.id}
                className="shelter-card"
                style={{ cursor: "pointer" }}
              >
                {imageSrc && <img key={shelter.id} src={imageSrc} alt={shelter.name} className="shelter-image" onClick={() => handleShelterImageClick(shelter.id)} />}
                <h3 onClick={() => handleShelterClick(shelter.id)}>{shelter.name}</h3>
                <h5>{shelter.type}</h5>
                <p>Available Dogs: {shelter.availableDogs}</p>
              </div>
            );
          })
        ) : (
          <p>No shelters found</p>
        )}
      </div>

      <div className="header-container">
        <h1>
          <span className="word">My</span>
          <span className="word">Appointments</span>
        </h1>
        <button className="forward-button" onClick={handleForwardClick}>→</button>
      </div>
    </div>
  );
};

export default SheltersPage;
