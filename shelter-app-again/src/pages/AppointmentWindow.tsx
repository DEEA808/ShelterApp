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
    const[date,setDate]=useState("");
    const[time,setTime]=useState("");
    const [error, setError] = useState("");
    const { selectedShelterId } = useShelter();
    
    const makeAnAppointment = async () => {
        if (!date || !time) {
            setError("Please provide both date and time.");
            return;
          }
        
          const combinedDateTime = `${date}T${time}:00`;

        try {
            await axios.post("http://localhost:8005/appointments/add", {
                userName,
                dogName,
                dateTime:combinedDateTime,
                price:0.0,
                status:"",
                dogId,
                shelterId:selectedShelterId,
                userId:1
            });

            onClose(); // Close modal after update
        } catch (error) {
            console.error("Error making an appointment:", error);
            setError("Failed to make an appointment. Please try again.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-button" onClick={onClose}>✖</button>
                <h6>Get an appointment</h6>
                {error && <p className="error-message">{error}</p>}
                <input type="text"  onChange={(e) => setUserName(e.target.value)} placeholder="Enter your name" />
                <input type="text"  onChange={(e) => setDate(e.target.value)} placeholder="Enter the date" />
                <input type="text"  onChange={(e) => setTime(e.target.value)} placeholder="Enter the time" />
                <button className="save-button" onClick={makeAnAppointment}>Save Changes</button>
            </div>
        </div>
    );
};

export default AppointmentWindow;
