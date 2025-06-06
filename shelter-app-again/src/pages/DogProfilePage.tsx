// ... previous imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useShelter } from "../utils/ShelterContext";
import { getRolesFromToken } from "../utils/Auth";
import { Dog } from "../models/Dog";
import { fetchShelterDetails } from "../utils/ShelterUtils";
import { addDataUrlPrefix } from "../utils/ImageUtils";
import AppointmentWindow from "./AppointmentWindow";
import EditWindowDog from "./EditWindowDog";
import pawIcon from "../assets/paw.png"
import logo from "../assets/app_logo-removebg.png"
import axios from "axios";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import LanguageSwitcher from "../utils/LanguageSwitcher";

const DogProfilePage: React.FC = () => {
    const { dogId } = useParams<{ dogId: string }>();
    const [dog, setDog] = useState<Dog | null>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sheltName, setSheltName] = useState<string | null>(null);
    const userRoles = getRolesFromToken();
    const [isEditing, setIsEditing] = useState(false);
    const [gettingAppointment, setGettingAppointment] = useState(false);
    const [userShelterId, setUserShelterId] = useState<number | null>(null);
    const { selectedShelterId } = useShelter();
    const { t } = useTranslation();

    const fetchDog = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Authentication error: Please log in.");
            return;
        }
        try {
            const response = await axios.get(`http://localhost:8005/dogs/getById/${dogId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            setDog(response.data);

            const shelterData = await fetchShelterDetails(token);
            if (shelterData) {
                setUserShelterId(shelterData.id);
                setSheltName(shelterData.name);
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
    };

    const imageType: "png" | "jpeg" = dog?.image1?.includes("/9j/") ? "jpeg" : "png";
    const imageSrc1 = dog?.image1 ? addDataUrlPrefix(dog.image1, imageType) : null;
    const imageSrc2 = dog?.image2 ? addDataUrlPrefix(dog.image2, imageType) : null;
    const imageSrc3 = dog?.image3 ? addDataUrlPrefix(dog.image3, imageType) : null;

    if (loading) return <p>{t("loading")}</p>;
    if (error) return <p>{error}</p>;
    if (!dog) return <p>{t("noDogFound")}</p>;

    return (
        <Box sx={{ p: 3, backgroundColor: "#F5EDE3", minHeight: "100vh" }}>
            {isEditing && dog && <EditWindowDog dog={dog} onClose={() => { setIsEditing(false); fetchDog(); }} />}
            {gettingAppointment && dog && <AppointmentWindow dog={dog} onClose={() => { setGettingAppointment(false); fetchDog(); }} />}

            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginLeft: "-20px", marginTop: "-30px", mb: 1 }}>
                <Button onClick={() => navigate(-1)} sx={{ fontSize: 18, color: "black", fontWeight: "bold" }}>
                    ←
                </Button>


                {(userRoles.includes("ROLE_USER") || (userRoles.includes("ROLE_ADMIN") && sheltName !== dog.shelterName)) && (
                    <Typography fontWeight="bold" onClick={() => setGettingAppointment(true)} sx={{ cursor: "pointer", fontSize: 25, color: "black", marginRight: "10px", marginTop: "10px" }}>
                        Get an appointment to meet {dog.name}!
                        <Box component="img" src={pawIcon} alt="Paw" sx={{ height: 25, width: 25, ml: 1 }} />
                    </Typography>
                )}

                {(userRoles.includes("ROLE_ADMIN") && userShelterId === selectedShelterId && sheltName === dog.shelterName) && (
                    <Button onClick={() => setIsEditing(true)} sx={{ color: "black", marginTop: "10px", marginRight: "-10px" }}>
                        <FontAwesomeIcon icon={faEdit} style={{ fontSize: 24 }} />
                    </Button>
                )}
            </Box>

            {!isEditing && !gettingAppointment && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginLeft: "18px" }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ fontSize: 29 }}>
                        {dog.name?.toUpperCase()}
                    </Typography>
                    <Box onClick={() => navigate("/shelters")} component="img" src={logo} alt="logo" sx={{ width: 60, height: 60 }} />
                </Box>
            )}

            {/* Info Section */}
            {!isEditing && !gettingAppointment && (
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, marginTop: "-5px" }}>
                    <Box sx={{ flex: 1 }}>
                        <ul style={{ listStyle: "disc", paddingLeft: "1.5em", fontSize: "1.5rem", lineHeight: 2 }}>
                            <li><strong>Breed:</strong> {dog.breed}</li>
                            <li><strong>Gender:</strong> {dog.gender}</li>
                            <li><strong>Age:</strong>  {dog.age >= 1
                                ? `${dog.age.toFixed(0)} years`
                                : `${Math.floor(dog.age * 10)} months`}</li>
                            <li><strong>Size:</strong>{dog.size}</li>
                            <li><strong>Color:</strong> {dog.color}</li>
                            <li><strong>Shelter:</strong> {dog.shelterName}, {dog.shelterCity}</li>
                        </ul>

                    </Box>
                </Box>
            )}

            {/* Images */}
            {!isEditing && !gettingAppointment && (
                <Box sx={{ marginLeft: "1100px", marginTop: "-390px", display: "flex", flexDirection: "column", gap: 2, alignItems: "center", flex: 1 }}>
                    {[imageSrc1, imageSrc2, imageSrc3].map((src, index) => (
                        src ? (
                            <Box
                                key={index}
                                component="img"
                                src={src}
                                alt={`Dog ${index + 1}`}
                                sx={{
                                    //width: "150%",
                                    width: 250,
                                    //maxWidth: 250,
                                    height: 210,
                                    objectFit: "cover",
                                    borderRadius: 2,
                                    boxShadow: 3
                                }}
                            />
                        ) : (
                            <Box
                                key={index}
                                sx={{
                                    //width: "150%",
                                    width: 250,
                                    //maxWidth: 250,
                                    height: 210,
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    backgroundColor: "#ddd",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontStyle: "italic",
                                    color: "#666"
                                }}
                            >
                                No image

                            </Box>
                        )
                    ))}
                </Box>
            )}

            {/* Description */}
            {!isEditing && !gettingAppointment && (
                <Box sx={{ marginTop: "-40px", p: 2, borderRadius: 2, maxWidth: 800 }}>
                    <Typography variant="body1" sx={{ mb: 1, fontSize: 24, color: "black" }}>{dog.description}</Typography>
                    <Typography variant="body1" sx={{ fontSize: 24, color: "black" }}>{dog.story}</Typography>
                </Box>
            )}

            {/* Medical Files */}
            {!isEditing && !gettingAppointment && (
                <Box sx={{ marginTop: "-65px", marginRight: "-10px", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                    <Typography variant="h6">
                        <span style={{ fontWeight: "bold", fontSize: 22 }}>Medical files</span>
                    </Typography>
                    <Button onClick={handleForwardClickToFiles} sx={{ fontSize: 24, color: "black" }}>→</Button>
                </Box>
            )}
        </Box>
    );
};

export default DogProfilePage;
