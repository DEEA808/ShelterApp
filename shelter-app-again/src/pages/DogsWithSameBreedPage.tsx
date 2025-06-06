import React, { useEffect, useState } from "react";
import axios from "axios";
import { addDataUrlPrefix } from "../utils/ImageUtils"; // Ensure correct path
import { Dog } from "../models/Dog";
import "../GetAllPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useShelter } from "../utils/ShelterContext";
import logo from "../assets/app_logo-removebg.png"
import { fetchShelterDetails } from "../utils/ShelterUtils";
import { MenuItem, Select, FormControl, SelectChangeEvent } from "@mui/material";
import { useTranslation } from "react-i18next";
import StarIcon from '@mui/icons-material/Star';

const DogsWithSameBreedPage: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { selectedShelterId } = useShelter();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userShelterId, setUserShelterId] = useState<number | null>(null);
  const { breedName } = useParams<{ breedName: string }>();
  const [filterType, setFilterType] = useState<string>("All");
  const [filterColor, setFilterColor] = useState<string>("");
  const [filterLocation, setFilterLocation] = useState<string>("");
  const { t } = useTranslation();
  const [favoriteDogIds, setFavoriteDogIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) return;

      try {
        const res = await axios.get(`http://localhost:8005/users/favorites/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const ids = res.data.map((dog: Dog) => dog.id);
        setFavoriteDogIds(ids);
      } catch (e) {
        console.error("Could not fetch favorites", e);
      }
    };

    fetchFavorites();
  }, []);

  // Toggle favorite handler:
  const toggleFavorite = async (dogId: number) => {
    if (!token) return;

    const isFav = favoriteDogIds.includes(dogId);
    try {
      if (isFav) {
        await axios.delete(`http://localhost:8005/users/favorites/delete/${dogId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavoriteDogIds(prev => prev.filter(id => id !== dogId));
      } else {
        await axios.post(`http://localhost:8005/users/favorites/add/${dogId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavoriteDogIds(prev => [...prev, dogId]);
      }
    } catch (e) {
      console.error("Error toggling favorite", e);
    }
  };


  const fetchDogs = () => {
    if (!selectedShelterId) {
      navigate("/shelters");
      return;
    }
    axios
      .get(`http://localhost:8005/dogs/byBreed/${breedName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (response) => {
        console.log("API Response:", response.data);
        setDogs(Array.isArray(response.data) ? response.data : []);
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
          navigate("/");
        } else {
          setError("Failed to load dogs.");
        }
        setDogs([]);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchDogs();
  }, [selectedShelterId, navigate]);


  const handleForwardClick = () => {
    navigate("/appointments");
  }

  const filterDogs = Array.isArray(dogs)
    ? dogs.filter((dog) =>
      dog.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  const filteredByType = filterDogs
    .filter((dog) => {
      if (filterType === "Puppy") return dog.age <= 1;
      if (filterType === "Adult") return dog.age > 1;
      return true;
    })
    .filter((dog) =>
      (dog.color ?? "").toLowerCase().includes(filterColor.toLowerCase())
    )

    .filter((dog) =>
      (dog.shelterCity ?? "").toLowerCase().includes(filterLocation.toLowerCase())
    );

  const handleDogClick = (dogId: number) => {
    navigate(`/dogProfile/${dogId}`);
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterType(event.target.value);
  };


  if (loading) return <p>Loading dogs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="shelter-page">
      <div className="sidebar">
        <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
          <button className="back-button" onClick={() => navigate(-1)}>←</button>
        </div>
        <img src={logo} className="logo" alt="Logo" />
      </div>

      <div>
        {/* Search Bar */}
        <div className="search-container-b">
          <input
            type="text"
            className="search-bar-b"
            placeholder={t("dogProfile.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="text"
            className="search-color"
            placeholder={t("dogProfile.colorSearch")}
            value={filterColor}
            onChange={(e) => setFilterColor(e.target.value)}
            style={{ marginLeft: "10px" }}
          />

          <input
            type="text"
            className="search-location"
            placeholder={t("shelterPage.locationPlaceholder")}
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            style={{ marginLeft: "10px", width: "40" }}
          />

          <FormControl sx={{ width: 250, marginLeft: 2, marginTop: "7px" }} size="small">
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
                  return <span style={{ color: "black" }}>{t("dogProfile.filterAge")}</span>; // 👈 custom placeholder color
                }
                return selected;
              }}
            >
              <MenuItem value="All">{t("shelterPage.filterAll")}</MenuItem>
              <MenuItem value="Puppy">{t("dogProfile.puppy")}</MenuItem>
              <MenuItem value="Adult">{t("dogProfile.adult")}</MenuItem>
            </Select>
          </FormControl>
        </div>
        <StarIcon
          onClick={() => navigate("/favorites")}
          sx={{
            position: "absolute",
            top: 64, // adjust as needed
            right: 920,
            cursor: "pointer",
            color: "gold",
            fontSize: 30,
            zIndex: 3
          }}
        />
        <button className="back-to-main-page" onClick={() => navigate("/shelters")}>
          ← {t("dogProfile.back")}
        </button>
      </div>

      {/*  Grid */}
      <div className="shelter-grid">
        {filteredByType.length > 0 ? (
          filteredByType.map((dog) => {
            const imageType: "png" | "jpeg" = dog.image1.includes("/9j/")
              ? "jpeg"
              : "png";
            const imageSrc = dog.image1
              ? addDataUrlPrefix(dog.image1, imageType)
              : null;

            return (
              <div key={dog.id} className="shelter-card" >
                <StarIcon
                  onClick={(e) => {
                    e.stopPropagation(); // prevent triggering handleDogClick
                    toggleFavorite(dog.id);
                  }}
                  sx={{
                    position: "absolute",
                    marginTop: "-230px",
                    marginLeft: "128px",
                    cursor: "pointer",
                    color: favoriteDogIds.includes(dog.id) ? "gold" : "lightgray",
                    fontSize: 23,
                    zIndex: 2
                  }}
                />
                {imageSrc && (
                  <img key={dog.id} src={imageSrc} alt={dog.name} className="shelter-image" onClick={() => handleDogClick(dog.id)} />
                )}
                <h3>{dog.name}</h3>
                <p>{dog.breed}</p>
              </div>
            );
          })
        ) : (
          <p>{t("dogProfile.noDogs")}</p>
        )}
      </div>
      <div className="header-container">
        <h1>
          <span className="word">{t("shelterPage.myAppointments").split(" ")[0]}</span>
          <span className="word">{t("shelterPage.myAppointments").split(" ")[1]}</span>
        </h1>
        <button className="forward-button" onClick={handleForwardClick}>→</button>
      </div>
    </div>
  );
};

export default DogsWithSameBreedPage;
