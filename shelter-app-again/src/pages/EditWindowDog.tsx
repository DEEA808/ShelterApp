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
        size: string;
        color: string;
        image1: string;
        image2: string;
        image3: string;
    };
    onClose: () => void;
}

const EditWindowDog: React.FC<EditWindowPropsDog> = ({ dog, onClose }) => {
    const [name, setName] = useState(dog.name ?? "");
    const [breed, setBreed] = useState(dog.breed ?? "");
    const [description, setDescription] = useState(dog.description ?? "");
    const [age, setAge] = useState(dog.age.toString());
    const [story, setStory] = useState(dog.story ?? "");
    const [gender, setGender] = useState(dog.gender ?? "");
    const [size, setSize] = useState(dog.size ?? "");
    const [color, setColor] = useState(dog.color ?? "");
    const [image1, setImage1] = useState<string>(dog.image1 ?? "");
    const [extraImages, setExtraImages] = useState<File[]>([]);
    const [error, setError] = useState("");
    const { selectedShelterId } = useShelter();

    const [uploading, setUploading] = useState(false);

    const convertToBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((reader.result as string).split(",")[1]);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFileChange1 = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            try {
                const base64String = await convertToBase64(event.target.files[0]);
                setImage1(base64String);
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
        const normalizedSize = size?.toUpperCase();

        try {
            await axios.put(
                `http://localhost:8005/dogs/update/${dog.id}/${selectedShelterId}`,
                {
                    name,
                    breed,
                    description,
                    age: parseFloat(age),
                    story,
                    gender,
                    size: normalizedSize,
                    color,
                    image1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (extraImages.length > 0) {
                await uploadExtraImages(dog.id, extraImages);
            }

            onClose();
        } catch (error) {
            console.error("Error updating dog:", error);
            setError("Failed to update dog. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const uploadExtraImages = async (dogId: number, files: File[]) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));

        try {
            await axios.post(`http://localhost:8005/dogs/extra-images/${dogId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    //"Content-Type": "multipart/form-data",
                },
            });
        } catch (error) {
            console.error("Error uploading extra images:", error);
        }
    };

    const handleExtraImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setExtraImages(files);
            console.log("Selected extra images:", files.map(f => f.name));
        }
    };


    const handleExtraImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, position: number) => {
        if (event.target.files && event.target.files.length > 0) {
            const token = localStorage.getItem("token");
            const file = event.target.files[0];

            try {
                const base64 = await convertToBase64(file);

                // Send to backend with image and position
                await axios.post(`http://localhost:8005/dogs/extra-images/${dog.id}`, {
                    image: base64,
                    position: position
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
            } catch (error) {
                console.error("Error uploading extra image:", error);
                setError("Could not upload image.");
            }
        }
    };


    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-button" onClick={onClose}>
                    ✖
                </button>
                <h5>Edit Dog Information</h5>
                {error && <p className="error-message">{error}</p>}
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name..." />
                <input type="text" value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Enter breed..." />
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description..." />
                <input type="number" step="0.1" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Enter age..." />
                <input type="text" value={story} onChange={(e) => setStory(e.target.value)} placeholder="Enter story..." />
                <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Enter gender..." />
                <input type="text" value={size} onChange={(e) => setSize(e.target.value)} placeholder="Enter size (SMALL/MEDIUM/LARGE)..." />
                <input type="text" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Enter color..." />

                {/* Main image */}
                <input type="file" accept="image/*" onChange={handleFileChange1} />

                <input type="file" accept="image/*" onChange={(e) => handleExtraImageUpload(e, 2)} />

                <input type="file" accept="image/*" onChange={(e) => handleExtraImageUpload(e, 3)} />


                <button className="save-button" onClick={handleEdit} disabled={uploading}>
                    {uploading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
};

export default EditWindowDog;
