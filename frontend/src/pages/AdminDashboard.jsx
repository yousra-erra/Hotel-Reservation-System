// Admin Dashboard
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import simple from '../images/simple.jpeg';
import double from '../images/double.jpeg';
import suite from '../images/suite.jpeg';
import suiteDeLuxe from '../images/suiteDeLuxe.jpeg';

function AdminDashboard() {

    const [rooms, setRooms] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [users, setUsers] = useState([]);
    const [roomNumber, setRoomNumber] = useState('');
    const [roomType, setRoomType] = useState('Simple');
    const [roomPrice, setRoomPrice] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [confirmCancelReservation, setConfirmCancelReservation] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchRooms();
        fetchReservations();
        fetchUsers();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get('https://hotel-reservation-api-gio.vercel.app/api/rooms');
            setRooms(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchReservations = async () => {
        try {
            const response = await axios.get(
                'https://hotel-reservation-api-gio.vercel.app/api/reservations',
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setReservations(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(
                'https://hotel-reservation-api-gio.vercel.app/api/auth/users',
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getRoomImage = (type) => {
        const t = type.toLowerCase();
        if (t.includes('suite de luxe')) return suiteDeLuxe;
        if (t.includes('suite')) return suite;
        if (t.includes('double')) return double;
        return simple;
    };

    const addRoom = async () => {
        if (!roomNumber || !roomPrice) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }
        try {
            await axios.post(
                'https://hotel-reservation-api-gio.vercel.app/api/rooms',
                {
                    room_number: roomNumber,
                    type: roomType,
                    price: roomPrice,
                    available: 1
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Chambre ajoutée avec succès');
            setRoomNumber('');
            setRoomPrice('');
            setRoomType('Simple');
            fetchRooms();
        } catch (error) {
            const message = error.response?.data?.message;
            if (message === 'Ce numéro de chambre existe déjà') {
                toast.error('Ce numéro de chambre existe déjà');
            } else {
                toast.error('Erreur lors de l\'ajout');
            }
        }
    };

    const deleteRoom = async (id) => {
        try {
            await axios.delete(
                `https://hotel-reservation-api-gio.vercel.app/api/rooms/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Chambre supprimée');
            setConfirmDelete(null);
            fetchRooms();
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const cancelReservation = async (id) => {
        try {
            await axios.delete(
                `https://hotel-reservation-api-gio.vercel.app/api/reservations/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Réservation annulée');
            setConfirmCancelReservation(null);
            fetchReservations();
        } catch (error) {
            toast.error('Erreur lors de l\'annulation');
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(
                `https://hotel-reservation-api-gio.vercel.app/api/reservations/${id}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Statut mis à jour');
            fetchReservations();
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR');
    };

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return (
        <div className="admin-page">

            <h1>Tableau de bord administratif</h1>

            <div className="stats">
                <div className="stat-card">
                    <h2>{rooms.length}</h2>
                    <p>Chambres totales</p>
                </div>
                <div className="stat-card">
                    <h2>{reservations.length}</h2>
                    <p>Réservations totales</p>
                </div>
                <div className="stat-card">
                    <h2>{users.filter(u => u.role === 'client').length}</h2>
                    <p>Clients inscrits</p>
                </div>
            </div>

            <div className="admin-section">
                <h2>Ajouter une chambre</h2>
                <div className="add-room-form">
                    <input
                        type="number"
                        placeholder="Numéro de chambre"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                    />
                    <select
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                    >
                        <option value="Simple">Simple</option>
                        <option value="Double">Double</option>
                        <option value="Suite">Suite</option>
                        <option value="Suite de luxe">Suite de luxe</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Prix (MAD)"
                        value={roomPrice}
                        onChange={(e) => setRoomPrice(e.target.value)}
                    />
                    {roomType && (
                        <div className="room-preview">
                            <p>Aperçu :</p>
                            <img src={getRoomImage(roomType)} alt={roomType} />
                            <p>{roomType}</p>
                        </div>
                    )}
                    <button className="btn-confirm" onClick={addRoom}>
                        Ajouter la chambre
                    </button>
                </div>
            </div>

            <div className="admin-section">
                <h2>Chambres</h2>
                {rooms.map((room) => (
                    <div key={room.id} className="admin-reservation">
                        <div className="admin-room-row">
                            <img
                                src={getRoomImage(room.type)}
                                alt={room.type}
                                className="admin-room-img"
                            />
                            <div>
                                <p>Chambre {room.room_number}</p>
                                <p>Type : {room.type}</p>
                                <p>Prix : {parseFloat(room.price).toFixed(2)} MAD</p>
                                <p>{room.available ? '✅ Disponible' : '❌ Non disponible'}</p>
                                <button
                                    className="btn-delete"
                                    onClick={() => setConfirmDelete(room.id)}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="admin-section">
                <h2>Réserves</h2>
                {reservations.map((reservation) => (
                    <div key={reservation.id} className="admin-reservation">
                        <p>Client : {reservation.name}</p>
                        <p>Chambre : {reservation.room_number}</p>
                        <p>Arrivée : {formatDate(reservation.check_in)}</p>
                        <p>Départ : {formatDate(reservation.check_out)}</p>
                        <p>Statut : <strong>{reservation.status}</strong></p>
                        <div className="admin-btn-row">
                            {reservation.status === 'pending' && (
                                <button
                                    className="btn-confirm"
                                    onClick={() => updateStatus(reservation.id, 'confirmed')}
                                >
                                    Confirmer
                                </button>
                            )}
                            {reservation.status === 'confirmed' && (
                                <button
                                    className="btn-pending"
                                    onClick={() => updateStatus(reservation.id, 'pending')}
                                >
                                    Mettre en attente
                                </button>
                            )}
                            <button
                                className="btn-delete"
                                onClick={() => setConfirmCancelReservation(reservation.id)}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="admin-section">
                <h2>Utilisateurs inscrits</h2>
                {users.map((u) => (
                    <div key={u.id} className="admin-reservation">
                        <p>Nom : {u.name}</p>
                        <p>Email : {u.email}</p>
                        <p>Rôle : {u.role === 'admin' ? '👑 Admin' : '👤 Client'}</p>
                    </div>
                ))}
            </div>

            {confirmDelete && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h2>Confirmer la suppression</h2>
                        <p>Êtes-vous sûr de vouloir supprimer cette chambre ?</p>
                        <div className="popup-buttons">
                            <button
                                className="btn-delete"
                                onClick={() => deleteRoom(confirmDelete)}
                            >
                                Oui, supprimer
                            </button>
                            <button
                                className="btn-pending"
                                onClick={() => setConfirmDelete(null)}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {confirmCancelReservation && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h2>Confirmer l'annulation</h2>
                        <p>Êtes-vous sûr de vouloir annuler cette réservation ?</p>
                        <div className="popup-buttons">
                            <button
                                className="btn-delete"
                                onClick={() => cancelReservation(confirmCancelReservation)}
                            >
                                Oui, annuler
                            </button>
                            <button
                                className="btn-pending"
                                onClick={() => setConfirmCancelReservation(null)}
                            >
                                Retour
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default AdminDashboard;