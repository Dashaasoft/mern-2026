import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

const CategoryDetailsPage = () => {
  const { autoType } = useParams();
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [cars, setCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  // Get brands for this category
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setBrandsLoading(true);
        const res = await axios.get(`/cars/brands/${autoType}`);
        setBrands(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setBrandsLoading(false);
      }
    };

    // Fetch all cars for this category on load
    const fetchAllCars = async () => {
      try {
        setCarsLoading(true);
        const res = await axios.get(`/cars?autoType=${autoType}`);
        setCars(res.data);
        setSelectedBrand(null);
      } catch (err) {
        console.error(err);
      } finally {
        setCarsLoading(false);
      }
    };

    fetchBrands();
    fetchAllCars();
  }, [autoType]);

  // Get cars for selected brand or all cars in category
  const fetchCars = async (brand = null) => {
    try {
      setCarsLoading(true);
      let url = `/cars?autoType=${autoType}`;
      if (brand) {
        url += `&brand=${brand}`;
      }
      const res = await axios.get(url);
      setCars(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCarsLoading(false);
    }
  };

  // Handle brand click
  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
    fetchCars(brand);
  };

  // Handle "View All" button
  const handleViewAll = () => {
    setSelectedBrand(null);
    fetchCars();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 py-6">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate("/")}
            className="text-white mb-4 hover:underline"
          >
            ← Буцах
          </button>
          <h1 className="text-white text-3xl font-bold">
            {autoType === "car" && "Автомашин"}
            {autoType === "bike" && "Мотоцикл"}
            {autoType === "truck" && "Ачааны машин"}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Brands Section */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-2xl font-bold mb-6">Брэндүүд</h2>

          {brandsLoading ? (
            <p>Брэнд ачаалж байна...</p>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap gap-2">
                {brands.map((brand) => (
                  <button
                    key={brand._id}
                    onClick={() => handleBrandClick(brand.brand)}
                    className={`px-3 py-1 rounded transition text-sm ${
                      selectedBrand === brand.brand
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-blue-100"
                    }`}
                  >
                    {brand.brand} {brand.count.toLocaleString()}
                  </button>
                ))}
              </div>

              <button
                onClick={handleViewAll}
                className={`px-6 py-2 rounded font-semibold transition ${
                  selectedBrand === null
                    ? "bg-blue-600 text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Бүгдийг харах
              </button>
            </>
          )}
        </div>

        {/* Cars Section */}
        {(carsLoading || cars.length > 0) && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-6">
              {selectedBrand ? `${selectedBrand} машинууд` : "Бүх машинууд"}
            </h2>

            {carsLoading ? (
              <p>Машинууд ачаалж байна...</p>
            ) : cars.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {cars.map((car) => (
                  <div
                    key={car._id}
                    onClick={() => navigate(`/car/${car._id}`)}
                    className="border rounded shadow hover:shadow-lg cursor-pointer flex"
                  >
                    <img
                      src={
                        car.images?.length
                          ? `http://localhost:5000/uploads/${car.images[0]}`
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
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">Машин байхгүй байна</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetailsPage;
