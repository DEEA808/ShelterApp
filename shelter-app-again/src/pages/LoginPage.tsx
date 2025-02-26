import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Auth.css"; // Styling for login and signup pages

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await axios.post("http://localhost:8005/auth/login", {
        email,
        password,
      });
  
      const token = response.data.token;
      const roles = response.data.roles; // Get roles from backend
  
      localStorage.setItem("token", token);
  
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; // Set token globally
  
      navigate("/shelters"); // Redirect after login
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };
  

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Hello!</h1>
        
        {error && <p className="error-message">{error}</p>}

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

          {/* Forgot Password Link */}
          <div className="forgot-password">
            <a href="/forgot-password">Forgotten password?</a>
          </div>

          <div className="signup-nav">
            <Link to="/signup">Don't have an account? Sign up!</Link>
          </div>

          {/* Login Button */}
          <button className="auth-button" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
