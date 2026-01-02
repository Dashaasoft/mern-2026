import express from "express"; // Express сервер үүсгэхэд хэрэгтэй
import mongoose from "mongoose"; // MongoDB-тэй холбох Mongoose
import cors from "cors"; // Өөр домэйноос ирсэн request-ийг зөвшөөрөх
import dotenv from "dotenv"; // .env файл-аас нууц мэдээлэл уншихад
import authRoutes from "./routes/auth.routes.js";
import carRoutes from "./routes/car.routes.js";

dotenv.config(); // .env файлыг уншина

const app = express(); // Express app үүсгэх
app.use(cors()); // CORS middleware ашиглах
app.use(express.json()); // JSON форматтай request-уудыг унших middleware

// Test route
app.get("/", (req, res) => {
  res.send("Zar MERN Backend is running..."); // Browser эсвэл Postman-д шалгах зориулалттай route
});
// 4️⃣ Routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
// ------------- MongoDB Atlas холболт -------------
mongoose
  .connect(process.env.MONGO_URI) // .env доторх MONGO_URI ашиглана
  .then(() => console.log("MongoDB Atlas connected (zar DB)")) // Амжилттай холболт бол console-д гаргана
  .catch((err) => console.log(err)); // Алдаа гарвал console-д хэвлэнэ
// --------------------------------------------------

// Сервер ажиллуулах
const PORT = process.env.PORT || 5000; // .env-д PORT байвал ашиглах, үгүй бол 5000-д ажиллуулна
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Console-д сервер ажиллаж байгааг харуулах
});
