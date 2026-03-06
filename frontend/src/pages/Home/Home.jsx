import React, { useState, useEffect } from 'react';
import { getMovies } from '../../services/api';
import MovieCard from '../../components/MovieCard/MovieCard';
import Loader from '../../components/Loader/Loader';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchMovies = async () => {
          try {
              const response = await getMovies();
              const moviesData = response?.data ?? response;
              const list = Array.isArray(moviesData) ? moviesData : (moviesData?.movies ?? []);
              setMovies(list);
          } catch (error) {
              console.error('Error fetching movies', error);
          } finally {
              setLoading(false);
          }
      };
  
      fetchMovies();
  }, []);

    if (loading) return <Loader />;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h2 style={{ marginBottom: '2rem', color: '#222', fontSize: '1.8rem' }}>Recommended Movies</h2>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '2rem',
                }}
            >
                {movies.map((movie) => (
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
