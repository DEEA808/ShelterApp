import React, { useState } from "react";
import axios from "axios";
import "../Edit.css";
import { useShelter } from "../utils/ShelterContext";

interface AppointmentWindowProps {
    dog: {
        id: number;
        name: string;
    };
    onClose: () => void;
}

const AppointmentWindow: React.FC<AppointmentWindowProps> = ({ dog, onClose }) => {
    const [dogName, setDogName] = useState(dog.name);
    const[dogId,setDogId]=useState(dog.id)
    const[userName,setUserName]=useState("");
    const[dateTime,setDateTime]=useState("");
    const [error, setError] = useState("");
    const { selectedShelterId } = useShelter();
    
    const handleEdit = async () => {

        try {
            await axios.post("http://localhost:8005/appointments/add", {
                userName,
                dogName,
                dateTime,
                price:0.0,
                status:"",
                dogId,
                shelterId:selectedShelterId,
                userId:1
            });

            onClose(); // Close modal after update
        } catch (error) {
            console.error("Error updating dog:", error);
            setError("Failed to update dog. Please try again.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-button" onClick={onClose}>✖</button>
                <h2>Get an appointment</h2>
                {error && <p className="error-message">{error}</p>}
                <input type="text"  onChange={(e) => setUserName(e.target.value)} placeholder="Enter your name" />
                <input type="text"  onChange={(e) => setDateTime(e.target.value)} placeholder="Enter the date and time" />
                <button className="save-button" onClick={handleEdit}>Save Changes</button>
            </div>
        </div>
    );
};

export default AppointmentWindow;
