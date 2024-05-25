//W4 Week Assignment 05/21/2024 20:11pm
const validate = require("../utilities/inventory-validation")

// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const Util = require("../utilities");

// Route to build inventory by classification view W3 - Inventory Delivery By Classification Activity
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId));

//Route to build single view of a specific inventory item
router.get("/detail/:inventoryId", Util.handleErrors(invController.viewInventoryItemDetails));

// Route to serve the management view
router.get("/", Util.handleErrors(invController.showManagementView));

// Route to serve the add-classification view
router.get("/add-classification", Util.handleErrors(invController.buildAddClassificationView));

// Route to handle add-classification form submission with validation middleware
router.post("/add-classification",
    validate.classificationRules(),
    validate.checkClassificationData,
    Util.handleErrors(invController.addClassification));

// Route to serve the add inventory view
router.get("/add-inventory", Util.handleErrors(invController.buildAddInventory));

//Route to handle the add-inventory form submission with validation middleware
router.post("/add-inventory",
    validate.inventoryRules(),
    validate.checkInventoryData,
    Util.handleErrors(invController.addItemtoInventory));

//Route to serve the getInventory by classification ID on the Management view
router.get("/getInventory/:classification_id", Util.handleErrors(invController.getInventoryJSON))

module.exports = router;