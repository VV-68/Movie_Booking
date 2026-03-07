import React, { useState, useEffect } from 'react';
import { getMovies, getAllShows } from '../../services/api';
import MovieCard from '../../components/MovieCard/MovieCard';
import Loader from '../../components/Loader/Loader';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [moviesRes, showsRes] = await Promise.all([getMovies(), getAllShows()]);
                const moviesData = moviesRes?.data ?? moviesRes;
                const showsData = showsRes?.data ?? showsRes;
                
                const moviesList = Array.isArray(moviesData) ? moviesData : (moviesData?.movies ?? []);
                const showsList = Array.isArray(showsData) ? showsData : [];
                
                setMovies(moviesList);
                setShows(showsList);
            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <Loader />;

    // Extract unique genres
    const genres = ['All', ...new Set(movies.map(m => m.genre).filter(Boolean))];

    // Filter logic
    const filteredMovies = movies.filter(movie => {
        const matchesGenre = selectedGenre === 'All' || movie.genre === selectedGenre;
        
        if (!search.trim()) return matchesGenre;

        const searchLower = search.toLowerCase();
        
        // Match movie title
        if (movie.title?.toLowerCase().includes(searchLower)) {
            return matchesGenre;
        }

        // Match theatre location from shows
        const movieShows = shows.filter(s => s.movieId?._id === movie._id || s.movieId === movie._id);
        const matchesLocation = movieShows.some(show => 
            show.theatreId?.location?.toLowerCase().includes(searchLower) ||
            show.theatreId?.name?.toLowerCase().includes(searchLower)
        );

        return matchesGenre && matchesLocation;
    });

    const inputStyle = {
        padding: '0.8rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '1rem',
        width: '100%',
        maxWidth: '400px',
        outline: 'none'
    };

    const selectStyle = {
        ...inputStyle,
        maxWidth: '200px',
        cursor: 'pointer'
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ color: '#222', fontSize: '1.8rem', margin: 0 }}>Recommended Movies</h2>
                
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
                    <input 
                        type="text" 
                        placeholder="Search by movie or location..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={inputStyle}
                    />
                    
                    <select 
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        style={selectStyle}
                    >
                        {genres.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
            </div>

            {filteredMovies.length === 0 ? (
                <p>No movies matched your search criteria.</p>
            ) : (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: '2rem',
                    }}
                >
                    {filteredMovies.map((movie) => (
                        <MovieCard
                            key={movie._id}
                            movieId={movie._id}
                            title={movie.title}
                            poster={movie.poster}
                            language={movie.language}
                            duration={`${movie.duration} min`}
                        />
                    ))}
                </div>
            )}
            <style>{`
        @media (max-width: 1024px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
};

export default Home;
