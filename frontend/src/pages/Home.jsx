// Home Page
import { useState } from 'react';
import { Link } from 'react-router-dom';
import simple from '../images/simple.jpeg';
import double from '../images/double.jpeg';
import suite from '../images/suite.jpeg';
import suiteDeLuxe from '../images/suiteDeLuxe.jpeg';

function Home() {

    const [selectedActivity, setSelectedActivity] = useState(null);

    const activities = [
        {
            title: 'Spa & Bien-être',
            image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop',
            description: 'Détendez-vous avec des massages, du sauna et des expériences de bien-être de luxe.',
            hours: '09h00 - 22h00',
            services: 'Massage, sauna, soins du visage, salles de détente'
        },
        {
            title: 'Piscine',
            image: 'https://images.unsplash.com/photo-1572331165267-854da2b10ccc?q=80&w=1200&auto=format&fit=crop',
            description: 'Profitez de notre piscine extérieure de luxe avec boissons et espaces de détente.',
            hours: '08h00 - 21h00',
            services: 'Piscine extérieure, bar de piscine, fauteuils relax'
        },
        {
            title: 'Restaurant',
            image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop',
            description: 'Goûtez des plats de qualité préparés par des chefs professionnels.',
            hours: '07h00 - 23h00',
            services: 'Petit-déjeuner, déjeuner, dîner, cuisine internationale'
        },
        {
            title: 'Salle de fitness',
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop',
            description: 'Équipements modernes de gym et services de coaching sportif.',
            hours: '06h00 - 23h00',
            services: 'Gym, Cardio, Coaching Personnel'
        }
    ];

    const roomTypes = [
        {
            type: 'Simple',
            image: simple,
            price: '500',
            description: 'Chambre confortable pour une personne avec tout le nécessaire.'
        },
        {
            type: 'Double',
            image: double,
            price: '800',
            description: 'Spacieuse et élégante, idéale pour deux personnes.'
        },
        {
            type: 'Suite',
            image: suite,
            price: '1200',
            description: 'Suite luxueuse avec salon séparé et vue panoramique.'
        },
        {
            type: 'Suite de luxe',
            image: suiteDeLuxe,
            price: '2000',
            description: 'Le summum du luxe avec services premium et jacuzzi privé.'
        }
    ];

    return (
        <div className="home">

            {/* Hero */}
            <div className="hero">
                <div className="hero-content">
                    <p className="hero-subtitle">Bienvenue à l'hôtel de luxe</p>
                    <h1>Vivez une expérience<br />inoubliable</h1>
                    <p className="hero-desc">
                        Réservez facilement la chambre de vos rêves et profitez
                        des services hôteliers haut de gamme.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/rooms" className="hero-btn-primary">
                            Explorer les chambres
                        </Link>
                        <Link to="/register" className="hero-btn-secondary">
                            Créer un compte
                        </Link>
                    </div>
                </div>
            </div>

            {/* Statistiques */}
            <div className="stats-section">
                <div className="stats-grid">
                    <div className="stats-item">
                        <h2>12+</h2>
                        <p>Chambres disponibles</p>
                    </div>
                    <div className="stats-item">
                        <h2>4</h2>
                        <p>Types de chambres</p>
                    </div>
                    <div className="stats-item">
                        <h2>4</h2>
                        <p>Services & activités</p>
                    </div>
                    <div className="stats-item">
                        <h2>24h</h2>
                        <p>Service disponible</p>
                    </div>
                </div>
            </div>

            {/* Nos chambres */}
            <div className="home-rooms-section">
                <div className="section-header">
                    <h2>Nos chambres</h2>
                    <p>Choisissez parmi nos différents types de chambres</p>
                </div>
                <div className="home-rooms-grid">
                    {roomTypes.map((room, index) => (
                        <div key={index} className="home-room-card">
                            <div className="home-room-img-wrapper">
                                <img src={room.image} alt={room.type} />
                                <div className="home-room-overlay">
                                    <span>{room.price} MAD / nuit</span>
                                </div>
                            </div>
                            <div className="home-room-info">
                                <h3>{room.type}</h3>
                                <p>{room.description}</p>
                                <Link to="/rooms" className="home-room-btn">
                                    Réserver
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Activités */}
            <div className="activities-section">
                <div className="section-header">
                    <h2>Activités et services</h2>
                    <p>Profitez de nos services exclusifs pendant votre séjour</p>
                </div>
                <div className="activities-grid">
                    {activities.map((activity, index) => (
                        <div
                            key={index}
                            className="activity-card"
                            onClick={() => setSelectedActivity(activity)}
                        >
                            <img src={activity.image} alt={activity.title} />
                            <h3>{activity.title}</h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal activité */}
            {selectedActivity && (
                <div className="activity-modal">
                    <div className="activity-content">
                        <button
                            className="close-btn"
                            onClick={() => setSelectedActivity(null)}
                        >
                            X
                        </button>
                        <img src={selectedActivity.image} alt={selectedActivity.title} />
                        <h2>{selectedActivity.title}</h2>
                        <p>{selectedActivity.description}</p>
                        <p><strong>Horaires d'ouverture :</strong> {selectedActivity.hours}</p>
                        <p><strong>Services :</strong> {selectedActivity.services}</p>
                    </div>
                </div>
            )}

            {/* Contact */}
            <div className="contact-section">
                <div className="section-header">
                    <h2>Contactez-nous</h2>
                    <p>Nous sommes disponibles 24h/24 pour vous aider</p>
                </div>
                <div className="contact-container">
                    <div className="contact-card">
                        <div className="contact-icon">📍</div>
                        <h3>Adresse</h3>
                        <p>Avenue Mohammed V, Rabat, Maroc</p>
                    </div>
                    <div className="contact-card">
                        <div className="contact-icon">📞</div>
                        <h3>Téléphone</h3>
                        <p>+212 600000000</p>
                    </div>
                    <div className="contact-card">
                        <div className="contact-icon">✉️</div>
                        <h3>Email</h3>
                        <p>luxuryhotel@gmail.com</p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Home;