import React, { useState } from "react";
import axios from "axios";
import "../Edit.css";
import { useShelter } from "../utils/ShelterContext";

interface EditWindowProps {
    dog: {
        id: number;
        name: string;
        breed: string;
        description: string;
        age: number;
        story: string;
        gender: string;
        image:string;
    };
    onClose: () => void;
}

const EditWindow: React.FC<EditWindowProps> = ({ dog, onClose }) => {
    const [name, setName] = useState(dog.name);
    const [breed, setBreed] = useState(dog.breed);
    const [description, setDescription] = useState(dog.description);
    const [age, setAge] = useState(dog.age.toString());
    const [story, setStory] = useState(dog.story);
    const [gender, setGender] = useState(dog.gender);
    const [image, setImage] = useState(dog.image);
    const [error, setError] = useState("");
    const { selectedShelterId } = useShelter();
    
    const handleEdit = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Authentication error: Please log in.");
            return;
        }

        try {
            await axios.put(`http://localhost:8005/dogs/update/${dog.id}/${selectedShelterId}`, {
                name,
                breed,
                description,
                age: parseInt(age),
                story,
                gender,
                image
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
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
                <h2>Edit Dog Information</h2>
                {error && <p className="error-message">{error}</p>}
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name..." />
                <input type="text" value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Enter your breed..." />
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter your description..." />
                <input type="text" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Enter your age..." />
                <input type="text" value={story} onChange={(e) => setStory(e.target.value)} placeholder="Enter your story..." />
                <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Enter your gender..." />
                <button className="save-button" onClick={handleEdit}>Save Changes</button>
            </div>
        </div>
    );
};

export default EditWindow;
