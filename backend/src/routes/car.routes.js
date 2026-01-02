import express from "express";
import {
  createCarAd,
  getCarAds,
  getMyCarAds,
  updateCarAd,
  deleteCarAd,
  getCategoryCounts,
  getBrandsByCategory,
  getCarAdById,
} from "../controllers/car.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// ===== STATIC ROUTES =====
router.get("/categories/counts", getCategoryCounts);
router.get("/brands/:autoType", getBrandsByCategory);
router.get("/my", verifyToken, getMyCarAds);

// ===== PUBLIC =====
router.get("/", getCarAds);
router.get("/:id", getCarAdById); // ✅ ЭНД БАЙРЛАНА

// ===== PROTECTED =====
router.post("/", verifyToken, createCarAd);
router.put("/:id", verifyToken, updateCarAd);
router.delete("/:id", verifyToken, deleteCarAd);

export default router;
