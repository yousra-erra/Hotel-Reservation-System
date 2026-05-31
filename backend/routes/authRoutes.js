// Auth Routes
const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    getUsers,
    deleteUser
} = require('../controllers/authController');

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', authMiddleware, adminMiddleware, getUsers);
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUser);

module.exports = router;