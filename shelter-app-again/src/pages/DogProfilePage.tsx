import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Dog } from "../models/Dog";
import axios from "axios";
import "../Profile.css";
import { addDataUrlPrefix } from "../utils/ImageUtils";
import { getRolesFromToken } from "../utils/Auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import EditWindowDog from "./EditWindowDog"; // Import the EditWindow modal
import AppointmentWindow from "./AppointmentWindow";
import pawIcon from "../assets/paw.png"
import { fetchShelterDetails } from "../utils/ShelterUtils";
import { useShelter } from "../utils/ShelterContext";
import { Button, Typography } from "@mui/material";

const DogProfilePage: React.FC = () => {
    const { dogId } = useParams<{ dogId: string }>();
    const [dog, setDog] = useState<Dog | null>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userRoles = getRolesFromToken();
    const [isEditing, setIsEditing] = useState(false);
    const [gettingAppointment, setGettingAppointment] = useState(false);
    const [userShelterId, setUserShelterId] = useState<number | null>(null);
    const { selectedShelterId, setSelectedShelterId } = useShelter();

    const fetchDog = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Authentication error: Please log in.");
            return;
        }
        try {
            const response = await axios.get(`http://localhost:8005/dogs/getById/${dogId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

            setDog(response.data);

            const shelterData = await fetchShelterDetails(token);
            if (shelterData) {
                setUserShelterId(shelterData.id);
            }
        } catch (err) {
            setError("Failed to fetch dog");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchDog();
    }, [dogId, navigate]);

    const handleForwardClickToFiles = () => {
        navigate(`/files/${dogId}`);
    }

    const imageType: "png" | "jpeg" = dog?.image?.includes("/9j/") ? "jpeg" : "png";
    const imageSrc = dog?.image ? addDataUrlPrefix(dog.image, imageType) : null;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!dog) return <p>No dog found.</p>;

    return (
        <div className={`profile-page ${isEditing ? "blurred" : ""}`}>
            {isEditing && dog && <EditWindowDog dog={dog} onClose={() => { setIsEditing(false), fetchDog() }} />}
            {gettingAppointment && dog && <AppointmentWindow dog={dog} onClose={() => { setGettingAppointment(false), fetchDog() }} />}

            <button onClick={() => navigate(-1)} className="back-button">←</button>

            <div>
                {(userRoles.includes("ROLE_USER") || userRoles.includes("ROLE_ADMIN") && (userShelterId != selectedShelterId)) && (
                    <h4 className="profile-title" onClick={() => setGettingAppointment(true)}>Meet {dog.name}!
                        <img src={pawIcon} className="paw-icon" alt="Paw Icon" />

                    </h4>
                )}

                {(userRoles.includes("ROLE_ADMIN") && (userShelterId == selectedShelterId)) && (
                    <button className="edit-button" onClick={() => setIsEditing(true)}>
                        <FontAwesomeIcon icon={faEdit} className="edit-icon" />
                    </button>
                )}
            </div>

            {!(isEditing || gettingAppointment) && <div className="image-container">
                {imageSrc ? (
                    <img src={imageSrc} alt={dog.name} className="profile-image" />
                ) : (
                    <p>No image available</p>
                )}
            </div>}

            {!(isEditing || gettingAppointment) && <ul className="profile-info-list">
                <li><strong>Breed:</strong> {dog.breed}</li>
                <li><strong>Description:</strong> {dog.description}</li>
                <li><strong>Story:</strong> {dog.story}</li>
                <li><strong>Gender:</strong> {dog.gender}</li>
                <li><strong>Age:</strong> {dog.age} years</li>
                <li><strong>Size:</strong> {dog.size} (adult size)</li>
                <li><strong>Color:</strong> {dog.color}</li>
                <li><strong>Shelter's name:</strong>{dog.shelterName}</li>
                <li><strong>Shelter's city:</strong>{dog.shelterCity}</li>
            </ul>}
           
           <div className="header-container-f">
                <h1>
                    <span className="word">Dog's</span>
                    <span className="word">medical files</span>
                </h1>
                <button className="forward-button-f" onClick={handleForwardClickToFiles}>→</button>
            </div>
        </div>
    );
};

export default DogProfilePage;
