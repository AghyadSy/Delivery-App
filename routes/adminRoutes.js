const express = require('express');
const router = express.Router();
const { getUsers, updateUser, deleteUser } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');
const { createAdmin } = require('../controllers/userController');


router.post('/create', protect, admin, createAdmin);

// Get all users
router.get('/users', protect, admin, getUsers);

// Edit user details
router.patch('/users/:id', protect, admin, updateUser);

// Delete a user
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
