import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import logo from "../assets/app_logo-removebg.png"
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    IconButton,
    Box
} from "@mui/material";
import { getRolesFromToken } from "../utils/Auth";
import { useShelter } from "../utils/ShelterContext";
import { fetchShelterDetails } from "../utils/ShelterUtils";


interface MedicalFile {
    id: number;
    fileName: string;
    fileType: string;
    base64Data: string;
}

const MedicalFilesPage: React.FC = () => {
    const token = localStorage.getItem("token");
    const { dogId } = useParams<{ dogId: string }>();
    const navigate = useNavigate();
    const [medFiles, setMedFiles] = useState<MedicalFile[]>([]);
    const userRoles = getRolesFromToken();
    const [userShelterId, setUserShelterId] = useState<number | null>(null);
    const { selectedShelterId, setSelectedShelterId } = useShelter();
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [uploadMessage, setUploadMessage] = useState<string | null>(null);

    console.log(userShelterId);
    console.log(selectedShelterId);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(e.target.files);
    };

    const handleFileUpload = async () => {
        if (!selectedFiles || !dogId) return;

        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append("files", selectedFiles[i]);
        }

        try {
            await axios.post(`http://localhost:8005/files/uploadFiles/${dogId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadMessage("Files uploaded successfully!");
            fetchMedicalFiles();
        } catch (error) {
            console.error("Upload failed:", error);
            setUploadMessage("Failed to upload files.");
        }
    };


    const fetchMedicalFiles = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Authentication required");

            const response = await axios.get(`http://localhost:8005/files/myFiles/${dogId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const shelterData = await fetchShelterDetails(token);
            if (shelterData) {
                setUserShelterId(shelterData.id);
            }
            setMedFiles(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Failed to fetch appointments", error);
        }
    };

    useEffect(() => {
        fetchMedicalFiles();
    }, []);

    const handleDelete = async (fileId: number) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Authentication required");

            await axios.delete(`http://localhost:8005/files/delete/${fileId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMedFiles(medFiles.filter((file) => file.id !== fileId));
        } catch (error) {
            console.error("Failed to cancel appointment", error);
        }
    };

    return (
        <Container
            maxWidth="xl"
            sx={{
                minHeight: "400vh",
                backgroundColor: "#F5EDE3",
                padding: "20px",
            }}
        >
            {/* Logo in top-right corner */}
            <Box onClick={() => navigate("/shelters")}
                component="img"
                src={logo}
                alt="Logo"
                sx={{
                    position: "absolute",
                    top: -5,
                    right: 20,
                    width: "100px",
                    height: "auto",
                    border: "none",        // explicitly ensures no border
                    boxShadow: "none",     // no shadow
                    borderRadius: 0        // no rounding if you want it completely sharp
                }}
            />
            {/* Back Button */}
            <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
                <ArrowBackIcon />
            </IconButton>

            {(userRoles.includes("ROLE_ADMIN") && (userShelterId == selectedShelterId)) && (
                <div
                    style={{
                        marginRight: "10px",
                        marginTop: "0px",
                        marginLeft: "1150px",
                        display: "flex",
                        flexDirection: "column", // 👈 makes elements stack vertically
                        gap: "10px" // 👈 space between input and button
                    }}
                >
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        style={{
                            padding: "4px 8px",
                            width: "200px",
                            fontSize: "14px"
                        }}
                    />

                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#E08E84",
                            color: "white",
                            fontSize: "0.75rem",
                            width: "220px",
                            height: "30px"
                        }}
                        onClick={handleFileUpload}
                    >
                        Upload Medical Files
                    </Button>

                    {uploadMessage && (
                        <Typography sx={{ color: "#444" }}>{uploadMessage}</Typography>
                    )}
                </div>
            )}

            {/* Title */}
            <Typography fontFamily="serif" variant="h6" fontWeight="bold" color="black" gutterBottom>
                Medical Files
            </Typography>

            {/* Table */}
            <TableContainer component={Paper} sx={{ borderRadius: "8px", boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>File’s Name</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>File’s content</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {medFiles.map((medFile) => {
                            const byteCharacters = atob(medFile.base64Data);
                            const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
                            const byteArray = new Uint8Array(byteNumbers);
                            const blob = new Blob([byteArray], { type: medFile.fileType });
                            const fileUrl = URL.createObjectURL(blob);

                            return (
                                <TableRow key={medFile.id}>
                                    <TableCell>{medFile.fileName}</TableCell>
                                    <TableCell>
                                        <a
                                            href={fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ textDecoration: "none", color: "#D86B5C", fontWeight: "bold" }}
                                        >
                                            Open
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        {(userRoles.includes("ROLE_ADMIN") && (userShelterId == selectedShelterId)) && (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleDelete(medFile.id)}
                                                sx={{
                                                    backgroundColor: "#E08E84",  // Custom color
                                                    color: "black",  // Ensure text is visible
                                                    borderRadius: "8px",
                                                    fontWeight: "bold",
                                                    textTransform: "none",
                                                    "&:hover": {
                                                        backgroundColor: "#CC766D",
                                                    }
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>

                </Table>
            </TableContainer>
        </Container >
    );
};

export default MedicalFilesPage;
