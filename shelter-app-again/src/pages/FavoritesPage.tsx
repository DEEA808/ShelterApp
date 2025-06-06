import React, { useEffect, useState } from 'react';
import axios from "axios";
import { addDataUrlPrefix } from "../utils/ImageUtils";
import { Dog } from "../models/Dog";
import "../GetAllPage.css";
import { useNavigate } from "react-router-dom";
import { useShelter } from "../utils/ShelterContext";
import { getRolesFromToken } from "../utils/Auth";
import { Trash2 } from "lucide-react";
import { fetchShelterById } from "../utils/ShelterUtils";
import {
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, Button, MenuItem, Select, FormControl, SelectChangeEvent
} from "@mui/material";
import pawIcon from "../assets/paw.png";
import logo from "../assets/app_logo-removebg.png";
import StarIcon from '@mui/icons-material/Star';

const FavoritesPage: React.FC = () => {
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const { selectedShelterId } = useShelter();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [favoriteDogIds, setFavoriteDogIds] = useState<number[]>([]);
    const [filterType, setFilterType] = useState<string>("All");
    const [filterSize, setFilterSize] = useState<string>("All");

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!token) {
                setError("Not authenticated.");
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`http://localhost:8005/users/favorites/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Favorites response:", res.data);
                const ids = res.data.map((dog: Dog) => dog.id);
                setDogs(res.data);
                setFavoriteDogIds(ids);
            } catch (e) {
                console.error("Could not fetch favorites", e);
                setError("Failed to load favorite dogs.");
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [token]);

    const toggleFavorite = async (dogId: number) => {
        if (!token) return;

        try {
            await axios.delete(`http://localhost:8005/users/favorites/delete/${dogId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDogs((prevDogs) => prevDogs.filter((dog) => dog.id !== dogId));
            setFavoriteDogIds(prev => prev.filter(id => id !== dogId));
        } catch (e) {
            console.error("Error removing favorite", e);
        }
    };

    const handleDogClick = (dogId: number) => {
        navigate(`/dogProfile/${dogId}`);
    };

    const handleAddButtonClickD = () => {
        navigate("/toForm");
    };

    const handleFilterChange = (event: SelectChangeEvent) => {
        setFilterType(event.target.value);
    };

    const handleFilterChangeSize = (event: SelectChangeEvent) => {
        setFilterSize(event.target.value);
    };

    const filterDogs = dogs
        .filter((dog) => dog.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter((dog) => {
            if (filterType === "Puppy") return dog.age < 1;
            if (filterType === "Adult") return dog.age >= 1;
            return true;
        })
        .filter((dog) =>
            filterSize === "All" || (dog.size ?? "").toLowerCase() === filterSize.toLowerCase()
        );

    if (loading) return <p>Loading favorite dogs...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="shelter-page">
            <div className="sidebar">
                <button className="back-button" onClick={() => navigate(-1)}>
                    ←
                </button>
                <img src={logo} className="logo" onClick={() => navigate("/shelters")} alt="Logo" />
                <button className="add-button-d" onClick={handleAddButtonClickD}>
                    Find your perfect dog
                    <img src={pawIcon} className="paw-icon" alt="Paw Icon" />
                </button>
            </div>

            <div>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search favorites..."
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
                            renderValue={(selected) => selected === "All" ? <span style={{ color: "black" }}>Age</span> : selected}
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
                            inputProps={{ 'aria-label': 'Size' }}
                            sx={{
                                height: 30,
                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" },
                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "gray" },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "orange" },
                            }}
                            renderValue={(selected) => selected === "All" ? <span style={{ color: "black" }}>Size</span> : selected}
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Small">Small</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Large">Large</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>

            <div className="shelter-grid">
                {filterDogs.length > 0 ? (
                    filterDogs.map((dog) => {
                        const imageType: "png" | "jpeg" = dog.image1?.includes("/9j/") ? "jpeg" : "png";
                        const imageSrc = dog.image1 ? addDataUrlPrefix(dog.image1, imageType) : "";

                        return (
                            <div key={dog.id} className="shelter-card">
                                <StarIcon
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(dog.id);
                                    }}
                                    sx={{
                                        position: "absolute",
                                        marginTop: "-230px",
                                        marginLeft: "128px",
                                        cursor: "pointer",
                                        color: "gold",
                                        fontSize: 23,
                                        zIndex: 2
                                    }}
                                />
                                <img
                                    src={imageSrc}
                                    alt={dog.name}
                                    className="shelter-image"
                                    onClick={() => handleDogClick(dog.id)}
                                />
                                <h3>{dog.name}</h3>
                                <p>{dog.breed}</p>
                            </div>
                        );
                    })
                ) : (
                    <p>No favorite dogs found.</p>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;
