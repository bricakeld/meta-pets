// ============================================
// EVENT BUS
// Enables decoupled communication between features
// ============================================

class EventBus {
    constructor() {
        this.listeners = new Map();
    }
    
    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Handler function
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
        
        // Return unsubscribe function
        return () => this.off(event, callback);
    }
    
    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {Function} callback - Handler to remove
     */
    off(event, callback) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.delete(callback);
        }
    }
    
    /**
     * Emit an event with optional data
     * @param {string} event - Event name
     * @param {*} data - Data to pass to handlers
     */
    emit(event, data) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event handler for "${event}":`, error);
                }
            });
        }
    }
    
    /**
     * Subscribe to an event only once
     * @param {string} event - Event name
     * @param {Function} callback - Handler function
     */
    once(event, callback) {
        const unsubscribe = this.on(event, (data) => {
            unsubscribe();
            callback(data);
        });
    }
}

// Singleton instance
export const events = new EventBus();

// Event name constants for type safety
export const EVENTS = {
    // Pet lifecycle
    PET_SELECTED: 'pet:selected',
    PET_NAMED: 'pet:named',
    PET_CHANGED: 'pet:changed',
    
    // Stats
    STAT_CHANGED: 'stat:changed',
    STAT_CRITICAL: 'stat:critical',
    
    // Actions
    ACTION_PERFORMED: 'action:performed',
    
    // UI
    SCREEN_CHANGED: 'screen:changed',
    MODAL_OPENED: 'modal:opened',
    MODAL_CLOSED: 'modal:closed'
};

