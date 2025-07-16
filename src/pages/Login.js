// src/pages/Login.js
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/auth";
import GoogleLoginButton from "./GoogleLoginButton";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef([]);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    if (username.trim() === "" || password.trim() === "") {
      setError("Kullanıcı adı ve şifre gereklidir!");
      setLoading(false);
      return;
    }
    
    const result = await loginUser(username, password);
    
    if (result.success) {
      navigate("/tasks");
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };


//kayıt sayfasına git
  const goToRegister = () => {
    navigate("/register");
  };

  return (
  <div style={{ maxWidth: 300, margin: "100px auto", textAlign: "center" }}>
    <h2>Giriş Yap</h2>
    
    {error && (
      <div style={{ color: "red", marginBottom: 10, fontSize: "14px" }}>
        {error}
      </div>
    )}
    
    <form onSubmit={handleLogin}>
      <input
        ref={el => inputRefs.current[0] = el}
        type="text"
        placeholder="Kullanıcı Adı"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={e => e.key === "Enter" && inputRefs.current[1]?.focus()}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
        disabled={loading}
      />
      <input
        ref={el => inputRefs.current[1] = el}
         type="password"
         placeholder="Şifre"
         value={password}
         onChange={(e) => setPassword(e.target.value)}
         onKeyDown={e => e.key === "Enter" && handleLogin(e)}
         style={{ width: "100%", padding: 8, marginBottom: 10 }}
         disabled={loading}
      />
      <button 
        type="submit" 
        style={{ 
          width: "100%", 
          padding: 8,
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer"
        }}
        disabled={loading}
      >
        {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
      </button>
    </form>
    
    {/* Kayıt Ol Butonu */}
    <button
      onClick={goToRegister}
      style={{
        width: "100%",
        padding: 8,
        marginTop: 10,
        backgroundColor: "#eee",
        border: "none",
        cursor: "pointer"
      }}
      disabled={loading}
    >
      Kayıt Ol
    </button>
    <GoogleLoginButton />
  </div>
);

}

export default Login;