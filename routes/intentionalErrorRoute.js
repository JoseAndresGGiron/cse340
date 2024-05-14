// In your routes file (e.g., routes/static.js)
const express = require('express');
const router = express.Router();

// Define the route handler
router.get('/error/trigger-error', (req, res, next) => {
    // Trigger intentional error here
    next(new Error('Intentional error to test error handling'));
});

module.exports = router;
