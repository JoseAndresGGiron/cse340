const inventoryModel = require("../models/inventory-model");
const utilities = require(".");
const {
    body,
    validationResult
} = require("express-validator");
const validate = {};

/* **********************************
 * Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a classification name.")
        .custom(async (value) => {
            if (/[^\w]/.test(value)) {
                throw new Error("Classification name must not contain spaces or special characters.");
            }
            const nameExists = await inventoryModel.checkExistingClassificationName(value);
            if (nameExists) {
                throw new Error("Classification name already exists. Please use a different name.");
            }
            return true;
        }),
    ];
};

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const {
        classification_name
    } = req.body;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/add-classification", {
            errors: errors.array(),
            title: "Add New Classification",
            nav,
            classification_name,
        });
        return;
    }
    next();
};

/* **********************************
 * Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
        body("inv_make").trim().escape().notEmpty().withMessage("Please provide a make."),
        body("inv_model").trim().escape().notEmpty().withMessage("Please provide a model."),
        body("inv_description").trim().escape().notEmpty().withMessage("Please provide a description."),
        body("inv_image").trim().escape().notEmpty().withMessage("Please provide an image path."),
        body("inv_thumbnail").trim().escape().notEmpty().withMessage("Please provide a thumbnail path."),
        body("inv_price").trim().escape().isNumeric().withMessage("Please provide a valid price."),
        body("inv_year").isNumeric().withMessage("Please provide a valid year."),
        body("inv_miles").isNumeric().withMessage("Please provide a valid mileage."),
        body("inv_color").trim().escape().notEmpty().withMessage("Please provide a color."),
        body("classification_id").isNumeric().withMessage("Please choose a classification.")
    ];
};

/* ******************************
 * Check data and return errors or continue to add inventory
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
    const {
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    } = req.body;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        const classificationList = await utilities.buildClassificationList(classification_id);
        return res.render("inventory/add-inventory", {
            errors: errors.array(),
            title: "Add New Vehicle",
            nav,
            classificationList,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classification_id,
        });
    }
    next();
};


module.exports = validate;