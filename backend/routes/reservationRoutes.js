// Reservation Routes
const express = require('express');
const router = express.Router();

const {
    createReservation,
    getReservations,
    deleteReservation,
    updateReservationStatus
} = require('../controllers/reservationController');

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.post('/', authMiddleware, createReservation);
router.get('/', authMiddleware, getReservations);
router.delete('/:id', authMiddleware, deleteReservation);
router.put('/:id/status', authMiddleware, adminMiddleware, updateReservationStatus);

module.exports = router;