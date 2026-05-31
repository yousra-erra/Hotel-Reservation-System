// Register Page 
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Register() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const handleRegister = async (e) => {
        e.preventDefault();

        let validationErrors = {};

        if (!name) {
            validationErrors.name = '* Nom requis';
        }
        if (!email) {
            validationErrors.email = '* L\'email est requis';
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            validationErrors.email = '* Format de courriel invalide';
        }
        if (!password) {
            validationErrors.password = '* Mot de passe requis';
        } else if (password.length < 6) {
            validationErrors.password = '* Le mot de passe doit contenir au moins 6 caractères';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        try {
            const response = await axios.post(
                'https://hotel-reservation-api-gio.vercel.app/api/auth/register',
                { name, email, password }
            );
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            toast.success(response.data.message);
            setName('');
            setEmail('');
            setPassword('');
            window.location.href = '/rooms';
        } catch (error) {
            console.log(error);
            const message = error.response?.data?.message;
            if (message === 'User already exists') {
                setErrors({ email: '* Utilisateur déjà inscrit' });
            } else if (message === 'Invalid email format') {
                setErrors({ email: '* Format de courriel invalide' });
            } else if (message === 'Password must contain at least 6 characters') {
                setErrors({ password: '* Le mot de passe doit contenir au moins 6 caractères' });
            } else {
                toast.error(message || 'Inscription échouée');
            }
        }
    };

    return (
        <div className="form-container">
            <h2>Registre</h2>
            <form onSubmit={handleRegister}>
                <div className="input-group">
                    {errors.name && <p className="error">{errors.name}</p>}
                    <input
                        type="text"
                        placeholder="Nom"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    {errors.email && <p className="error">{errors.email}</p>}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    {errors.password && <p className="error">{errors.password}</p>}
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Registre</button>
            </form>
        </div>
    );
}

export default Register;