const ServiceProvider = require("../models/ServiceProvider");

// ================= CREATE PROVIDER =================
exports.createProvider = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "No data provided" });
    }

    const provider = await ServiceProvider.create(req.body);

    res.status(201).json(provider);
  } catch (error) {
    console.error("CREATE PROVIDER ERROR:", error);
    res.status(500).json({
      message: "Failed to create provider",
      error: error.message,
    });
  }
};

// ================= GET ALL PROVIDERS (FINAL + SMART FILTERING) =================
exports.getProviders = async (req, res) => {
  try {
    const { service, location, minPrice, maxPrice, userId, search } =
      req.query;

    let filter = {};

    // SAFE userId check
    if (userId && userId !== "undefined") {
      filter.userId = userId;
    }

    // service filter
    if (service && service.trim() !== "") {
      filter.service = { $regex: service, $options: "i" };
    }

    // location filter
    if (location && location.trim() !== "") {
      filter.location = { $regex: location, $options: "i" };
    }

    // price filter
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice && !isNaN(minPrice)) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice && !isNaN(maxPrice)) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // GLOBAL SMART SEARCH
    if (search && search.trim() !== "") {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { service: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const providers = await ServiceProvider.find(filter)
      .populate("userId", "email role")
      .lean();

    return res.status(200).json(providers);
  } catch (error) {
    console.error("GET PROVIDERS ERROR FULL:", error);

    return res.status(500).json({
      message: "Server error while fetching providers",
      error: error.message,
    });
  }
};

// ================= GET BY ID =================
exports.getProviderById = async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id)
      .populate("userId", "email role")
      .lean();

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    res.json(provider);
  } catch (error) {
    console.error("GET PROVIDER BY ID ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= UPDATE =================
exports.updateProvider = async (req, res) => {
  try {
    const provider = await ServiceProvider.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).lean();

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    res.json(provider);
  } catch (error) {
    console.error("UPDATE PROVIDER ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= DELETE =================
exports.deleteProvider = async (req, res) => {
  try {
    const provider = await ServiceProvider.findByIdAndDelete(req.params.id);

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE PROVIDER ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};