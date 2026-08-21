const Service = require("../models/Service");

exports.searchServices = async (req, res) => {
  try {
    const query = req.query.q;

    const results = await Service.find({
      name: { $regex: query, $options: "i" }
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};