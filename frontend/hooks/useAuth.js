import { useState, useEffect } from "react";
import { authAPI } from "../services/api";

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("username");
    if (savedToken) {
      setToken(savedToken);
      setUsername(savedUser);
    }
  }, []);

  const handleAuth = async (e, userInput, emailInput, passInput, isRegister) => {
    e.preventDefault();
    setAuthError("");
    
    if (!userInput.trim() || !passInput.trim()) {
      setAuthError("Username and password are required.");
      return;
    }

    try {
      let res;
      
      if (isRegister) {
        // Pass separate arguments matching: authAPI.register(username, email, password)
        res = await authAPI.register(userInput, emailInput, passInput);
      } else {
        // Pass separate arguments matching: authAPI.login(username, password)
        res = await authAPI.login(userInput, passInput);
      }
      
      if (res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("username", userInput);
        setToken(res.data.access_token);
        setUsername(userInput);
      } else {
        setAuthError("Registered successfully! Please log in.");
      }
    } catch (err) {
      // --- ROBUST ERROR LOGGING ---
      if (err.response) {
        const errorDetail = err.response.data?.detail;
        
        if (Array.isArray(errorDetail)) {
          setAuthError(errorDetail.map(e => e.msg).join(", "));
        } else if (typeof errorDetail === "string") {
          setAuthError(errorDetail);
        } else {
          setAuthError(`Server Error (${err.response.status}): The backend might be crashing. Check your MongoDB connection.`);
        }
      } else if (err.request) {
        setAuthError("Network Error: Cannot connect to backend. Is FastAPI running on port 8000?");
      } else {
        setAuthError("An unexpected error occurred: " + err.message);
      }
    }
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUsername("");
  };

  return { token, username, authError, handleAuth, logout };
};
