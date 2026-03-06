export const generateSeatLayout = (rows = 8, cols = 10, bookedSeats = []) => {
    const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const layout = [];

    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 1; c <= cols; c++) {
            const seatId = `${rowLabels[r]}${c}`;
            row.push({
                id: seatId,
                isBooked: bookedSeats.includes(seatId)
            });
        }
        layout.push({ row: rowLabels[r], seats: row });
    }

    return layout;
};

export const calculateTotalPrice = (selectedSeatsCount, ticketPrice = 250) => {
    return selectedSeatsCount * ticketPrice;
};
