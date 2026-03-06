import React from 'react';
import './Seat.css';

const Seat = ({ seatNumber, isBooked, isSelected, onSelect }) => {
    let statusClass = 'available';
    if (isBooked) statusClass = 'booked';
    else if (isSelected) statusClass = 'selected';

    return (
        <button
            className={`seat ${statusClass}`}
            onClick={() => {
                if (!isBooked) {
                    onSelect(seatNumber);
                }
            }}
            disabled={isBooked}
        >
            {seatNumber}
        </button>
    );
};

export default Seat;
