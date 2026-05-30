const db = require('../config/db');

exports.getRooms = (req, res) => {
    const sql = 'SELECT * FROM rooms';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.addRoom = (req, res) => {
    const { room_number, type, price, available } = req.body;

    // Vérifier si le numéro existe déjà
    db.query(
        'SELECT * FROM rooms WHERE room_number = ?', [room_number],
        (err, results) => {
            if (err) return res.status(500).json(err);

            if (results.length > 0) {
                return res.status(400).json({
                    message: 'Ce numéro de chambre existe déjà'
                });
            }

            const sql = `
                INSERT INTO rooms (room_number, type, price, available)
                VALUES (?, ?, ?, ?)
            `;

            db.query(sql, [room_number, type, price, available], (err) => {
                if (err) return res.status(500).json(err);
                res.status(201).json({ message: 'Room added successfully' });
            });
        }
    );
};

exports.deleteRoom = (req, res) => {
    const sql = 'DELETE FROM rooms WHERE id = ?';
    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Room deleted' });
    });
};