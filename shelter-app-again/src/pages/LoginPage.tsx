import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Auth.css";
import dogs from "../assets/more_dogs.png"
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";


const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [showForgotDialog, setShowForgotDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSendResetEmail = async () => {
    try {
      await axios.post("http://localhost:8005/auth/change", { email });
      setSuccessMessage("An email with your new password has been sent.");
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setShowForgotDialog(false);
    }
  };



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8005/auth/login", {
        email,
        password,
      });

      const token = response.data.token;

      localStorage.setItem("token", token);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; // Set token globally

      navigate("/shelters"); // Redirect after login
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };


  return (
    <div className="auth-page">
      <div className="auth-container-wrapper">
        <img src={dogs} className="auth-image" alt="Dogs" />
        <div className="auth-container">
        <h2>Hello!</h2>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}


        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="forgot-password">
            <Button variant="text" onClick={() => setShowForgotDialog(true)}
              sx={{
                textTransform: "none", fontSize: "14px", color: "black", textDecoration: null, fontWeight: "bold"
              }}>
              Forgotten password?
            </Button>
          </div>

          <div className="signup-nav">
            <Link to="/signup">Don't have an account? Sign up here as a user!</Link>
          </div>
          <div className="signup-nav">
            <Link to="/signupAdmin">Sign up here if you are a shelter owner!</Link>
          </div>

          {/* Login Button */}
          <button className="auth-button" type="submit">Login</button>
        </form>
      </div>
      <Dialog
        open={showForgotDialog}
        onClose={() => setShowForgotDialog(false)}
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Send an email with a new password to <strong>{email || "your email"}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowForgotDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSendResetEmail} color="primary" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

    </div>
    </div>
  );
};

export default Login;
