const express = require("express");
const serviceController = require("../../controllers/servicesControllers/serviceController");
const { setFilter , addlocations } = require("../../controllers/handlerFactory");
const { protected, isAdmin } = require("../../utils/middleware/protected");
const upload = require('../../controllers/multiController');

const router = express.Router();

router.get("/", setFilter, serviceController.getServices);
router.get("/all", setFilter, serviceController.getWithDatesServices);

router.post(
  "/",
  protected,
  isAdmin,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  addlocations,
  serviceController.AddService
);

router.delete("/:id", protected, isAdmin, serviceController.deleteService);
router.put(
    '/:id',
    protected,
    isAdmin,
    upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'images', maxCount: 5 }]), 
    addlocations,
    serviceController.updateService
  );

module.exports = router;
