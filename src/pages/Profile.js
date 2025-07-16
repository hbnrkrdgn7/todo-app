import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getUserProfile } from "../utils/auth";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setLoading(true);
      console.log("currentUser.uid:", currentUser.uid);
      getUserProfile(currentUser.uid).then((result) => {
        console.log("getUserProfile result:", result);
        if (result.success) {
          setUser(result.profile);
          setError("");
        } else {
          setUser(null);
          setError(result.message || "Profil bulunamadı.");
        }
        setLoading(false);
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div style={{ color: "red", textAlign: "center", marginTop: 40 }}>{error}</div>;
  }

  if (!user) {
    return <div>Profil bulunamadı.</div>;
  }

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "Arial" }}>
      <h2>Profil Bilgileriniz</h2>
      <div style={{ 
        backgroundColor: "#f8f9fa", 
        padding: "20px", 
        borderRadius: "8px",
        marginBottom: "20px"
      }}>
        <p><strong>İsim:</strong> {user.firstName}</p>
        <p><strong>Soyisim:</strong> {user.lastName}</p>
        <p><strong>Kullanıcı Adı:</strong> {user.username}</p>
        <p><strong>E-posta:</strong> {user.email}</p>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button 
          onClick={() => navigate("/tasks")} 
          style={{ 
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Görev Listesine Dön
        </button>
        <button 
          onClick={() => navigate("/settings")} 
          style={{ 
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Ayarlar
        </button>
      </div>
    </div>
  );
}

export default Profile;