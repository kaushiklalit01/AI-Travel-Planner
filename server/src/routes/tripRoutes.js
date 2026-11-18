const express = require("express");
const router = express.Router();

const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  duplicateTrip,
  deleteTrip,
  refineTrip,
  exportTripPdf,
  inviteTripMember,
  getTripMembers,
} = require("../controllers/tripController");

const { optionalAuth } = require("../middleware/authMiddleware");

// Trips collection routes
router.get("/", optionalAuth, getTrips);
router.post("/", optionalAuth, createTrip);

// Individual trip routes
router.get("/:id", optionalAuth, getTripById);
router.put("/:id", optionalAuth, updateTrip);
router.post("/:id/duplicate", optionalAuth, duplicateTrip);
router.post("/:id/refine", optionalAuth, refineTrip);
router.delete("/:id", optionalAuth, deleteTrip);

// Export & Collaboration routes
router.get("/:id/export/pdf", exportTripPdf);
router.post("/:id/members", optionalAuth, inviteTripMember);
router.get("/:id/members", optionalAuth, getTripMembers);

module.exports = router;
