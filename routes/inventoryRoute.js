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
router.get("/", Util.checkAccountType, Util.handleErrors(invController.showManagementView));

// Route to serve the add-classification view
router.get("/add-classification", Util.checkAccountType, Util.handleErrors(invController.buildAddClassificationView));

// Route to handle add-classification form submission with validation middleware
router.post("/add-classification",
    Util.checkAccountType,
    validate.classificationRules(),
    validate.checkClassificationData,
    Util.handleErrors(invController.addClassification));

// Route to serve the add inventory view
router.get("/add-inventory", Util.checkAccountType, Util.handleErrors(invController.buildAddInventory));

//Route to handle the add-inventory form submission with validation middleware
router.post("/add-inventory",
    Util.checkAccountType,
    validate.inventoryRules(),
    validate.checkInventoryData,
    Util.handleErrors(invController.addItemtoInventory));

//Route to serve the getInventory by classification ID on the Management view
router.get("/getInventory/:classification_id", Util.handleErrors(invController.getInventoryJSON))

//Route to serve the Modify inventory item from the management view
router.get("/edit/:inv_id", Util.checkAccountType, Util.handleErrors(invController.editInventoryView));

//Route to handle the incoming request from the Modify inventory form
router.post("/update/", Util.checkAccountType, validate.inventoryRules(), validate.checkInventoryData, Util.handleErrors(invController.updateInventory));

//Route to serve the Delete inventory item from the management view
router.get("/delete/:inv_id", Util.checkAccountType, Util.handleErrors(invController.deleteInventoryView));

//Route to handle the incoming request from the Modify inventory form
router.post("/remove/", Util.checkAccountType, Util.handleErrors(invController.deleteInventory));

module.exports = router;