import React, { useEffect, useState } from "react";
import axios from "axios";
import { addDataUrlPrefix } from "../utils/ImageUtils"; // Ensure correct path
import { Dog } from "../models/Dog";
import "../GetAllPage.css";
import { useNavigate } from "react-router-dom";
import { useShelter } from "../utils/ShelterContext";
import CsvUploader from "../utils/CSVUploader";
import { getRolesFromToken } from "../utils/Auth";
import { Trash2 } from "lucide-react";
import { fetchShelterDetails } from "../utils/ShelterUtils";

const DogsPage: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>([]); // ✅ Ensure `dogs` is an array
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { selectedShelterId } = useShelter();
  const navigate = useNavigate();
  const userRoles = getRolesFromToken();
  const token = localStorage.getItem("token");
  const [userShelterId, setUserShelterId] = useState<number | null>(null);

  const fetchDogs = () => {
    if (!selectedShelterId) {
      navigate("/shelters");
      return;
    }
    axios
      .get(`http://localhost:8005/dogs/myDogs/${selectedShelterId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Include authentication token
        },
      })
      .then(async (response) => {
        console.log("API Response:", response.data); // ✅ Debugging log
        setDogs(Array.isArray(response.data) ? response.data : []); // ✅ Ensure `dogs` is always an array
        setLoading(false);
        const shelterData = await fetchShelterDetails(token);
        if (shelterData) {
          setUserShelterId(shelterData.id);
        }
        console.log(userShelterId);
      })
      .catch(async (error) => {
        console.error("Error fetching dogs:", error);
        if (error.response && error.response.status === 403) {
          setError("Access denied: You do not have permission.");
          navigate("/"); // Redirect unauthorized users
        } else {
          setError("Failed to load dogs.");
        }
        setDogs([]); // ✅ Set an empty array on error
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchDogs();
  }, [selectedShelterId, navigate]);

  const handleDelete = async (dogId: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication error: Please log in.");
      return;
    }

    try {
      await axios.delete(`http://localhost:8005/dogs/delete/${dogId}/${selectedShelterId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDogs((prevDogs) => prevDogs.filter((dog) => dog.id !== dogId));
    } catch (error) {
      console.error("Error deleting dog:", error);
      setError("Failed to delete dog. Please try again.");
    }
  };


  const filterDogs = Array.isArray(dogs)
    ? dogs.filter((dog) =>
      dog.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  const handleDogClick = (dogId: number) => {
    navigate(`/dogProfile/${dogId}`);
  };

  if (loading) return <p>Loading dogs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="shelter-page">
      <div className="sidebar">
        <button className="back-button" onClick={() => navigate("/shelters")}>
          ←
        </button>
      </div>

      <div>
        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search dogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* ✅ CSV Upload Section */}
        {(userRoles.includes("ROLE_ADMIN") && (userShelterId == selectedShelterId)) && (
          <div className="upload">
            <CsvUploader onSuccessUpl={fetchDogs} />
          </div>
        )}
      </div>

      {/*  Grid */}
      <div className="shelter-grid">
        {filterDogs.length > 0 ? (
          filterDogs.map((dog) => {
            const imageType: "png" | "jpeg" = dog.image.includes("/9j/")
              ? "jpeg"
              : "png";
            const imageSrc = dog.image
              ? addDataUrlPrefix(dog.image, imageType)
              : null;

            return (
              <div key={dog.id} className="shelter-card" >
                {imageSrc && (
                  <img key={dog.id} src={imageSrc} alt={dog.name} className="shelter-image" onClick={() => handleDogClick(dog.id)} />
                )}
                <h3>{dog.name}</h3>
                <p>Breed: {dog.breed}</p>
                {(userRoles.includes("ROLE_ADMIN") && (userShelterId == selectedShelterId)) && (
                  <button
                    onClick={() => handleDelete(dog.id)}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: "3px",
                      display: "flex",
                      marginLeft: "110px"
                    }}
                  >
                    <Trash2 size={18} color="#C59E7B" /> {/* ✅ Mini Trash Bin Icon */}
                  </button>)}
              </div>
            );
          })
        ) : (
          <p>No dogs found</p>
        )}
      </div>

    </div>
  );
};

export default DogsPage;
