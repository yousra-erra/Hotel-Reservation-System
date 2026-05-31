// Reservations Page
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Reservations() {

    const [reservations, setReservations] = useState([]);
    const [confirmCancel, setConfirmCancel] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchReservations();
    }, []);

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

    const deleteReservation = async (id) => {
        try {
            await axios.delete(
                `https://hotel-reservation-api-gio.vercel.app/api/reservations/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Réservation annulée');
            setConfirmCancel(null);
            fetchReservations();
        } catch (error) {
            toast.error('Erreur lors de l\'annulation');
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR');
    };

    return (
        <div className="page">
            <h1>Réserves</h1>
            {reservations.length === 0 ? (
                <p className="no-reservations">Vous n'avez aucune réservation.</p>
            ) : (
                <div className="reservations-grid">
                    {reservations.map((reservation) => (
                        <div className="reservation-card" key={reservation.id}>
                            <h2>Chambre {reservation.room_number}</h2>
                            <p>Arrivée : {formatDate(reservation.check_in)}</p>
                            <p>Départ : {formatDate(reservation.check_out)}</p>
                            <p>Statut : {reservation.status}</p>
                            <button onClick={() => setConfirmCancel(reservation.id)}>
                                Annuler la réservation
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Popup confirmation annulation */}
            {confirmCancel && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h2>Confirmer l'annulation</h2>
                        <p>Êtes-vous sûr de vouloir annuler cette réservation ?</p>
                        <div className="popup-buttons">
                            <button
                                className="btn-delete"
                                onClick={() => deleteReservation(confirmCancel)}
                            >
                                Oui, annuler
                            </button>
                            <button
                                className="btn-pending"
                                onClick={() => setConfirmCancel(null)}
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

export default Reservations;