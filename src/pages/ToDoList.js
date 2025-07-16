// src/pages/ToDoList.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // axios baseURL sonu /todos olmalı
import { getCurrentUser, logoutUser, onAuthChange } from "../utils/auth";

function ToDoList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState("all");
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      if (!firebaseUser) {
        navigate("/login");
      } else {
        setUser(firebaseUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) fetchTasks();
    // eslint-disable-next-line
  }, [user]);

  const fetchTasks = async () => {
    try {
      if (!user) {
        setError("Kullanıcı bilgisi bulunamadı!");
        return;
      }
      const res = await api.get("/");
      const allTasks = Array.isArray(res.data) ? res.data : [];
      const userTasks = allTasks.filter(task => task.userId === user.uid);
      setTasks(userTasks);
      setError("");
    } catch (err) {
      setError(`Görevler yüklenirken hata oluştu: ${err.response?.data?.message || err.message}`);
      setTasks([]);
    }
  };



  // Yeni görev ekle
  const addTask = async () => {
    if (newTask.trim() === "") return;
    try {
      if (!user) {
        setError("Kullanıcı bilgisi bulunamadı!");
        return;
      }
      const res = await api.post("/", {
        text: newTask.trim(),
        completed: false,
        userId: user.uid,
        userName: user.displayName || user.email
      });
      setTasks([...tasks, res.data]);
      setNewTask("");
      setError("");
    } catch (err) {
      setError(`Görev eklenirken hata oluştu: ${err.response?.data?.message || err.message}`);
    }
  };


  // Görevi sil
  const deleteTask = async (id) => {
    try {
      await api.delete(`/${id}`);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setError("");
    } catch (err) {
      console.error("Silinemedi", err);
      setError("Görev silinirken hata oluştu.");
    }
  };

  // Tamamlanma durumunu değiştir
  const toggleComplete = async (task) => {
    try {
      const res = await api.put(`/${task.id}`, {
        ...task,
        completed: !task.completed,
      });
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? res.data : t))
      );
      setError("");
    } catch (err) {
      console.error("Güncellenemedi", err);
      setError("Görev güncellenirken hata oluştu.");
    }
  };

  // Görev düzenlemeye başla
  const startEdit = (task) => {
    setEditingTask(task.id);
    setEditText(task.text);
  };

  // Görev düzenlemeyi iptal et
  const cancelEdit = () => {
    setEditingTask(null);
    setEditText("");
  };

  // Görev düzenlemeyi kaydet
  const saveEdit = async () => {
    if (editText.trim() === "") {
      setError("Görev metni boş olamaz!");
      return;
    }

    try {
      const taskToUpdate = tasks.find(t => t.id === editingTask);
      const res = await api.put(`/${editingTask}`, {
        ...taskToUpdate,
        text: editText.trim(),
      });
      
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask ? res.data : t))
      );
      setEditingTask(null);
      setEditText("");
      setError("");
    } catch (err) {
      console.error("Görev güncellenemedi", err);
      setError("Görev güncellenirken hata oluştu.");
    }
  };

  // Filtreleme - sadece kullanıcının kendi görevleri
  const userTasks = Array.isArray(tasks) ? tasks.filter(task => task.userId === user?.uid) : [];
  const filteredTasks = userTasks.filter((task) => {
    if (category === "completed") return task.completed;
    if (category === "active") return !task.completed;
    return true;
  });

  const logout = () => {
    logoutUser();
    navigate("/login");
  };



  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <h1>To-Do List</h1>
        <button onClick={logout} style={{ height: 30 }}>
          Çıkış Yap
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <button onClick={() => setCategory("all")}>Tüm Görevler</button>
        <button onClick={() => setCategory("active")}>Aktif Görevler</button>
        <button onClick={() => setCategory("completed")}>Tamamlanmış Görevler</button>
        <button onClick={() => navigate("/settings")}>Ayarlar</button>
        <button onClick={() => navigate("/profile")}>Profil</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Görev girin..."
          style={{ width: "70%", padding: "8px" }}
        />
        <button
          onClick={addTask}
          style={{ marginLeft: 10 }}
          disabled={newTask.trim() === ""}
        >
          Ekle
        </button>
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: 10 }}>
          {error}
        </div>
      )}

      {/* Görev istatistikleri */}
      <div style={{ 
        backgroundColor: "#f8f9fa", 
        padding: "10px", 
        borderRadius: "4px", 
        marginBottom: "20px",
        fontSize: "14px"
      }}>
        <strong>Görev İstatistikleri:</strong> 
        Toplam: {userTasks.length} | 
        Aktif: {userTasks.filter(t => !t.completed).length} | 
        Tamamlanmış: {userTasks.filter(t => t.completed).length}
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: task.completed ? "line-through" : "none",
              color: task.completed ? "gray" : "black",
              marginBottom: 10,
              padding: "10px",
              backgroundColor: "#fff",
              borderRadius: "4px",
              border: "1px solid #ddd"
            }}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task)}
              style={{ marginRight: 10 }}
            />
            
            {editingTask === task.id ? (
              // Düzenleme modu
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                  style={{ 
                    flex: 1, 
                    padding: "5px", 
                    border: "1px solid #ddd",
                    borderRadius: "4px"
                  }}
                  autoFocus
                />
                <button
                  onClick={saveEdit}
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
                  onClick={cancelEdit}
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
              // Normal görünüm
              <div style={{ flex: 1 }}>
                <div>{task.text}</div>
              </div>
            )}
            
            <div style={{ display: "flex", gap: "5px" }}>
              {editingTask !== task.id && (
                <button
                  onClick={() => startEdit(task)}
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
              )}
              <button
                onClick={() => deleteTask(task.id)}
                style={{ 
                  color: "red",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "5px 10px"
                }}
                title="Sil"
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToDoList;