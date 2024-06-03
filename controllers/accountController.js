//w5 learning activities
const jwt = require("jsonwebtoken")
require("dotenv").config()

//W4 team activity paswword
const bcrypt = require("bcryptjs")

// Require the utilities module
const utilities = require("../utilities");
// Require the account model
const accountModel = require("../models/account-model");

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  // Get navigation links
  let nav = await utilities.getNav();

  // Render the login view
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  // Get navigation links
  let nav = await utilities.getNav();

  // Render the registration view
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

// Process Registration function
async function registerAccount(req, res) {
  // Get navigation links
  let nav = await utilities.getNav();

  // Extract registration data from request body
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password
  } = req.body;

  // Hash the password before storing - w4 team activity
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  // Attempt to register the account
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    //account_password commented out as part of w4 team activity, see new variable below
    hashedPassword
  );

  // Check registration result and render appropriate view
  if (regResult) {
    console.log(regResult)
    // If registration successful, render login view with success message
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    // If registration failed, render registration view with error message
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const {
    account_email,
    account_password
  } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 3600
      })
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 3600 * 1000
        })
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000
        })
      }
      return res.redirect("/account/")
    }
  } catch (error) {
    return new Error('Access Forbidden')
  }
}

// Process account management view
async function buildAccountManagement(req, res, next) {
  try {
    // Assuming you store accountId in session
    const account_id = res.locals.accountData.account_id;
    console.log('account ID' + account_id);

    // Fetch account data
    //const accountData = await accountModel.getAccountById(account_id);

    // Fetch reviews written by the logged-in user
    const reviews = await accountModel.getAccountReviews(account_id);

    // Fetch navigation data
    const nav = await utilities.getNav();

    // Render the account management view with account data, reviews, and navigation
    res.render("account/management", {
      title: "Account Management",
      nav,
      //accountData,
      reviews,
      errors: null,
    });
  } catch (error) {
    console.error('Error building account management:', error);
    // Handle the error appropriately, maybe redirect to an error page
    res.status(500).send('Internal Server Error');
  }
}

//Process the update account view
async function buildUpdateAccount(req, res, next) {
  const account_id = parseInt(req.params.account_id);
  const accountData = await accountModel.getAccountById(account_id);
  let nav = await utilities.getNav();

  res.render("account/update", {
    title: "Update Account Information",
    nav,
    errors: null,
    accountData,
  });
}

//Process the Update Account Request
async function updateAccount(req, res, next) {
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email
  } = req.body;
  const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email);
  if (updateResult) {
    req.flash("notice", "Account information updated successfully.");
    res.redirect("/account");
  } else {
    req.flash("notice", "Account update failed. Please try again.");
    res.redirect(`/account/update/${account_id}`);
  }
}

//Process the Password change Request
async function changePassword(req, res, next) {
  const {
    account_id,
    account_password
  } = req.body;
  const hashedPassword = await bcrypt.hash(account_password, 10);
  const updateResult = await accountModel.updatePassword(account_id, hashedPassword);
  if (updateResult) {
    req.flash("notice", "Password updated successfully.");
    res.redirect("/account");
  } else {
    req.flash("notice", "Password update failed. Please try again.");
    res.redirect(`/account/update/${account_id}`);
  }
}

// Function to show the update review view
async function showUpdateReview(req, res, next) {
  const review_id = parseInt(req.params.review_id);
  let nav = await utilities.getNav();
  try {
    // Fetch review data by review_id
    const reviewData = await accountModel.getReviewById(review_id);
    if (!reviewData) {
      // Handle case where review is not found
      return res.status(404).send('Review not found');
    }
    // Prepare data for rendering
    const reviewDate = new Date(reviewData.review_date).toLocaleDateString(); // Format date if needed
    res.render('./account/review-update', {
      title: 'Update Review',
      nav,
      errors: null,
      review_id: reviewData.review_id,
      review_text: reviewData.review_text,
      review_date: reviewDate
    });
  } catch (error) {
    console.error('Error displaying update review view:', error);
    res.status(500).send('Internal Server Error');
  }
}

// Function to handle updating a review
async function updateReview(req, res, next) {
  try {
    const review_id = parseInt(req.params.review_id);
    const {
      review_text
    } = req.body; 

    // Update review in the database
    const updateResult = await accountModel.updateReview(review_id, review_text);

    // Check if the update was successful
    if (updateResult) {
      // Redirect back to the account management view with a success message
      req.flash('Notice', 'Review updated successfully');
      res.redirect('/account');
    } else {
      // If update failed, show an error message
      req.flash('error', 'Failed to update review. Please try again.');
      res.redirect(`/account/review-update/${review_id}`);
    }
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).send('Internal Server Error');
  }
}

// Function to show the delete review confirmation view
async function showDeleteReview(req, res, next) {
  const review_id = parseInt(req.params.review_id);
  let nav = await utilities.getNav();
  try {
    // Fetch review data by review_id
    const reviewData = await accountModel.getReviewById(review_id);
    if (!reviewData) {
      // Handle case where review is not found
      return res.status(404).send('Review not found');
    }
    // Prepare data for rendering
    const reviewDate = new Date(reviewData.review_date).toLocaleDateString(); // Format date if needed
    res.render('./account/review-delete', {
      title: 'Delete Review',
      nav,
      errors: null,
      review_id: reviewData.review_id,
      review_text: reviewData.review_text,
      review_date: reviewDate
    });
  } catch (error) {
    console.error('Error displaying delete review confirmation view:', error);
    res.status(500).send('Internal Server Error');
  }
}

// Function to handle deleting a review
async function deleteReview(req, res, next) {
  try {
    const review_id = parseInt(req.params.review_id);
    // Delete review from the database
    const deleteResult = await accountModel.deleteReview(review_id);

    // Check if the delete was successful
    if (deleteResult) {
      // Redirect back to the account management view with a success message
      req.flash("Notice", 'Review deleted successfully');
      res.redirect('/account');
    } else {
      // If delete failed, show an error message
      req.flash('error', 'Failed to delete review. Please try again.');
      res.redirect('/account');
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).send('Internal Server Error');
  }
}


// Export the buildLogin function
module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  buildUpdateAccount,
  updateAccount,
  changePassword,
  showUpdateReview,
  updateReview,
  showDeleteReview,
  deleteReview
};