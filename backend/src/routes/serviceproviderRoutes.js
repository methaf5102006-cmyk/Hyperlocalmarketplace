const express = require("express");
const router = express.Router();

const {
  createProvider,
  getProviders,
  getProviderById,
  updateProvider,
  deleteProvider,
} = require("../controllers/ServiceproviderController");

// ================= ROUTES =================
router.post("/", createProvider);

// supports filtering
router.get("/", getProviders);

router.get("/:id", getProviderById);
router.put("/:id", updateProvider);
router.delete("/:id", deleteProvider);

module.exports = router;
