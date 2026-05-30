// Navbar Component
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {

    const navigate = useNavigate();

    const user = localStorage.getItem('user');

    const logout = () => {

        localStorage.removeItem('token');

        localStorage.removeItem('user');

        navigate('/login');

    };

    return (

        <nav className="navbar">

            <h2>Luxury Hotel</h2>

            <div className="nav-links">

                <Link to="/">
                    Home
                </Link>

                <Link to="/rooms">
                    Rooms
                </Link>

                <Link to="/reservations">
                    Reservations
                </Link>

                <Link to="/admin">
                    Admin
                </Link>

                {!user && (

                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>
                    </>

                )}

                {user && (

                    <button onClick={logout}>
                        Logout
                    </button>

                )}

            </div>

        </nav>

    );

}

export default Navbar;