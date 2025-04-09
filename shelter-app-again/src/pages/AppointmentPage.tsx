import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
    IconButton
} from "@mui/material";


interface Appointment {
    id: number;
    userName: string;
    dogName: string;
    shelterName:string;
    dateTime: string;
    price: number;
    status: string;
    dogId: number;
    shelterId: number;
    userId: number;
    date: string;
    time: string;
}

const AppointmentPage: React.FC = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Authentication required");

                const response = await axios.get("http://localhost:8005/appointments/mine", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const formattedAppointments = response.data.map((appt: Appointment) => {
                    const [date, time] = appt.dateTime.split("T"); // Splitting "YYYY-MM-DDTHH:mm:ss"
                    return { ...appt, date, time: time.substring(0, 5) }; // Extract only HH:mm
                });

                setAppointments(formattedAppointments);
            } catch (error) {
                console.error("Failed to fetch appointments", error);
            }
        };

        fetchAppointments();
    }, []);

    const handleCancel = async (appointmentId: number) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Authentication required");

            await axios.delete(`http://localhost:8005/appointments/cancel/${appointmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setAppointments(appointments.filter((appt) => appt.id !== appointmentId));
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
            {/* Back Button */}
            <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
                <ArrowBackIcon />
            </IconButton>

            {/* Title */}
            <Typography fontFamily="serif" variant="h6" fontWeight="bold" color="black" gutterBottom>
                Appointments
            </Typography>

            {/* Table */}
            <TableContainer component={Paper} sx={{ borderRadius: "8px", boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>Dog’s Name</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>Shelter’s Name</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>Time</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>Price</TableCell>
                            <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>Status</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appointments.map((appointment) => (
                            <TableRow key={appointment.id}>
                                <TableCell>{appointment.dogName}</TableCell>
                                <TableCell>{appointment.shelterName}</TableCell>
                                <TableCell>{appointment.date}</TableCell>
                                <TableCell>{appointment.time}</TableCell>
                                <TableCell>{appointment.price} RON</TableCell>
                                <TableCell>{appointment.status}</TableCell>
                                <TableCell>
                                    {appointment.status === "confirmed" && (
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => handleCancel(appointment.id)}
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
                                            Cancel
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container >
    );
};

export default AppointmentPage;
