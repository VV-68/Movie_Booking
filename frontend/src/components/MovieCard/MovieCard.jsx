import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movieId, title, poster, language, duration }) => {
    const navigate = useNavigate();

    return (
        <div className="movie-card" onClick={() => navigate(`/movie/${movieId}`)}>
            <div className="movie-poster-container">
                <img src={poster} alt={title} className="movie-poster" />
            </div>
            <div className="movie-info">
                <h3 className="movie-title">{title}</h3>
                <p className="movie-meta">{language} • {duration}</p>
                <button
                    className="btn btn-primary view-details-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/movie/${movieId}`);
                    }}
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

export default MovieCard;
