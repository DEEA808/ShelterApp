import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../src/pages/LoginPage";
import Signup from "../src/pages/RegisterPage";
import SheltersPage from "./pages/SheltersPage";
import DogsPage from "./pages/DogsPage";
import DogProfilePage from "./pages/DogProfilePage";
import ShelterDetails from "./pages/ShelterDetails";
import SignupAdmin from "./pages/RegisterAdmin";
import AddShelterPage from "./pages/AddShelterPage";
import AppointmentPage from "./pages/AppointmentPage";
import UserPreferencesFormPage from "./pages/UserPreferencesFormPage";
import TopBreedsPage from "./pages/TopBreedsPage";
import DogsWithSameBreedPage from "./pages/DogsWithSameBreedPage";
import AddDogPage from "./pages/AddDogPage";
import ShelterAppointmentPage from "./pages/ShelterAppointmentPage";
import MedicalFilesPage from "./pages/MedicalFilesPage";
import NewFormPage from "./pages/NewFormPage";
import TraitPage from "./pages/TraitPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signupAdmin" element={<SignupAdmin/>}/>
        <Route path="/" element={<Login />} /> {/* Default to Login */}
        <Route path="/shelters" element={<SheltersPage />}/>
        <Route path="/dogs" element={<DogsPage/>}/>
        <Route path="/dogProfile/:dogId" element={<DogProfilePage/>}/>
        <Route path="/files/:dogId" element={<MedicalFilesPage/>}/>
        <Route path="/shelterDetails/:shelterId" element={<ShelterDetails/>}/>
        <Route path="/addShelter" element={<AddShelterPage/>}/>
        <Route path="/addDog" element={<AddDogPage/>}/>
        <Route path="/appointments" element={<AppointmentPage/>}/>
        <Route path="/shelterAppointments" element={<ShelterAppointmentPage/>}/>
        <Route path="/toForm" element={<NewFormPage/>}/>
        <Route path="/trait-detail/:trait" element={<TraitPage/>}/>
        <Route path="/topBreeds" element={<TopBreedsPage />} />
        <Route path="/breeds/:breedName" element={<DogsWithSameBreedPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
