import mongoose from "mongoose";

const carAdSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Хэн оруулсан
    category: { type: String, default: "Автомашин" }, // Зөвхөн Автомашин
    autoType: {
      type: String,
      enum: [
        "Автомашин зарна",
        "Ачааны машин",
        "Авто түрээслүүлнэ",
        "Мотоцикл",
        "Авто дугуй",
        "Авто сэлбэг",
      ],
      required: true,
    },

    brand: { type: String, required: true },
    model: { type: String, required: true },
    manufacturedYear: Number,
    importedYear: Number,
    mileage: Number,
    fuelType: {
      type: String,
      enum: ["Бензин", "Дизель", "Hybrid", "Цахилгаан"],
    },
    transmission: { type: String, enum: ["Автомат", "Механик"] },
    driveType: { type: String, enum: ["FWD", "RWD", "AWD", "4WD"] },

    color: String,
    interiorColor: String,
    doors: Number,
    steering: String,
    bodyType: String,

    price: { type: Number, required: true },
    priceNegotiable: { type: Boolean, default: false },

    images: { type: [String], required: true }, // Cloudinary-д upload хийх
    youtubeUrl: String,
    tiktokUrl: String,
    videoUrl: String,

    description: { type: String, maxlength: 10000 },

    contactType: { type: String, enum: ["Утас", "Утас, чат"], default: "Утас" },
    status: { type: String, default: "active" }, // active / sold
  },
  { timestamps: true }
);

export default mongoose.model("CarAd", carAdSchema);
