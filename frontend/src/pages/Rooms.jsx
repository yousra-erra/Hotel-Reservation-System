 // Rooms Page 
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import simple from '../images/simple.jpeg';
import double from '../images/double.jpeg';
import suite from '../images/suite.jpeg';
import suiteDeLuxe from '../images/suiteDeLuxe.jpeg';
import { toast } from 'react-toastify';

function Rooms() {

    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [search, setSearch] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get('https://hotel-reservation-api-gio.vercel.app/api/rooms');
            setRooms(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getRoomImage = (type) => {
        const roomType = type.toLowerCase();
        if (roomType.includes('simple')) return simple;
        else if (roomType.includes('suite de luxe')) return suiteDeLuxe;
        else if (roomType.includes('suite')) return suite;
        else if (roomType.includes('double')) return double;
        else return simple;
    };

    const handleReserveClick = (room) => {
        const user = localStorage.getItem('user');
        if (!user) {
            setShowPopup(true);
            return;
        }
        setSelectedRoom(room);
    };

    const confirmReservation = async () => {
        if (!checkIn || !checkOut) {
            toast.error('Veuillez choisir les dates');
            return;
        }
        if (checkIn >= checkOut) {
            toast.error('La date de départ doit être après la date d\'arrivée');
            return;
        }
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('token');
            await axios.post(
                'https://hotel-reservation-api-gio.vercel.app/api/reservations',
                {
                    user_id: user.id,
                    room_id: selectedRoom.id,
                    check_in: checkIn,
                    check_out: checkOut,
                    status: 'pending'
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Réservation effectuée avec succès !');
            setSelectedRoom(null);
            setCheckIn('');
            setCheckOut('');
        } catch (error) {
            toast.error('Chambre déjà réservée pour cette période');
        }
    };

    const filteredRooms = rooms.filter((room) =>
        room.type.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="rooms-page">
            <h1>Nos chambres</h1>

            <input
                type="text"
                placeholder="Type de salle de recherche..."
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="rooms-grid">
                {filteredRooms.map((room) => (
                    <div className="room-card" key={room.id}>
                        <img src={getRoomImage(room.type)} alt="Room" />
                        <h2>Chambre{room.room_number}</h2>
                        <p>Type : {room.type}</p>
                        <p>Prix : {parseFloat(room.price).toFixed(2)} MAD</p>
                        <p>{room.available ? 'Disponible' : 'Non disponible'}</p>
                        <button
                            onClick={() => handleReserveClick(room)}
                            disabled={!room.available}
                            style={{
                                background: room.available ? 'black' : '#aaa',
                                cursor: room.available ? 'pointer' : 'not-allowed'
                            }}
                        >
                            {room.available ? 'Réserve' : 'Non disponible'}
                        </button>
                    </div>
                ))}
            </div>

            {/* Popup réservation */}
            {selectedRoom && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <button className="close-btn" onClick={() => setSelectedRoom(null)}>X</button>
                        <h2>Réserver : Chambre {selectedRoom.room_number}</h2>
                        <p>{selectedRoom.type} — {parseFloat(selectedRoom.price).toFixed(2)} MAD</p>
                        <div className="date-group">
                            <label>Date d'arrivée</label>
                            <input
                                type="date"
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                            />
                        </div>
                        <div className="date-group">
                            <label>Date de départ</label>
                            <input
                                type="date"
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                            />
                        </div>
                        <div className="popup-buttons">
                            <button onClick={confirmReservation}>Confirmer</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Popup login requis */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <button className="close-btn" onClick={() => setShowPopup(false)}>X</button>
                        <h2>Authentification requise</h2>
                        <p>Pour réserver une chambre, vous devez vous connecter ou vous inscrire.</p>
                        <div className="popup-buttons">
                            <button onClick={() => navigate('/login')}>Connexion</button>
                            <button onClick={() => navigate('/register')}>Registre</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Rooms;