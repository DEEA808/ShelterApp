import axios from "axios";
import { useState } from "react";
import "../AddShelter.css";
import { Navigate, useNavigate } from "react-router-dom";

const AddShelterPage: React.FC = () => {
    const [name, setName] = useState<string | null>(null);
    const [type, setType] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [phoneNumber, setPhone] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

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
            await axios.post(`http://localhost:8005/shelters/add`, {
                name,
                type,
                description,
                address,
                totalNumberOfDogs:0,
                availableDogs:0,
                phoneNumber,
                email,
                image,
                dogs:[]
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            navigate("/shelters");
        } catch (error) {
            console.error("Error adding dog:", error);
            setError("Failed to add shelter. Please try again.");
        }
    };


    return (
        <div className="add-page">
            <div className="add-container">
                <h2>Add your shelter</h2>
                {error && <p className="error-message">{error}</p>}
                <input type="text" onChange={(e) => setName(e.target.value)} placeholder="Enter name..." />
                <input type="text" onChange={(e) => setType(e.target.value)} placeholder="Enter type..." />
                <input type="text" onChange={(e) => setDescription(e.target.value)} placeholder="Enter description..." />
                <input type="text" onChange={(e) => setAddress(e.target.value)} placeholder="Enter an address..." />
                <input type="text" onChange={(e) => setPhone(e.target.value)} placeholder="Enter a phone number..." />
                <input type="text" onChange={(e) => setEmail(e.target.value)} placeholder="Enter an email..." />

                <input type="file" accept="image/*" onChange={handleFileChange} />

                <button className="save-button1" onClick={handleShelterAdd} disabled={uploading}>
                    {uploading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
};
export default AddShelterPage;