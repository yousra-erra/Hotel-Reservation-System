const express = require('express');

const router = express.Router();

const authMiddleware =
    require('../middlewares/authMiddleware');

const adminMiddleware =
    require('../middlewares/adminMiddleware');

const {
    getRooms,
    addRoom,
    deleteRoom
} = require('../controllers/roomController');

router.get('/', getRooms);

router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    addRoom
);

router.delete(
    '/:id',
    authMiddleware,
    adminMiddleware,
    deleteRoom
);

module.exports = router;