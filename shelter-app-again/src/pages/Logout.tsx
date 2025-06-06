import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
   const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    navigate("/login"); // Redirect to login
  };

  return <button className="logout-button" onClick={handleLogout}>Logout</button>;
};

export default Logout;
