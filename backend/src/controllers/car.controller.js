import CarAd from "../models/CarAd.js";

// Зар нэмэх
export const createCarAd = async (req, res) => {
  try {
    const { autoType, brand, model, price, images } = req.body;

    if (
      !autoType ||
      !brand ||
      !model ||
      !price ||
      !images ||
      images.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Шаардлагатай талбар дутуу байна" });
    }

    // Ижил зар шалгах
    const exists = await CarAd.findOne({
      user: req.user.id,
      brand,
      model,
      price,
    });

    if (exists) return res.status(400).json({ message: "Ижил зар байна" });

    const carAd = await CarAd.create({ ...req.body, user: req.user.id });
    res.status(201).json(carAd);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Бүх зар харах
export const getCarAds = async (req, res) => {
  try {
    const { autoType, brand } = req.query;
    const filter = { status: "active" };

    if (autoType) {
      filter.autoType = autoType;
    }

    if (brand) {
      filter.brand = brand;
    }

    const cars = await CarAd.find(filter)
      .populate("user", "phone name")
      .sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Өөрийн зарууд
export const getMyCarAds = async (req, res) => {
  try {
    const cars = await CarAd.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Зар засварлах
export const updateCarAd = async (req, res) => {
  try {
    const car = await CarAd.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car зар олдсонгүй" });

    // Зөвхөн эзэн хэрэглэгч засварлах
    if (car.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Энэ зар засварлах эрхгүй байна" });
    }

    const updatedCar = await CarAd.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // шинэчилсэн object-г буцаана
    });

    res.json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Зар устгах
export const deleteCarAd = async (req, res) => {
  try {
    const car = await CarAd.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car зар олдсонгүй" });

    // Зөвхөн эзэн хэрэглэгч устгах
    if (car.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Энэ зар устгах эрхгүй байна" });
    }

    await car.deleteOne();
    res.json({ message: "Car зар амжилттай устлаа" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Категориар зарын тоог тоолох
export const getCategoryCounts = async (req, res) => {
  try {
    const counts = await CarAd.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: "$autoType", count: { $sum: 1 } } },
    ]);

    // Категориуудыг нэрээр орлуулах
    const categoryNames = {
      "Автомашин зарна": "Автомашин",
      "Авто сэлбэг": "Авто сэлбэг, туслах хэрэгслүүд",
      "Ачааны машин": "Ачааны машин, автобус, хүнд механизм",
      "Авто дугуй": "Авто дугуй, обуд",
      "Авто түрээслүүлнэ": "Авто түрээслүүлнэ",
      Мотоцикл: "Мотоцикл, мопед, суррон",
    };

    // Бүх категоринуудыг үүсгэх (0 count-тэй)
    const allCategories = Object.keys(categoryNames).map((type) => {
      const found = counts.find((item) => item._id === type);
      return {
        name: categoryNames[type],
        count: found ? found.count : 0,
        type: type,
      };
    });

    // Count-ээр буурах эрэмбэлэх
    allCategories.sort((a, b) => b.count - a.count);

    res.json(allCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ангилалаар брэндүүдийг авах
export const getBrandsByCategory = async (req, res) => {
  try {
    const { autoType } = req.params;
    const brands = await CarAd.aggregate([
      { $match: { status: "active", autoType: autoType } },
      { $group: { _id: "$brand", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const result = brands.map((item) => ({
      brand: item._id,
      count: item.count,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
