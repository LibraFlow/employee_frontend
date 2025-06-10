import React, { useEffect, useState } from 'react';
import bookUnitService from '../services/bookUnitService';
import './BookUnitsPage.css';

const OverdueUnavailableUnitsPage = () => {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const data = await bookUnitService.getUnavailableOverdueBookUnits();
                setUnits(data);
            } catch (err) {
                setError('Failed to load overdue unavailable book units.');
            } finally {
                setLoading(false);
            }
        };
        fetchUnits();
    }, []);

    const handleChangeAvailability = async (unit) => {
        try {
            await bookUnitService.updateBookUnit(unit.id, {
                ...unit,
                availability: true // or !unit.availability if you want to toggle
            });
            // Refresh the list after update
            const data = await bookUnitService.getUnavailableOverdueBookUnits();
            setUnits(data);
        } catch (err) {
            setError('Failed to update availability.');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="book-units-container">
            <div className="page-header">
                <h1>Overdue & Unavailable Book Units</h1>
            </div>
            <div className="units-grid">
                {units.length === 0 ? (
                    <div>No overdue unavailable book units found.</div>
                ) : (
                    units.map((unit) => (
                        <div key={unit.id} className="unit-card">
                            {unit.coverImageLink && (
                                <img 
                                    src={unit.coverImageLink} 
                                    alt="Book cover" 
                                    className="unit-cover"
                                />
                            )}
                            <div className="unit-info">
                                <p><strong>Language:</strong> {unit.language}</p>
                                <p><strong>Pages:</strong> {unit.pageCount}</p>
                                <p><strong>Publisher:</strong> {unit.publisher}</p>
                                <p><strong>ISBN:</strong> {unit.isbn}</p>
                                <p><strong>Availability:</strong> <span style={{ color: unit.availability ? 'blue' : 'red' }}>{unit.availability ? 'Available' : 'Unavailable'}</span></p>
                            </div>
                            {!unit.availability && (
                                <button
                                    className="availability-btn"
                                    onClick={() => handleChangeAvailability(unit)}
                                >
                                    Mark as Available
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OverdueUnavailableUnitsPage; 