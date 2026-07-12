const Driver = require("../models/Driver");

exports.createDriver = async (req, res) => {
  try {
    const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber } = req.body;

    if (!name || !licenseNumber || !licenseCategory || !licenseExpiryDate || !contactNumber) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }

    const existing = await Driver.findOne({ licenseNumber: licenseNumber.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: "A driver with this license number already exists" });
    }

    const driver = await Driver.create({ name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber });
    return res.status(201).json({ success: true, message: "Driver registered successfully", driver });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Driver could not be created", error: error.message });
  }
};

exports.getDrivers = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const drivers = await Driver.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: drivers.length, drivers });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not fetch drivers", error: error.message });
  }
};

exports.getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });
    return res.status(200).json({ success: true, driver });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not fetch driver", error: error.message });
  }
};

exports.updateDriver = async (req, res) => {
  try {
    const { status, ...safeUpdates } = req.body; // status locked, same reasoning as Vehicle
    const driver = await Driver.findByIdAndUpdate(req.params.id, safeUpdates, { new: true, runValidators: true });
    if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });
    return res.status(200).json({ success: true, message: "Driver updated", driver });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not update driver", error: error.message });
  }
};

exports.suspendDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });

    if (driver.status === "On Trip") {
      return res.status(400).json({ success: false, message: "Cannot suspend a driver who is currently on a trip" });
    }

    driver.status = "Suspended";
    await driver.save();
    return res.status(200).json({ success: true, message: "Driver suspended", driver });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not suspend driver", error: error.message });
  }
};

exports.reinstateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, { status: "Available" }, { new: true });
    if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });
    return res.status(200).json({ success: true, message: "Driver reinstated", driver });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not reinstate driver", error: error.message });
  }
};

// Bonus feature from the spec: licenses expiring within the next 30 days
exports.getExpiringLicenses = async (req, res) => {
  try {
    const days = Number(req.query.days) || 30;
    const cutoff = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const drivers = await Driver.find({
      licenseExpiryDate: { $lte: cutoff, $gte: new Date() },
    }).sort({ licenseExpiryDate: 1 });

    return res.status(200).json({ success: true, count: drivers.length, drivers });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not fetch expiring licenses", error: error.message });
  }
};
