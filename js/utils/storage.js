// ============================================
// STORAGE UTILITY
// Handles persistence to localStorage
// ============================================

import { CONFIG } from '../config.js';

/**
 * Save pet data to localStorage
 * @param {Object} petData - Pet state to save
 */
export function savePet(petData) {
    const data = {
        ...petData,
        lastSaved: Date.now()
    };
    
    try {
        localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save pet:', error);
    }
}

/**
 * Load pet data from localStorage
 * @returns {Object|null} Saved pet data or null
 */
export function loadPet() {
    try {
        const saved = localStorage.getItem(CONFIG.SAVE_KEY);
        if (!saved) return null;
        
        return JSON.parse(saved);
    } catch (error) {
        console.error('Failed to load pet:', error);
        clearPet();
        return null;
    }
}

/**
 * Clear saved pet data
 */
export function clearPet() {
    localStorage.removeItem(CONFIG.SAVE_KEY);
}

/**
 * Calculate stat decay while app was closed
 * @param {number} lastSaved - Timestamp when last saved
 * @param {number} currentValue - Current stat value
 * @param {number} decayRate - How much to decay per interval
 * @returns {number} New stat value after decay
 */
export function calculateOfflineDecay(lastSaved, currentValue, decayRate) {
    const timePassed = Date.now() - lastSaved;
    const intervals = Math.floor(timePassed / CONFIG.STAT_DECAY_INTERVAL);
    const decayAmount = intervals * decayRate;
    
    return Math.max(0, currentValue - decayAmount);
}

