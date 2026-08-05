import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    return (
        <div className="home-container">
            <h1>Welcome to InternTrack</h1>
            <p>Internship Management System</p>
            <button type="button" onClick={() => navigate('/login')}>Get Started</button>
        </div>
    );
}

export default Home;