// ============================================
// STATS REGISTRY
// Define pet stats here - add new ones easily!
// ============================================

import { CONFIG } from '../config.js';
import { events, EVENTS } from '../utils/events.js';
import { getPetTrait } from '../pets/registry.js';

/**
 * Stats configuration
 * Add new stats by creating entries here
 */
export const STATS = {
    hunger: {
        id: 'hunger',
        name: 'Hunger',
        icon: '🍗',
        baseDecayRate: 2,           // Base amount to decay per interval
        traitMultiplier: 'hungerDecayMultiplier',  // Pet trait that modifies this
        startValue: 100,
        min: 0,
        max: 100
    }
    // Easy to add more stats:
    // happiness: {
    //     id: 'happiness',
    //     name: 'Happiness',
    //     icon: '😊',
    //     baseDecayRate: 1.5,
    //     traitMultiplier: 'happinessDecayMultiplier',
    //     startValue: 100,
    //     min: 0,
    //     max: 100
    // },
    // energy: {
    //     id: 'energy',
    //     name: 'Energy',
    //     icon: '⚡',
    //     baseDecayRate: 1,
    //     traitMultiplier: 'energyDecayMultiplier',
    //     startValue: 100,
    //     min: 0,
    //     max: 100
    // }
};

/**
 * Stats Manager - handles all stat-related logic
 */
export class StatsManager {
    constructor() {
        this.values = {};
        this.petType = null;
        this.decayInterval = null;
        
        this.initializeStats();
    }
    
    /**
     * Initialize all stats to their starting values
     */
    initializeStats() {
        for (const [statId, statConfig] of Object.entries(STATS)) {
            this.values[statId] = statConfig.startValue;
        }
    }
    
    /**
     * Set the current pet type (affects decay rates via traits)
     * @param {string} petType - Pet type ID
     */
    setPetType(petType) {
        this.petType = petType;
    }
    
    /**
     * Get the current value of a stat
     * @param {string} statId - Stat identifier
     * @returns {number} Current stat value
     */
    getValue(statId) {
        return this.values[statId] ?? 0;
    }
    
    /**
     * Set a stat value (clamped to min/max)
     * @param {string} statId - Stat identifier
     * @param {number} value - New value
     */
    setValue(statId, value) {
        const stat = STATS[statId];
        if (!stat) return;
        
        const oldValue = this.values[statId];
        this.values[statId] = Math.max(stat.min, Math.min(stat.max, value));
        
        // Emit change event
        events.emit(EVENTS.STAT_CHANGED, {
            statId,
            oldValue,
            newValue: this.values[statId],
            stat
        });
        
        // Check for critical threshold
        if (this.values[statId] <= CONFIG.MOOD_THRESHOLDS.worried && 
            oldValue > CONFIG.MOOD_THRESHOLDS.worried) {
            events.emit(EVENTS.STAT_CRITICAL, { statId, value: this.values[statId] });
        }
    }
    
    /**
     * Modify a stat by a delta amount
     * @param {string} statId - Stat identifier
     * @param {number} delta - Amount to add (negative to subtract)
     */
    modifyStat(statId, delta) {
        this.setValue(statId, this.getValue(statId) + delta);
    }
    
    /**
     * Get the effective decay rate for a stat (base * pet trait modifier)
     * @param {string} statId - Stat identifier
     * @returns {number} Effective decay rate
     */
    getDecayRate(statId) {
        const stat = STATS[statId];
        if (!stat) return 0;
        
        const traitMultiplier = this.petType 
            ? getPetTrait(this.petType, stat.traitMultiplier, 1)
            : 1;
            
        return stat.baseDecayRate * traitMultiplier;
    }
    
    /**
     * Start the decay timer for all stats
     */
    startDecay() {
        this.stopDecay();
        
        this.decayInterval = setInterval(() => {
            for (const statId of Object.keys(STATS)) {
                const currentValue = this.getValue(statId);
                if (currentValue > 0) {
                    const decayRate = this.getDecayRate(statId);
                    this.modifyStat(statId, -decayRate);
                }
            }
        }, CONFIG.STAT_DECAY_INTERVAL);
    }
    
    /**
     * Stop the decay timer
     */
    stopDecay() {
        if (this.decayInterval) {
            clearInterval(this.decayInterval);
            this.decayInterval = null;
        }
    }
    
    /**
     * Get all current stat values
     * @returns {Object} Map of statId -> value
     */
    getAllValues() {
        return { ...this.values };
    }
    
    /**
     * Load stat values from saved data
     * @param {Object} savedStats - Saved stat values
     */
    loadValues(savedStats) {
        for (const [statId, value] of Object.entries(savedStats)) {
            if (STATS[statId]) {
                this.values[statId] = value;
            }
        }
    }
    
    /**
     * Reset all stats to starting values
     */
    reset() {
        this.stopDecay();
        this.petType = null;
        this.initializeStats();
    }
}

/**
 * Get all registered stat IDs
 * @returns {string[]} Array of stat IDs
 */
export function getStatIds() {
    return Object.keys(STATS);
}

/**
 * Get stat configuration
 * @param {string} statId - Stat identifier
 * @returns {Object|null} Stat config or null
 */
export function getStatConfig(statId) {
    return STATS[statId] || null;
}

