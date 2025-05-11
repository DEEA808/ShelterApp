import React, { useState } from "react";
import axios from "axios";
import "../Edit.css";
import { useShelter } from "../utils/ShelterContext";
import { Dog } from "../models/Dog";

interface EditWindowPropsShelter {
    shelter: {
        id: number,
        name: string,
        type:string,
        description: string,
        address: string,
        city:string,
        totalNbOfDogs: number,
        availableDogs: number,
        phoneNumber: string,
        email: string,
        image: string,
        dogs: Dog[]
    };
    onClose: () => void;
}

const EditWindowShelter: React.FC<EditWindowPropsShelter> = ({ shelter: shelter, onClose }) => {
    const [name, setName] = useState(shelter.name);
    const [type, setType] = useState(shelter.type);
    const [description, setDescription] = useState(shelter.description);
    const [address, setAddress] = useState(shelter.address);
    const [city, setCity] = useState(shelter.city);
    const [totalNbOfDogs, setTotalNbOfDogs] = useState(shelter.totalNbOfDogs);
    const [availableDogs, setAvailableDogs] = useState(shelter.availableDogs);
    const [phoneNumber, setPhone] = useState(shelter.phoneNumber);
    const [email, setEmail] = useState(shelter.email);
    const [image, setImage] = useState<string>(shelter.image);
    const [dogs, setDogs] = useState(shelter.dogs);
    const [error, setError] = useState("");
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


    const handleShelterEdit = async () => {
        console.log("I am here");
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Authentication error: Please log in.");
            return;
        }

        setUploading(true);
        try {
            console.log("I am here");
            console.log(shelter.id);
            await axios.put(`http://localhost:8005/shelters/update/${shelter.id}`, {
                name,
                type,
                description,
                address,
                city,
                totalNbOfDogs,
                availableDogs,
                phoneNumber,
                email,
                image,
                dogs
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            onClose();
        } catch (error) {
            console.error("Error updating dog:", error);
            setError("Failed to update dog. Please try again.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-button" onClick={onClose}>✖</button>
                <h5>Edit Shelter Information</h5>
                {error && <p className="error-message">{error}</p>}
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter shelter's name..." />
                <input type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="Enter shelter's type..." />
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description..." />
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter the adress..." />
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter the city name..." />
                <input type="text" value={phoneNumber} onChange={(e) => setPhone(e.target.value)} placeholder="Enter the phone number..." />
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter the email..." />

                <input type="file" accept="image/*" onChange={handleFileChange} />




                <button type="button" className="save-button-shelter" onClick={handleShelterEdit}>Save Changes</button>
            </div>
        </div>
    );
};

export default EditWindowShelter;
