import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../components/LoginModal";
import axios from "../api/axios";
import { API_URL } from "../config/api.js";

const HomePage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [categories, setCategories] = useState([]);
  const [cars, setCars] = useState([]);
  const [myCars, setMyCars] = useState([]);

  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [carsLoading, setCarsLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchUser(token);
      fetchMyCars(token);
    }

    fetchCategories();
    fetchCars(); // 👉 НИЙТ ЗАР
  }, []);

  /* ================= USER ================= */
  const fetchUser = async (token) => {
    try {
      const res = await axios.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
    }
  };

  /* ================= MY CARS ================= */
  const fetchMyCars = async (token) => {
    try {
      const res = await axios.get("/cars/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyCars(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= CATEGORIES ================= */
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const res = await axios.get("/cars/categories/counts");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  /* ================= ALL CARS ================= */
  const fetchCars = async (autoType = null) => {
    try {
      setCarsLoading(true);
      setError(null);

      const url = autoType ? `/cars?autoType=${autoType}` : "/cars"; // 👉 http://localhost:5000/api/cars

      const res = await axios.get(url);
      setCars(res.data);
    } catch (err) {
      console.error(err);
      setError("Зарууд ачааллахад алдаа гарлаа");
    } finally {
      setCarsLoading(false);
    }
  };

  /* ================= HANDLERS ================= */
  const handleCategoryClick = (type) => {
    // type should be: "car", "bike", "truck" (not the full name)
    navigate(`/category/${type}`);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);
    fetchMyCars(userData.token);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setMyCars([]);
    localStorage.removeItem("token");
  };

  /* ================= RENDER ================= */
  if (carsLoading) return <div className="p-4">Ачаалж байна...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner */}
      <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-between px-4">
        <h1 className="text-white text-4xl font-bold">CAR MARKET</h1>

        {/* ================= SIDEBAR IN BANNER - RIGHT SIDE ================= */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="bg-white p-2 rounded shadow text-center">
                <p className="font-bold text-xs">{user.name}</p>
                <p className="text-xs text-gray-600">{user.phone}</p>
              </div>

              <button
                className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                onClick={() => navigate("/add-car")}
              >
                Зар нэмэх
              </button>

              <button
                className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                onClick={handleLogout}
              >
                Гарах
              </button>

              {/* MY ADS */}
              <div className="bg-white p-2 rounded shadow text-center">
                <h3 className="font-bold text-xs mb-1">Миний зарууд</h3>
                {myCars.length ? (
                  <div className="text-xs">
                    {myCars.map((car) => (
                      <button
                        key={car._id}
                        className="block text-blue-600 hover:underline text-xs"
                        onClick={() => navigate(`/car/${car._id}`)}
                      >
                        {car.brand} {car.model}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">Зар байхгүй</p>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                className="bg-blue-600 text-white px-4 py-1 rounded text-xs"
                onClick={() => setShowLoginModal(true)}
              >
                Нэвтрэх / Бүртгүүлэх
              </button>

              <div className="bg-white p-2 rounded shadow text-center">
                <h3 className="font-bold text-xs mb-1">Миний зарууд</h3>
                <p className="text-xs text-gray-500">Нэвтэрнэ үү</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* ================= CATEGORIES SECTION ================= */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-2xl font-bold mb-6">Ангилал</h2>

          {/* CATEGORIES */}
          <div className="grid grid-cols-3 gap-4">
            {categoriesLoading ? (
              <p>Категори ачаалж байна...</p>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.type}
                  onClick={() => handleCategoryClick(cat.type)}
                  className="p-4 border rounded cursor-pointer bg-blue-50"
                >
                  <h3 className="font-semibold">{cat.name}</h3>
                  <p className="text-xl font-bold text-blue-600">{cat.count}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ================= CARS SECTION ================= */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-6">Бүх зарууд</h2>

          {/* CAR LIST */}
          <div className="grid grid-cols-1 gap-4">
            {cars.length ? (
              cars.map((car) => (
                <div
                  key={car._id}
                  onClick={() => navigate(`/car/${car._id}`)}
                  className="border rounded shadow hover:shadow-lg cursor-pointer flex"
                >
                  <img
                    src={
                      car.images?.length
                        ? `${API_URL}/uploads/${car.images[0]}`
                        : "https://via.placeholder.com/300x200"
                    }
                    alt=""
                    className="h-64 w-80 object-cover"
                  />

                  <div className="p-4 flex-1">
                    <p className="font-bold text-lg">
                      {car.brand} {car.model}
                    </p>
                    <p className="text-lg text-blue-600 font-bold">
                      ₮{car.price?.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {car.user?.name} · {car.user?.phone}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-4 text-center text-gray-500">
                Зар байхгүй байна
              </p>
            )}
          </div>
        </div>
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default HomePage;
