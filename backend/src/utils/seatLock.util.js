// In-memory seat locks (user-scoped)
// Data structure: { [`${showId}_${seatNumber}`]: { expiry, userId } }
const seatLocks = new Map();

const LOCK_DURATION_MS = 5 * 60 * 1000; // 5 minutes

const isSeatLocked = (showId, seatNumber) => {
    const key = `${showId}_${seatNumber}`;
    const entry = seatLocks.get(key);

    if (!entry) return false;

    if (Date.now() > entry.expiry) {
        seatLocks.delete(key);
        return false;
    }
    return true;
};

const isSeatLockedByUser = (showId, seatNumber, userId) => {
    const key = `${showId}_${seatNumber}`;
    const entry = seatLocks.get(key);
    if (!entry || Date.now() > entry.expiry) return false;
    return entry.userId && entry.userId.toString() === userId.toString();
};

const lockSeat = (showId, seatNumber, userId) => {
    if (isSeatLocked(showId, seatNumber)) {
        return false; // Already locked
    }
    const key = `${showId}_${seatNumber}`;
    seatLocks.set(key, {
        expiry: Date.now() + LOCK_DURATION_MS,
        userId: userId,
    });
    return true;
};

const unlockSeat = (showId, seatNumber) => {
    const key = `${showId}_${seatNumber}`;
    seatLocks.delete(key);
};

module.exports = {
    isSeatLocked,
    isSeatLockedByUser,
    lockSeat,
    unlockSeat,
};
