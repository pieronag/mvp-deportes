// En src/types/notification.js
// No necesitamos interfaces en JS, solo documentación

/**
 * @typedef {Object} NotificationPreferences
 * @property {boolean} pushEnabled
 * @property {boolean} emailEnabled
 * @property {'instant' | 'daily' | 'weekly'} frequency
 * @property {Object} categories
 * @property {boolean} categories.newSports
 * @property {boolean} categories.eventReminders
 * @property {boolean} categories.promotions
 * @property {boolean} categories.friendActivities
 */