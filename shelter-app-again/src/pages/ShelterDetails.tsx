import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../Profile.css";
import { addDataUrlPrefix } from "../utils/ImageUtils";
import { getRolesFromToken } from "../utils/Auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { fetchShelterDetails } from "../utils/ShelterUtils";
import { useShelter } from "../utils/ShelterContext";
import { Shelter } from "../models/Shelter";
import EditWindowShelter from "./EditWindowShelter";

const ShelterDetails: React.FC = () => {
    const { shelterId } = useParams<{ shelterId: string }>();
    const [shelter, setShelter] = useState<Shelter | null>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userRoles = getRolesFromToken();
    const [isEditing, setIsEditing] = useState(false);
    const [userShelterId, setUserShelterId] = useState<number | null>(null);
    const { selectedShelterId, setSelectedShelterId } = useShelter();

    const fetchShelter = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Authentication error: Please log in.");
            return;
        }
        try {
            const response = await axios.get(`http://localhost:8005/shelters/getById/${shelterId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

            setShelter(response.data);

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
        fetchShelter();
    }, [shelterId, navigate]);

    const handleDelete = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Authentication error: Please log in.");
            return;
        }

        try {
            await axios.delete(`http://localhost:8005/shelters/delete/${selectedShelterId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            navigate("/shelters");
        } catch (error) {
            console.error("Error deleting dog:", error);
            setError("Failed to delete dog. Please try again.");
        }
    };

    const imageType: "png" | "jpeg" = shelter?.image?.includes("/9j/") ? "jpeg" : "png";
    const imageSrc = shelter?.image ? addDataUrlPrefix(shelter.image, imageType) : null;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!shelter) return <p>No dog found.</p>;

    return (
        <div className={`profile-page ${isEditing ? "blurred" : ""}`}>
            {isEditing && shelter && <EditWindowShelter shelter={shelter} onClose={() => { setIsEditing(false), fetchShelter() }} />}

            <button onClick={() => navigate("/shelters")} className="back-button">←</button>

            <div>
                {(userRoles.includes("ROLE_ADMIN") && (userShelterId == selectedShelterId)) && (
                    <button className="edit-button" onClick={() => setIsEditing(true)}>
                        <FontAwesomeIcon icon={faEdit} className="edit-icon" />
                    </button>
                )}
            </div>

            {!isEditing && <div className="image-container">
                {imageSrc ? (
                    <img src={imageSrc} alt={shelter.name} className="profile-image" />
                ) : (
                    <p>No image available</p>
                )}
            </div>}

            <ul className="profile-info-list">
                <li><strong>Name:</strong> {shelter.name}</li>
                <li><strong>Description:</strong> {shelter.description}</li>
                <li><strong>Address:</strong> {shelter.address}</li>
                <li><strong>The total number of dogs:</strong> {shelter.totalNbOfDogs}</li>
                <li><strong>The number of available dogs:</strong> {shelter.availableDogs}</li>
                <li><strong>Phone number:</strong> {shelter.phoneNumber}</li>
                <li><strong>Email:</strong> {shelter.email}</li>
            </ul>

            <div>
                {(userRoles.includes("ROLE_ADMIN") && (userShelterId == selectedShelterId)) && (<button className="delete-button" onClick={handleDelete}>Delete</button>)}
            </div>
        </div>
    );
};

export default ShelterDetails;
