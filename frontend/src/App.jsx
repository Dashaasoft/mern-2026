import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CategoryDetailsPage from "./pages/CategoryDetailsPage";
import LoginModal from "./components/LoginModal";
import "./index.css"; // <-- Tailwind CSS файлыг энд import хийнэ

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Async function дотор state update хийх
    const fetchUser = async () => {
      // Жишээ: fake API call / fake user
      const userData = { phone: "+97696607014", name: "Ts. Dashzeveg" };
      setUser(userData);
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans">
        {showLogin && (
          <LoginModal
            close={() => setShowLogin(false)}
            onLoginSuccess={setUser}
          />
        )}

        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                user={user}
                onLoginClick={() => setShowLogin(true)}
                onLogout={handleLogout}
              />
            }
          />
          <Route path="/category/:autoType" element={<CategoryDetailsPage />} />
          {/* Хэрэв нэмэлт page хэрэгтэй бол энд route нэмнэ */}
          {/* <Route path="/add-car" element={<AddCarPage user={user} />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
