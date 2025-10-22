// En src/services/notificationService.js
import { 
  doc, 
  getDoc, 
  setDoc 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export const getNotificationPreferences = async (userId) => {
  try {
    const docRef = doc(db, 'notificationPreferences', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      const defaultPreferences = {
        pushEnabled: true,
        emailEnabled: false,
        frequency: 'instant',
        categories: {
          newSports: true,
          eventReminders: true,
          promotions: false,
          friendActivities: true,
        }
      };
      await setDoc(docRef, defaultPreferences);
      return defaultPreferences;
    }
  } catch (error) {
    console.error('Error getting notification preferences:', error);
    throw error;
  }
};

export const updateNotificationPreferences = async (userId, preferences) => {
  try {
    const docRef = doc(db, 'notificationPreferences', userId);
    await setDoc(docRef, preferences, { merge: true });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    throw error;
  }
};