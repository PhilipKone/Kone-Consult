import { db } from './config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Logs a user activity event to Firestore.
 * @param {Object} user - The current user object (from AuthContext).
 * @param {string} activityType - The type of action (e.g., 'Workshop Entered').
 * @param {Object} details - Additional metadata (e.g., { platform: 'Kone Lab', component: 'Motor' }).
 */
export const logActivity = async (user, activityType, details = {}) => {
    try {
        const logEntry = {
            userId: user?.uid || 'guest',
            userEmail: user?.email || 'Guest',
            activityType,
            details,
            timestamp: serverTimestamp(),
            platform: details.platform || 'Kone Academy'
        };
        
        await addDoc(collection(db, 'activity_logs'), logEntry);
    } catch (err) {
        // Silently fail logging in production to avoid crashing the UI
        console.warn("Activity logging failed:", err);
    }
};
