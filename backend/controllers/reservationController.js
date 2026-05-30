// Reservation Controller
const db = require('../config/db');

exports.createReservation = (req, res) => {
    const { user_id, room_id, check_in, check_out, status } = req.body;

    const checkReservationSql = `
        SELECT * FROM reservations
        WHERE room_id = ?
        AND status != 'cancelled'
        AND (
            (check_in <= ? AND check_out > ?)
            OR
            (check_in < ? AND check_out >= ?)
            OR
            (check_in >= ? AND check_out <= ?)
        )
    `;

    db.query(
        checkReservationSql, [
            room_id,
            check_in, check_in,
            check_out, check_out,
            check_in, check_out
        ],
        (err, results) => {
            if (err) return res.status(500).json(err);

            if (results.length > 0) {
                return res.status(400).json({
                    message: 'Chambre déjà réservée pour cette période'
                });
            }

            const sql = `
                INSERT INTO reservations (user_id, room_id, check_in, check_out, status)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(sql, [user_id, room_id, check_in, check_out, status], (err) => {
                if (err) return res.status(500).json(err);
                res.status(201).json({ message: 'Reservation created successfully' });
            });
        }
    );
};

exports.getReservations = (req, res) => {

    // Si admin → toutes les réservations
    // Si client → seulement ses réservations
    const isAdmin = req.user.role === 'admin';

    const sql = isAdmin ?
        `
            SELECT reservations.*, users.name, rooms.room_number
            FROM reservations
            JOIN users ON reservations.user_id = users.id
            JOIN rooms ON reservations.room_id = rooms.id
          ` :
        `
            SELECT reservations.*, users.name, rooms.room_number
            FROM reservations
            JOIN users ON reservations.user_id = users.id
            JOIN rooms ON reservations.room_id = rooms.id
            WHERE reservations.user_id = ?
          `;

    const params = isAdmin ? [] : [req.user.id];

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.deleteReservation = (req, res) => {
    const { id } = req.params;
    const isAdmin = req.user.role === 'admin';

    // Admin peut supprimer n'importe quelle réservation
    // Client peut supprimer seulement la sienne
    const checkSql = isAdmin ?
        `SELECT * FROM reservations WHERE id = ?` :
        `SELECT * FROM reservations WHERE id = ? AND user_id = ?`;

    const checkParams = isAdmin ? [id] : [id, req.user.id];

    db.query(checkSql, checkParams, (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length === 0) {
            return res.status(403).json({
                message: 'Réservation introuvable ou non autorisée'
            });
        }

        db.query(`DELETE FROM reservations WHERE id = ?`, [id], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Reservation deleted successfully' });
        });
    });
};

exports.updateReservationStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const sql = `UPDATE reservations SET status = ? WHERE id = ?`;

    db.query(sql, [status, id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Status updated successfully' });
    });
};