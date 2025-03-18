import React, { useState } from "react";
import axios from "axios";
import "../Edit.css";
import { useShelter } from "../utils/ShelterContext";

interface EditWindowPropsDog {
    dog: {
        id: number;
        name: string;
        breed: string;
        description: string;
        age: number;
        story: string;
        gender: string;
        image: string;
    };
    onClose: () => void;
}

const EditWindowDog: React.FC<EditWindowPropsDog> = ({ dog, onClose }) => {
    const [name, setName] = useState(dog.name);
    const [breed, setBreed] = useState(dog.breed);
    const [description, setDescription] = useState(dog.description);
    const [age, setAge] = useState(dog.age.toString());
    const [story, setStory] = useState(dog.story);
    const [gender, setGender] = useState(dog.gender);
    const [image, setImage] = useState<string>(dog.image);
    const [error, setError] = useState("");
    const { selectedShelterId } = useShelter();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // Convert image file to Base64
    const convertToBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
                if (event.target.files && event.target.files.length > 0) {
                    const file = event.target.files[0];
            
                    try {
                        const base64String = await convertToBase64(file);
                        const cleanedBase64 = base64String.split(",")[1]; // Remove "data:image/png;base64," part
                        console.log("Cleaned Base64:", cleanedBase64.substring(0, 100)); // Debugging: log first 100 chars
            
                        setImage(cleanedBase64); // Set image as clean Base64 string
                        setSelectedFile(file);
                    } catch (error) {
                        console.error("Error converting image to Base64:", error);
                        setError("Failed to process image.");
                    }
                }
            };

    const handleEdit = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Authentication error: Please log in.");
            return;
        }

        setUploading(true);

        try {
            await axios.put(
                `http://localhost:8005/dogs/update/${dog.id}/${selectedShelterId}`,
                {
                    name,
                    breed,
                    description,
                    age: parseInt(age),
                    story,
                    gender,
                    image, // Send Base64 string
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            onClose(); // Close modal after update
        } catch (error) {
            console.error("Error updating dog:", error);
            setError("Failed to update dog. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-button" onClick={onClose}>✖</button>
                <h2>Edit Dog Information</h2>
                {error && <p className="error-message">{error}</p>}
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name..." />
                <input type="text" value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Enter breed..." />
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description..." />
                <input type="text" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Enter age..." />
                <input type="text" value={story} onChange={(e) => setStory(e.target.value)} placeholder="Enter story..." />
                <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Enter gender..." />

                {/* Image Upload Input */}
                <input type="file" accept="image/*" onChange={handleFileChange} />
                
                <button className="save-button" onClick={handleEdit} disabled={uploading}>
                    {uploading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
};

export default EditWindowDog;
