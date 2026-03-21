import React, { useState, useEffect } from 'react';
import { getMovies, searchByLocation } from '../../services/api';
import MovieCard from '../../components/MovieCard/MovieCard';
import Loader from '../../components/Loader/Loader';

const Home = () => {
    // Core state
    const [allMovies, setAllMovies] = useState([]);
    const [moviesToShow, setMoviesToShow] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [selectedLanguage, setSelectedLanguage] = useState('All');
    
    // UI states
    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
    const [locationSearchTerm, setLocationSearchTerm] = useState('');

    // Predefined lists for testing
    const predefinedLocations = ['Kochi', 'Trivandrum', 'Bangalore', 'Chennai', 'Mumbai', 'Delhi'];

    useEffect(() => {
        const fetchInitialMovies = async () => {
            try {
                const response = await getMovies();
                const moviesData = response?.data ?? response;
                const moviesList = Array.isArray(moviesData) ? moviesData : (moviesData?.movies ?? []);
                
                setAllMovies(moviesList);
                setMoviesToShow(moviesList);
            } catch (error) {
                console.error('Error fetching initial movies', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialMovies();
    }, []);

    // Effect for handling location fetching
    useEffect(() => {
        const fetchLocationMovies = async () => {
            if (!selectedLocation) {
                // If no location, revert to all loaded movies
                setMoviesToShow(allMovies);
                return;
            }

            setLoading(true);
            try {
                const response = await searchByLocation(selectedLocation);
                const locationMovies = response?.data ?? [];
                setMoviesToShow(Array.isArray(locationMovies) ? locationMovies : []);
            } catch (error) {
                console.error('Error fetching movies for location', error);
                setMoviesToShow([]); // fallback
            } finally {
                setLoading(false);
            }
        };

        fetchLocationMovies();
    }, [selectedLocation, allMovies]);

    // Extract unique options from current active movie list
    const genres = ['All', ...new Set(moviesToShow.map(m => m.genre).filter(Boolean))];
    const languages = ['All', ...new Set(moviesToShow.map(m => m.language).filter(Boolean))];

    // Final filter application (runs on the moviesToShow set)
    const filteredMovies = moviesToShow.filter(movie => {
        // Genre filter
        const matchesGenre = selectedGenre === 'All' || movie.genre === selectedGenre;
        
        // Language filter
        const matchesLanguage = selectedLanguage === 'All' || movie.language === selectedLanguage;

        // Search term filter (ONLY TITLE now)
        const matchesSearch = !searchTerm.trim() || 
            (movie.title && movie.title.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesGenre && matchesLanguage && matchesSearch;
    });

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedLocation('');
        setSelectedGenre('All');
        setSelectedLanguage('All');
        setLocationSearchTerm('');
    };

    const handleLocationSelect = (loc) => {
        setSelectedLocation(loc);
        setIsLocationDropdownOpen(false);
        setLocationSearchTerm('');
    };

    // --- Styling definitions ---
    const panelStyle = {
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        overflow: 'visible',
        position: 'relative',
        zIndex: 50,
    };

    const searchInputStyle = {
        padding: '0.8rem 1.2rem',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.2)',
        fontSize: '1rem',
        width: '100%',
        outline: 'none',
        background: 'rgba(0,0,0,0.2)',
        color: '#fff'
    };

    const filtersRowStyle = {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap',
    };

    const filterGroupStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flex: '1 1 200px', // allow wrapping on mobile
    };

    const labelStyle = {
        fontWeight: 'bold',
        color: '#ccc',
        fontSize: '0.9rem',
        minWidth: '75px'
    };

    const btnStyle = {
        padding: '0.6rem 1.2rem',
        background: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.95rem',
        fontWeight: 'bold',
        whiteSpace: 'nowrap'
    };

    // Location Dropdown variables
    const filteredLocations = predefinedLocations.filter(l => 
        l.toLowerCase().includes(locationSearchTerm.toLowerCase())
    );

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            
            {/* Filter Panel */}
            <div style={panelStyle} className="filter-panel">
                
                {/* Search Bar - Movies Only */}
                <div>
                    <input 
                        type="text" 
                        placeholder="Search movies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={searchInputStyle}
                    />
                </div>

                {/* Filters Row */}
                <div style={filtersRowStyle}>
                    
                    {/* Location Custom Dropdown */}
                    <div style={{...filterGroupStyle, position: 'relative', zIndex: 1000}}>
                        <span style={labelStyle}>Location:</span>
                        <div style={{width: '100%', position: 'relative'}}>
                            <div 
                                className="custom-select"
                                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                                style={{
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%'
                                }}
                            >
                                <span>{selectedLocation || 'Select Location'}</span>
                            </div>

                            {isLocationDropdownOpen && (
                                <div className="custom-dropdown-menu" style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    background: '#1a1a1a',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '8px',
                                    marginTop: '4px',
                                    zIndex: 10000,
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                    color: '#fff'
                                }}>
                                    <div style={{padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                                        <input 
                                            type="text" 
                                            placeholder="Search location..."
                                            value={locationSearchTerm}
                                            onChange={(e) => setLocationSearchTerm(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.5rem',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                borderRadius: '4px',
                                                outline: 'none',
                                                fontSize: '0.9rem',
                                                background: 'rgba(0,0,0,0.3)',
                                                color: '#fff'
                                            }}
                                        />
                                    </div>
                                    <div style={{maxHeight: '150px', overflowY: 'auto'}}>
                                        {filteredLocations.length > 0 ? (
                                            filteredLocations.map(loc => (
                                                <div 
                                                    key={loc}
                                                    onClick={() => handleLocationSelect(loc)}
                                                    style={{
                                                        padding: '0.6rem 1rem',
                                                        cursor: 'pointer',
                                                        background: selectedLocation === loc ? 'rgba(255,255,255,0.1)' : 'transparent',
                                                        borderBottom: '1px solid rgba(255,255,255,0.05)'
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                                                    onMouseLeave={(e) => e.target.style.background = selectedLocation === loc ? 'rgba(255,255,255,0.1)' : 'transparent'}
                                                >
                                                    {loc}
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{padding: '1rem', color: '#777', textAlign: 'center'}}>No locations found</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Genre Filter */}
                    <div style={filterGroupStyle}>
                        <span style={labelStyle}>Genre:</span>
                        <select 
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            style={{width: '100%'}}
                        >
                            {genres.map(g => <option key={g} value={g}>{g === 'All' ? 'Select Genre' : g}</option>)}
                        </select>
                    </div>

                    {/* Language Filter */}
                    <div style={filterGroupStyle}>
                        <span style={labelStyle}>Language:</span>
                        <select 
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            style={{width: '100%'}}
                        >
                            {languages.map(l => <option key={l} value={l}>{l === 'All' ? 'Select Language' : l}</option>)}
                        </select>
                    </div>

                    {/* Clear Filters Button */}
                    <button onClick={handleClearFilters} style={btnStyle}>
                        Clear Filters
                    </button>

                </div>
            </div>

            {loading ? (
                <Loader />
            ) : filteredMovies.length === 0 ? (
                <p style={{ color: '#ccc' }}>No movies matched your search criteria.</p>
            ) : (
                <>
                    <h2 style={{ marginBottom: '1.5rem', color: '#fff', fontSize: '1.5rem' }}>
                        {selectedLocation ? `Movies in ${selectedLocation}` : 'Recommended Movies'}
                    </h2>
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
                </>
            )}

            <style>{`
            /* Basic responsive CSS */
            @media (max-width: 1024px) {
                div[style*="grid-template-columns"] {
                    grid-template-columns: repeat(3, 1fr) !important;
                }
            }
            @media (max-width: 768px) {
                div[style*="grid-template-columns"] {
                    grid-template-columns: repeat(2, 1fr) !important;
                }
                .filter-panel > div:nth-child(2) {
                    flex-direction: column !important;
                    align-items: stretch !important;
                }
                .filter-panel button {
                    width: 100% !important;
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
