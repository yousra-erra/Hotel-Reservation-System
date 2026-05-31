//  Auth Controller 
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async(req, res) => {
    try {
        let { name, email, password } = req.body;

        name = name ? name.trim() : '';
        email = email ? email.trim() : '';
        password = password ? password.trim() : '';

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must contain at least 6 characters' });
        }

        const checkUserSql = 'SELECT * FROM users WHERE email = ?';

        db.query(checkUserSql, [email], async(err, results) => {
            if (err) return res.status(500).json(err);

            if (results.length > 0) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;

            db.query(sql, [name, email, hashedPassword], (err, result) => {
                if (err) return res.status(500).json(err);

                const token = jwt.sign({ id: result.insertId, role: 'client' },
                    process.env.JWT_SECRET, { expiresIn: '7d' }
                );

                res.status(201).json({
                    message: 'Registration successful',
                    token,
                    user: { id: result.insertId, name, email, role: 'client' }
                });
            });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const sql = 'SELECT * FROM users WHERE email = ?';

    db.query(sql, [email], async(err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role },
            process.env.JWT_SECRET, { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    });
};

exports.getUsers = (req, res) => {
    const sql = 'SELECT id, name, email, role FROM users';

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.deleteUser = (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM users WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json({ message: 'Utilisateur supprimé avec succès' });
    });
};