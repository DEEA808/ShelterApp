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
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

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
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
            setError("Failed to fetch shelter");
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
            console.error("Error deleting shelter:", error);
            setError("Failed to delete shelter. Please try again.");
        }
    };

    const handleForwardClickToShelterApp = () => {
        navigate("/shelterAppointments");
    }

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

            {!(isEditing) && <ul className="profile-info-list">
                <li><strong>Name:</strong> {shelter.name}</li>
                <li><strong>Type:</strong> {shelter.type}</li>
                <li><strong>Description:</strong> {shelter.description}</li>
                <li><strong>Address:</strong> {shelter.address}</li>
                <li><strong>City:</strong> {shelter.city}</li>
                <li><strong>The number of available dogs:</strong> {shelter.availableDogs}</li>
                <li><strong>Phone number:</strong> {shelter.phoneNumber}</li>
                <li><strong>Email:</strong> {shelter.email}</li>
            </ul>}

            <div>
                {(!(isEditing) && userRoles.includes("ROLE_ADMIN") && (userShelterId == selectedShelterId)) && (<Button
                    variant="contained"
                    color="error"
                    onClick={() => setShowDeleteDialog(true)}
                    sx={{
                        position: "absolute",
                        display: "flex",
                        marginRight: "80px",
                        marginLeft: "620px",
                        marginTop: "700px",
                        width: "90px",
                        height: "40px",
                        backgroundColor: "#d52d2d",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "16px",
                        fontWeight: "bold",
                        textTransform: "none",
                        '&:hover': {
                            backgroundColor: "#b22222",
                        },
                    }}

                >
                    Delete
                </Button>
                )}
            </div>
            <Dialog
                open={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this shelter? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDeleteDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        setShowDeleteDialog(false);
                        handleDelete();
                    }} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {(!(isEditing) && userRoles.includes("ROLE_ADMIN") && (userShelterId == selectedShelterId)) && (<div className="header-container-sh">
                <h1>
                    <span className="word">Shelter's</span>
                    <span className="word">Appointments</span>
                </h1>
                <button className="forward-button-sh" onClick={handleForwardClickToShelterApp}>→</button>
            </div>)}

        </div>
    );
};

export default ShelterDetails;
