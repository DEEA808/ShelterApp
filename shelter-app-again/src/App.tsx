import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../src/pages/LoginPage";
import Signup from "../src/pages/RegisterPage";
import SheltersPage from "./pages/SheltersPage";
import DogsPage from "./pages/DogsPage";
import DogProfilePage from "./pages/DogProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} /> {/* Default to Login */}
        <Route path="/shelters" element={<SheltersPage />}/>
        <Route path="/dogs" element={<DogsPage/>}/>
        <Route path="/dogProfile/:dogId" element={<DogProfilePage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
