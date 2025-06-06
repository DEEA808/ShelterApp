import React, { useEffect, useState } from 'react';
import axios from "axios";
import { addDataUrlPrefix } from "../utils/ImageUtils"; // Ensure correct path
import { Dog } from "../models/Dog";
import "../GetAllPage.css";
import { useNavigate } from "react-router-dom";
import { useShelter } from "../utils/ShelterContext";
import CsvUploader from "../utils/CSVUploader";
import { getRolesFromToken } from "../utils/Auth";
import { Trash2 } from "lucide-react";
import { fetchShelterById, fetchShelterDetails } from "../utils/ShelterUtils";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, MenuItem, Select, FormControl, SelectChangeEvent } from "@mui/material";
import pawIcon from "../assets/paw.png"
import logo from "../assets/app_logo-removebg.png"
import StarIcon from '@mui/icons-material/Star';

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDogIdToDelete, setSelectedDogIdToDelete] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string>("All");
  const [filterSize, setFilterSize] = useState<string>("All");
  const [selectedShelterType, setSelectedShelterType] = useState<string | null>(null);
  const [selectedShelterDescr, setSelectedShelterDescr] = useState<string | null>(null);
  const [selectedShelterName, setSelectedShelterName] = useState<string | null>(null);
  const [favoriteDogIds, setFavoriteDogIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) return;

      try {
        const res = await axios.get(`http://localhost:8005/users/favorites/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const ids = Array.isArray(res.data) ? res.data : [].map((dog: Dog) => dog.id);
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


  useEffect(() => {
    const fetchType = async () => {
      if (selectedShelterId && token) {
        const res = await fetchShelterById(selectedShelterId, token);
        if (res) {
          setSelectedShelterType(res.type);
          setSelectedShelterDescr(res.description);
          setSelectedShelterName(res.name);
        }
      }
    };
    fetchType();
  }, [selectedShelterId, token]);


  const fetchDogs = () => {
    if (!selectedShelterId) {
      navigate("/shelters");
      return;
    }
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication error: Please log in.");
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
        console.log(shelterData.type);
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

  const handleForwardClick = () => {
    navigate("/appointments");
  }

  const filterDogs = Array.isArray(dogs)
    ? dogs.filter((dog) =>
      dog.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  const filteredByType = filterDogs.filter((dog) => {
    if (filterType === "Puppy") return dog.age < 1;
    if (filterType === "Adult") return dog.age >= 1;
    return true;
  });

  const filterDogsBySize = filteredByType.filter((dog) =>
    filterSize === "All" || (dog.size ?? "").toLowerCase() === filterSize.toLowerCase()
  );

  const handleDogClick = (dogId: number) => {
    navigate(`/dogProfile/${dogId}`);
  };

  const handleAddButtonClickD = () => {
    navigate("/toForm");
  };

  const handleAddDogButtonClick = () => {
    navigate("/addDog");
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterType(event.target.value);
  };

  const handleFilterChangeSize = (event: SelectChangeEvent) => {
    setFilterSize(event.target.value);
  };

  if (loading) return <p>Loading dogs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="shelter-page">
      <div className="sidebar">
        <button className="back-button" onClick={() => navigate("/shelters")}>
          ←
        </button>
        <img src={logo} className="logo" onClick={() => navigate("/shelters")} alt="Logo" />
        {selectedShelterName && (
          <div className="welcome-section" style={{
            padding: "20px",
            marginTop: "200px",
            lineHeight: 1.5,
            backgroundColor: "#e5ceb0",
            borderRadius: "10px",
            fontSize: "14px",
            color: "#333",
          }}>
            <h3 style={{marginLeft:"11px", fontSize: "18px", marginBottom: "5px", color: "#b46052" }}>Welcome!</h3>
            <p style={{ }}>
              {selectedShelterDescr ? selectedShelterDescr : "We're happy to have you here!"}
            </p>
            <p>If you need help:</p>
            <p><strong></strong> 0741 123 456</p>
          </div>
        )}

        <button className="add-button-d" onClick={handleAddButtonClickD}>Find your perfect dog
          <img src={pawIcon} className="paw-icon" alt="Paw Icon" />
        </button>
      </div>

      <div>
        {(userRoles.includes("ROLE_ADMIN") && (userShelterId == selectedShelterId)) && (<button className="add-dog-button" onClick={handleAddDogButtonClick}>Add one dog +</button>)}
        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search dogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <FormControl sx={{ width: 110, marginLeft: 5, marginTop: "7px" }} size="small">
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
                  return <span style={{ color: "black" }}>Age</span>; // 👈 custom placeholder color
                }
                return selected;
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Puppy">Puppy</MenuItem>
              <MenuItem value="Adult">Adult</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ width: 110, marginLeft: 5, marginTop: "7px" }} size="small">
            <Select
              displayEmpty
              value={filterSize}
              onChange={handleFilterChangeSize}
              inputProps={{ 'aria-label': 'Type' }}
              sx={{
                height: 30,
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "gray" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "orange" },
              }}
              renderValue={(selected) => {
                if (!selected || selected === "All") {
                  return <span style={{ color: "black" }}>Size</span>; // 👈 custom placeholder color
                }
                return selected;
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Small">Small</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Large">Large</MenuItem>
            </Select>
          </FormControl>
        </div>
        {(userRoles.includes("ROLE_ADMIN") && (userShelterId == selectedShelterId)) && (
          <StarIcon
            onClick={() => navigate("/favorites")}
            sx={{
              position: "absolute",
              top: 63, // adjust as needed
              right: 946,
              cursor: "pointer",
              color: "gold",
              fontSize: 30,
              zIndex: 3
            }}
          />)}

        {((userShelterId != selectedShelterId)) && (
          <StarIcon
            onClick={() => navigate("/favorites")}
            sx={{
              position: "absolute",
              top: 64, // adjust as needed
              right: 300,
              cursor: "pointer",
              color: "gold",
              fontSize: 30,
              zIndex: 3
            }}
          />)}

        {/* ✅ CSV Upload Section */}
        {(userRoles.includes("ROLE_ADMIN") && (userShelterId == selectedShelterId)) && (
          <div className="upload">
            <CsvUploader onSuccessUpl={fetchDogs} />
          </div>
        )}
      </div>
      {/*  Grid */}
      <div className="shelter-grid">
        {filterDogsBySize.length > 0 ? (
          filterDogsBySize.map((dog) => {
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

                {selectedShelterType === "Shelter" && (
                  <div className="adopt-banner" key={dog.id} onClick={() => handleDogClick(dog.id)}>ADOPT ME!</div>
                )}

                {(userRoles.includes("ROLE_ADMIN") && (userShelterId == selectedShelterId)) && (
                  <button
                    onClick={() => {
                      setSelectedDogIdToDelete(dog.id);
                      setDeleteDialogOpen(true);
                    }}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: "3px",
                      display: "flex",
                      marginLeft: "110px",
                    }}
                  >
                    <Trash2 size={18} color="#C59E7B" />
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <p>No dog found</p>
        )}
      </div>
      <div className="header-container">
        <h1>
          <span className="word">My</span>
          <span className="word">Appointments</span>
        </h1>
        <button className="forward-button" onClick={handleForwardClick}>→</button>
      </div>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this dog? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selectedDogIdToDelete !== null) {
                handleDelete(selectedDogIdToDelete);
              }
              setDeleteDialogOpen(false);
              setSelectedDogIdToDelete(null);
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default DogsPage;
