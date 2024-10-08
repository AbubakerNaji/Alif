const express = require("express");
const driverController = require("../controllers/driverController");
const { setFilter, addlocations } = require("../controllers/handlerFactory");
//multi
const upload = require("../controllers/multiController");
const { protected, isAdmin } = require("../utils/middleware/protected");
const router = express.Router();

router.get("/", setFilter, driverController.getDrivers);
router.get(
  "/all",

  setFilter,
  driverController.getWithDatesDrivers
);

router.post(
  "/",
  protected,
  isAdmin,
  upload.single("image"),
  addlocations,
  driverController.createDriver
);
router.delete("/:id", protected, isAdmin, driverController.deleteDriver);

router.put(
  "/:id",
  protected,
  isAdmin,
  upload.single("image"),
  addlocations,

  driverController.updateDriver
);

module.exports = router;
