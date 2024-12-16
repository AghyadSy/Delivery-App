const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');


// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route (example: Get user profile)
router.get('/profile', protect, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'User profile retrieved successfully!',
        data: req.user,
    });
});

module.exports = router;
