import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { API_URL } from "../config/api";

const CarDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const res = await axios.get(`/cars/${id}`);
      setCar(res.data);
    } catch (err) {
      console.error(err);
      setError("Зарын мэдээлэл олдсонгүй");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Ачаалж байна...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 underline"
      >
        ← Буцах
      </button>

      {/* Images */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {car.images?.map((img, i) => (
          <img
            key={i}
            src={img.startsWith("http") ? img : `${API_URL}/uploads/${img}`}
            className="w-full h-64 object-cover rounded"
          />
        ))}
      </div>

      {/* Info */}
      <h1 className="text-3xl font-bold mb-2">
        {car.brand} {car.model}
      </h1>

      <p className="text-2xl text-blue-600 font-bold mb-4">
        ₮{car.price?.toLocaleString()}
      </p>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <p>Үйлдвэрлэсэн он: {car.manufacturedYear}</p>
        <p>Орж ирсэн он: {car.importedYear}</p>
        <p>Явсан км: {car.mileage?.toLocaleString()}</p>
        <p>Түлш: {car.fuelType}</p>
        <p>Хурдны хайрцаг: {car.transmission}</p>
        <p>Хөтлөгч: {car.driveType}</p>
        <p>Өнгө: {car.color}</p>
        <p>Кузов: {car.bodyType}</p>
      </div>

      <div className="mt-6">
        <h3 className="font-bold mb-2">Тайлбар</h3>
        <p>{car.description}</p>
      </div>

      <div className="mt-6 bg-gray-100 p-4 rounded">
        <p className="font-bold">Холбогдох</p>
        <p>{car.user?.name}</p>
        <p>{car.user?.phone}</p>
      </div>
    </div>
  );
};

export default CarDetailPage;
