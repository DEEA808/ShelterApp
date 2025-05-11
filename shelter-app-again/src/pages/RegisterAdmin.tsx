import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Auth.css";
import dogs from "../assets/more_dogs.png"

const SignupAdmin: React.FC = () => {
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      await axios.post("http://localhost:8005/auth/signupAdmin", {
        email,
        password,
        fullname: fullname
      });

      // Redirect to login after successful signup
      navigate("/login");
    } catch (err) {
      setError("Signup failed. Try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container-wrapper">
        <img src={dogs} className="auth-image" alt="Dogs" />
        <div className="auth-container">
          <h1>Hello!</h1>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSignup}>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name..."
              value={fullname}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

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

            <button className="auth-button" type="submit">Sign Up</button>
          </form>

          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default SignupAdmin;
