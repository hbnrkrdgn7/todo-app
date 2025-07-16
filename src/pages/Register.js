// src/pages/Register.js
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../utils/auth";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    birthDate: "",
    city: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false); // Şifre göster/gizle için
  const [passwordStrength, setPasswordStrength] = useState(""); // Şifre gücü
  const [error, setError] = useState(""); // Hata mesajları için
  const [loading, setLoading] = useState(false); // Loading durumu için
  const inputRefs = useRef([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      // Telefon numarası formatlaması
      const phoneNumber = value.replace(/\D/g, ''); // Sadece rakamları al
      let formattedPhone = '';
      
      if (phoneNumber.length <= 4) {
        formattedPhone = phoneNumber;
      } else if (phoneNumber.length <= 7) {
        formattedPhone = phoneNumber.slice(0, 4) + ' ' + phoneNumber.slice(4);
      } else if (phoneNumber.length <= 10) {
        formattedPhone = phoneNumber.slice(0, 4) + ' ' + phoneNumber.slice(4, 7) + ' ' + phoneNumber.slice(7);
      } else {
        formattedPhone = phoneNumber.slice(0, 4) + ' ' + phoneNumber.slice(4, 7) + ' ' + phoneNumber.slice(7, 9) + ' ' + phoneNumber.slice(9, 11);
      }
      
      setForm({ ...form, [name]: formattedPhone });
    } else {
      setForm({ ...form, [name]: value });
    }

    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = "Zayıf";
    if (password.length >= 8) {
      const hasNumber = /\d/.test(password);
      const hasSpecial = /[!@#$%^&*]/.test(password);
      const hasUpper = /[A-Z]/.test(password);

      if (hasNumber && hasSpecial && hasUpper) {
        strength = "Güçlü";
      } else if (hasNumber || hasSpecial) {
        strength = "Orta";
      }
    } else {
      strength = "Zayıf";
    }
    setPasswordStrength(strength);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Form kontrolü
    for (const key in form) {
      if (form[key].trim() === "") {
        setError("Lütfen tüm alanları doldurun!");
        setLoading(false);
        return;
      }
    }

    // Telefon numarası validasyonu (formatlanmış hali için)
    const phoneRegex = /^\d{4} \d{3} \d{2} \d{2}$/;
    if (!phoneRegex.test(form.phone)) {
      setError("Telefon numarası 0548 596 23 15 formatında olmalıdır!");
      setLoading(false);
      return;
    }

    const result = await registerUser(form);
    
    if (result.success) {
      alert("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.");
      navigate("/login");
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "Arial" }}>
      <h2>Kayıt Ol</h2>
      
      {error && (
        <div style={{ color: "red", marginBottom: 10, fontSize: "14px" }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleRegister}>
        <input
          ref={el => inputRefs.current[0] = el}
          name="firstName"
          placeholder="İsim"
          value={form.firstName}
          onChange={handleChange}
          onKeyDown={e => e.key === "Enter" && inputRefs.current[1]?.focus()}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <input
          ref={el => inputRefs.current[1] = el}
          name="lastName"
          placeholder="Soyisim"
          value={form.lastName}
          onChange={handleChange}
          onKeyDown={e => e.key === "Enter" && inputRefs.current[2]?.focus()}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <input
          ref={el => inputRefs.current[2] = el}
          name="username"
          placeholder="Kullanıcı Adı"
          value={form.username}
          onChange={handleChange}
          onKeyDown={e => e.key === "Enter" && inputRefs.current[3]?.focus()}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <input
          ref={el => inputRefs.current[3] = el}
          type="email"
          name="email"
          placeholder="E-posta"
          value={form.email}
          onChange={handleChange}
          onKeyDown={e => e.key === "Enter" && inputRefs.current[4]?.focus()}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <input
          ref={el => inputRefs.current[4] = el}
          type="tel"
          name="phone"
          placeholder="Telefon (0548 596 23 15)"
          value={form.phone}
          onChange={handleChange}
          onKeyDown={e => e.key === "Enter" && inputRefs.current[5]?.focus()}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <input
          ref={el => inputRefs.current[5] = el}
          type="date"
          name="birthDate"
          value={form.birthDate}
          onChange={handleChange}
          onKeyDown={e => e.key === "Enter" && inputRefs.current[6]?.focus()}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <input
          ref={el => inputRefs.current[6] = el}
          name="city"
          placeholder="Yaşadığınız Şehir"
          value={form.city}
          onChange={handleChange}
          onKeyDown={e => e.key === "Enter" && inputRefs.current[7]?.focus()}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <div style={{ position: "relative", marginBottom: 10 }}>
          <input
            ref={el => inputRefs.current[7] = el}
            type={passwordVisible ? "text" : "password"}
            name="password"
            placeholder="Şifre"
            value={form.password}
            onChange={handleChange}
            onKeyDown={e => e.key === "Enter" && handleRegister(e)}
            style={{ width: "92%", padding: 8, paddingRight: 40 }}
          />
          <span
            onClick={togglePasswordVisibility}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              userSelect: "none",
              fontWeight: "bold",
            }}
            title={passwordVisible ? "Şifreyi Gizle" : "Şifreyi Göster"}
          >
            {passwordVisible ? "🔓" : "🔒"}
          </span>
        </div>

        {form.password && (
          <div
            style={{
              color:
                passwordStrength === "Güçlü"
                  ? "green"
                  : passwordStrength === "Orta"
                  ? "orange"
                  : "red",
              marginBottom: 10,
            }}
          >
            Şifre Gücü: {passwordStrength}
          </div>
        )}

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
          {loading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
        </button>
      </form>
    </div>
  );
}

export default Register;