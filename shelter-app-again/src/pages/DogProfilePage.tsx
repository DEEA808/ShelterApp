import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Dog } from "../models/Dog";
import axios from "axios";
import "../Profile.css"
import { addDataUrlPrefix } from "../utils/ImageUtils";

const DogProfilePage: React.FC = () => {
    const { dogId } = useParams<{ dogId: string }>();
    const [dog, setDog] = useState<Dog | null>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDog = async () => {
            try {
                const response = await axios.get(`http://localhost:8005/dogs/getById/${dogId}`)
                setDog(response.data);
            } catch (err) {
                setError("Failed to fetch dog");
            } finally {
                setLoading(false);
            }
        }
        fetchDog();
    }, [dogId]);


    const imageType: "png" | "jpeg" = dog?.image?.includes("/9j/") ? "jpeg" : "png";
    const imageSrc = dog?.image ? addDataUrlPrefix(dog.image, imageType) : null;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!dog) return <p>No dog found.</p>;

    return (
        <div className="profile-page">
            <button onClick={() => navigate(-1)} className="back-button">←</button>
           <div> <h2 className="profile-title">Meet {dog.name}!  <img src="/assets/paw.png"  className="paw-icon" /></h2> </div>
            <div className="image-container">
                {imageSrc ? (
                    <img src={imageSrc} alt={dog.name} className="profile-image" />
                ) : (
                    <p>No image available</p>
                )}
            </div>

            <ul className="profile-info-list">
                <li><strong>Breed:</strong> {dog.breed}</li>
                <li><strong>Description:</strong> {dog.description}</li>
                <li><strong>Story:</strong> {dog.story}</li>
                <li><strong>Gender:</strong> {dog.gender}</li>
                <li><strong>Age:</strong> {dog.age} years</li>
            </ul>
        </div>
    );
}
export default DogProfilePage;