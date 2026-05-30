// Hotel Reservation System - Backend APIconst express = require('express');
const cors = require('cors');

const helmet = require('helmet');

require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hotel Reservation API Running');
});


app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});