import axios from "axios";
import { useState } from "react";
import { useShelter } from "./ShelterContext";
import { useNavigate } from "react-router-dom";

interface CSVUploadProperties{
    onSuccessUpl:()=>void;
}

const CsvUploader:React.FC<CSVUploadProperties>=({onSuccessUpl})=>{
    const [file,setFile]=useState<File|null>(null);
    const [status,setStatus]=useState<string |null>(null);
    const {selectedShelterId}=useShelter();
    const navigate=useNavigate();

    const handleFileChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
        if(event.target.files && event.target.files.length>0){
            setFile(event.target.files[0]);
        }
    }

    const handleUpload = async () => {
        if (!file) {
          setStatus("Please select a csv file");
          return;
        }
      
        const formData = new FormData();
        formData.append("file", file);
      
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            setStatus("Authentication error: Please log in.");
            return;
          }
      
          if (!selectedShelterId) {
            navigate("/shelters");
            return;
          }
      
          const response = await axios.post(
            `http://localhost:8005/dogs/upload/${selectedShelterId}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
      
          setStatus(response.data);
      
          // ✅ BLUR after update
          setTimeout(() => {
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }
          }, 50); // Give React time to render new cards
      
          onSuccessUpl();
        } catch (error) {
          console.error("Upload error", error);
          setStatus("Upload failed, try again!");
        }
      };
      

    return (
        <div>
        <div style={{marginLeft:"865px",marginTop:"35px",position:"absolute", textAlign: "center", padding: "20px" }}>
          
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
            {/* File Input */}
            <input style={{ fontSize: "12px", width: "170px" ,height:"15px"}} type="file" accept=".csv" onChange={handleFileChange} />
      
            {/* Upload Button */}
            <button onClick={handleUpload} style={{ fontSize: "13px", width: "110px" }}>
              Upload Dogs
            </button>
          </div>
      
          {/* Status Message */}
          {status && <p style={{ marginTop: "10px", color: status.includes("failed") ? "red" : "green" }}>{status}</p>}
        </div>
      </div>
      );

};

export default CsvUploader;


