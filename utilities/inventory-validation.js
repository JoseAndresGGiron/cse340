const utilities = require(".");

const { body, validationResult } = require("express-validator");

const validate = {};

/* **********************************
 * Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
        // classification_name is required and must not contain spaces or special characters
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a classification name.")
        .custom((value) => {
            // Check if the value contains any spaces or special characters
            if (/[^\w]/.test(value)) {
                throw new Error("Classification name must not contain spaces or special characters.");
            }
            return true;
        }),
    ];
};

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body;
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

module.exports = validate;
