
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getUserProfile, updateUserPassword, updateUsername } from "../utils/auth";

function Settings() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameSuccess, setUsernameSuccess] = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    getUserProfile(currentUser.uid).then((result) => {
      if (result.success) setProfile(result.profile);
      else setProfile(null);
    });
  }, [navigate]);

  const currentUser = getCurrentUser();
  const isGoogleUser = currentUser?.loginType === 'google';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Form validasyonu
    if (form.currentPassword.trim() === "" || form.newPassword.trim() === "" || form.confirmPassword.trim() === "") {
      setError("Tüm alanları doldurun!");
      setLoading(false);
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Yeni şifreler eşleşmiyor!");
      setLoading(false);
      return;
    }

    if (form.newPassword.length < 6) {
      setError("Yeni şifre en az 6 karakter olmalıdır!");
      setLoading(false);
      return;
    }

    const result = await updateUserPassword(form.currentPassword, form.newPassword);
    if (result.success) {
      setSuccess("Şifre başarıyla güncellendi!");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  // Kullanıcı adı düzenlemeye başla
  const startUsernameEdit = () => {
    setEditingUsername(true);
    setNewUsername(profile?.username || "");
    setUsernameError("");
    setUsernameSuccess("");
  };

  // Kullanıcı adı düzenlemeyi iptal et
  const cancelUsernameEdit = () => {
    setEditingUsername(false);
    setNewUsername("");
  };

  // Kullanıcı adını kaydet
  const saveUsername = async () => {
    if (newUsername.trim() === "") {
      setUsernameError("Kullanıcı adı boş olamaz!");
      return;
    }

    const result = await updateUsername(newUsername.trim());
    
    if (result.success) {
      setUsernameSuccess("Kullanıcı adı başarıyla güncellendi!");
      setEditingUsername(false);
      setNewUsername("");
      // Profil bilgisini tekrar çek
      const currentUser = getCurrentUser();
      if (currentUser) {
        getUserProfile(currentUser.uid).then((res) => {
          if (res.success) setProfile(res.profile);
        });
      }
    } else {
      setUsernameError(result.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "Arial" }}>
      <h2>Ayarlar</h2>
      {/* Kullanıcı Adı ve Profil Bilgileri Bölümü */}
      <div style={{ 
        backgroundColor: "#f8f9fa", 
        padding: "20px", 
        borderRadius: "8px",
        marginBottom: "20px"
      }}>
        <h3>Kullanıcı Bilgileri</h3>
        {/* ... kullanıcı adı düzenleme ve profil bilgileri ... */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <strong>Kullanıcı Adı:</strong>
          {editingUsername ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveUsername()}
                style={{ 
                  flex: 1, 
                  padding: "5px", 
                  border: "1px solid #ddd",
                  borderRadius: "4px"
                }}
                autoFocus
              />
              <button
                onClick={saveUsername}
                style={{ 
                  color: "green",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "5px 10px",
                  fontSize: "12px"
                }}
              >
                ✓
              </button>
              <button
                onClick={cancelUsernameEdit}
                style={{ 
                  color: "orange",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "5px 10px",
                  fontSize: "12px"
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            <>
              <span>{profile?.username}</span>
              <button
                onClick={startUsernameEdit}
                style={{ 
                  color: "blue",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "5px 10px",
                  fontSize: "12px"
                }}
                title="Düzenle"
              >
                ✏️
              </button>
            </>
          )}
        </div>
        <p><strong>Email:</strong> {profile?.email}</p>
        <p><strong>Ad:</strong> {profile?.firstName} {profile?.lastName}</p>
      </div>
      {/* Şifre Değiştirme Bölümü */}
      <div style={{ backgroundColor: "#fff", padding: 20, borderRadius: 8, marginTop: 20 }}>
        <h3>Şifre Değiştir</h3>
        {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
        {success && <div style={{ color: "green", marginBottom: 10 }}>{success}</div>}
        <form onSubmit={handleSave}>
          <input
            type="password"
            name="currentPassword"
            placeholder="Mevcut Şifre"
            value={form.currentPassword}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, marginBottom: 10 }}
            disabled={loading}
          />
          <input
            type="password"
            name="newPassword"
            placeholder="Yeni Şifre"
            value={form.newPassword}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, marginBottom: 10 }}
            disabled={loading}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Yeni Şifre (Tekrar)"
            value={form.confirmPassword}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, marginBottom: 10 }}
            disabled={loading}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: 10,
              backgroundColor: loading ? "#ccc" : "#28a745",
              color: "white",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer"
            }}
            disabled={loading}
          >
            {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Settings;
