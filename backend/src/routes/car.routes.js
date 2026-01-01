import express from "express";
import {
  createCarAd,
  getCarAds,
  getMyCarAds,
  updateCarAd,
  deleteCarAd,
  getCategoryCounts,
  getBrandsByCategory,
} from "../controllers/car.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ Категориар зарын тоог авах (ДАРААЛАЛ ЧУХАЛ: /:id-ээс өмнө байх ёстой)
router.get("/categories/counts", getCategoryCounts);

// ✅ Ангилалаар брэндүүдийг авах
router.get("/brands/:autoType", getBrandsByCategory);

// ✅ Өөрийн заруудыг харах (/:id-ээс өмнө байх ёстой)
router.get("/my", verifyToken, getMyCarAds);

// ✅ Бүх зар харах
router.get("/", getCarAds);

// ✅ Шинэ зар нэмэх
router.post("/", verifyToken, createCarAd);

// ✅ Зар засварлах (зөвхөн эзэн өөрөө засна)
router.put("/:id", verifyToken, updateCarAd);

// ✅ Зар устгах (зөвхөн эзэн өөрөө устгана)
router.delete("/:id", verifyToken, deleteCarAd);

export default router;
