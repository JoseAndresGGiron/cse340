const accountModel = require("../models/account-model")

const utilities = require(".")
const {
    body,
    validationResult
} = require("express-validator")
const validate = {}

/*  **********************************
 *  Review Validation Rules
 * ********************************* */
validate.reviewRules = () => {
    return [
      // review_text is required and must not be empty
      body("review_text")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Review text cannot be empty."), // Error message if review_text is empty
    ];
  };

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
    const { review_text } = req.body;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      return res.render("account/review-update", {
        errors: errors.array(),
        title: "Update Review",
        nav,
        review_id: req.params.review_id,
        review_text, // Preserve the submitted review text in the form
      });
    }
    next();
  };

module.exports = validate