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
import logo from "../assets/app_logo-removebg.png"
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box, Typography } from "@mui/material";
import LanguageSwitcher from "../utils/LanguageSwitcher";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();

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

    const imageType: "png" | "jpeg" = shelter?.image1?.includes("/9j/") ? "jpeg" : "png";
    const imageSrc1 = shelter?.image1 ? addDataUrlPrefix(shelter.image1, imageType) : null;
    const imageSrc2 = shelter?.image2 ? addDataUrlPrefix(shelter.image2, imageType) : null;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!shelter) return <p>No dog found.</p>;
    return (
        <Box sx={{ p: 3, backgroundColor: "#F8F2EA", minHeight: "100vh", position: "relative" }}>
            {isEditing && shelter && (
                <EditWindowShelter shelter={shelter} onClose={() => { setIsEditing(false); fetchShelter(); }} />
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginLeft: "-20px", marginTop: "-30px", mb: 1 }}>
                {/* Back Button */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Button onClick={() => navigate(-1)} sx={{ fontSize: 18, color: "black", fontWeight: "bold" }}>
                                        ←
                                    </Button>
                                </Box>
                {/* Edit Icon for Admin */}
                {(userRoles.includes("ROLE_ADMIN") && (userShelterId === selectedShelterId)) && (
                    <Button onClick={() => setIsEditing(true)} sx={{ color: "black", marginTop: "10px", marginRight: "-14px" }}>
                        <FontAwesomeIcon icon={faEdit} style={{ fontSize: 24 }} />
                    </Button>
                )}
            </Box>


            {/* Appointments Section */}
            {(userRoles.includes("ROLE_ADMIN") && userShelterId === selectedShelterId) && (
                <div className="header-container-sh">
                    <h1>
                        <span style={{fontSize:20}}>My </span>
                        <span style={{fontSize:20}}>Appointments</span>
                    </h1>
                    <button className="forward-button-sh" onClick={handleForwardClickToShelterApp}>→</button>
                </div>
            )}
            {!isEditing && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginLeft: "14px" }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ fontSize: 29 }} >
                        {shelter.name?.toUpperCase()}
                    </Typography>
                    <Box onClick={() => navigate("/shelters")} component="img" src={logo} alt="logo" sx={{ width: 60, height: 60 }} />
                </Box>)}

            {/* Info Section */}
            {!isEditing && (
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 6, marginTop: "-5px" }}>
                    <ul style={{ listStyle: "disc", paddingLeft: "1.5em", fontSize: "1.5rem", lineHeight: 2 }}>
                        <li style={{ marginBottom: "16px" }}><strong>Type:</strong> {shelter.type}</li>
                        <li style={{ marginBottom: "16px" }}><strong>Address:</strong> {shelter.address}</li>
                        <li style={{ marginBottom: "16px" }}><strong>City:</strong> {shelter.city}</li>
                        <li style={{ marginBottom: "16px" }}><strong>Available Dogs:</strong> {shelter.availableDogs}</li>
                        <li style={{ marginBottom: "16px" }}><strong>Phone:</strong> {shelter.phoneNumber}</li>
                        <li style={{ marginBottom: "16px" }}><strong>Email:</strong> {shelter.email}</li>
                    </ul>
                </Box>
            )}

            {/* Image Section */}
            {!isEditing && (
                <Box sx={{ marginLeft: "860px", marginTop: "-455px", display: "flex", flexDirection: "column", gap: 2, alignItems: "center", flex: 1 }}>
                    {[imageSrc1, imageSrc2].map((src, index) => (
                        src ? (
                            <Box
                                key={index}
                                component="img"
                                src={src}
                                sx={{
                                    width: 500,
                                    //maxWidth: 500,
                                    height: 250,
                                    objectFit: "cover",
                                    borderRadius: 2,
                                    boxShadow: 3
                                }}
                            />
                        ) : (
                            <Box
                                key={index}
                                sx={{
                                    width: 500,
                                    //maxWidth: 500,
                                    height: 250, // match the height of real images
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    backgroundColor: "#e0e0e0", // light gray (good contrast with cream page)
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontStyle: "italic",
                                    color: "#555", // darker text for readability
                                    border: "1px solid #ccc" // optional for subtle framing
                                }}
                            >
                                No image
                            </Box>

                        )
                    ))}
                </Box>
            )}

            {/* Delete Button */}
            {(userRoles.includes("ROLE_ADMIN") && userShelterId === selectedShelterId) && (
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => setShowDeleteDialog(true)}
                    sx={{
                        position: "absolute",
                        marginRight: "80px",
                        marginLeft: "1270px",
                        marginTop: "55px",
                        width: "90px",
                        height: "40px",
                        backgroundColor: "#d52d2d",
                        color: "white",
                        borderRadius: "5px",
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

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
                <DialogTitle>Confirm deletion</DialogTitle>
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
        </Box>
    );


};

export default ShelterDetails;
