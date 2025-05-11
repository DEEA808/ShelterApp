import axios from "axios";
import { useState } from "react";
import "../AddDog.css";
import { Navigate, useNavigate } from "react-router-dom";
import { useShelter } from "../utils/ShelterContext";

const AddDogPage: React.FC = () => {
    const [name, setName] = useState<string | null>(null);
    const [breed, setBreed] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [age, setAge] = useState<number | 0>(0);
    const [story, setStory] = useState<string | null>(null);
    const [gender, setGender] = useState<string | null>(null);
    const [size, setSize] = useState<string | null>(null);
    const [color, setColor] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { selectedShelterId } = useShelter();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

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
                const cleanedBase64 = base64String.split(",")[1];
                console.log("Cleaned Base64:", cleanedBase64.substring(0, 100));

                setImage(cleanedBase64);
                setSelectedFile(file);
            } catch (error) {
                console.error("Error converting image to Base64:", error);
                setError("Failed to process image.");
            }
        }
    };


    const handleShelterAdd = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Authentication error: Please log in.");
            return;
        }

        setUploading(true);
        try {
            await axios.post(`http://localhost:8005/dogs/add/${selectedShelterId}`, {
                name,
                breed,
                description,
                age,
                story,
                gender,
                size,
                color,
                image,
                shelterName:"",
                shelterCity:""
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            navigate("/dogs");
        } catch (error) {
            console.error("Error adding dog:", error);
            setError("Failed to add dog. Please try again.");
        }
    };


    return (
        <div className="add-page">
            <div className="add-container">
                <h6>Add your dog</h6>
                {error && <p className="error-message">{error}</p>}
                <input type="text" onChange={(e) => setName(e.target.value)} placeholder="Enter name..." />
                <input type="text" onChange={(e) => setBreed(e.target.value)} placeholder="Enter the breed..." />
                <input type="text" onChange={(e) => setDescription(e.target.value)} placeholder="Enter description..." />
                <input
                    type="number"
                    step="0.1"
                    value={age}
                    onChange={(e) => setAge(parseFloat(e.target.value))}
                    placeholder="Enter age..."
                />
                <input type="text" onChange={(e) => setStory(e.target.value)} placeholder="Enter its story..." />
                <input type="text" onChange={(e) => setGender(e.target.value)} placeholder="Enter its gender..." />
                <input type="text" onChange={(e) => setSize(e.target.value)} placeholder="Enter the size..." />
                <input type="text" onChange={(e) => setColor(e.target.value)} placeholder="Enter the color..." />

                <input type="file" accept="image/*" onChange={handleFileChange} />

                <button className="save-button2" onClick={handleShelterAdd} disabled={uploading}>
                    {uploading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
};
export default AddDogPage;