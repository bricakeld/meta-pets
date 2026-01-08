// ============================================
// ACTIONS REGISTRY
// Define pet actions/interactions here!
// ============================================

import { CONFIG } from '../config.js';
import { events, EVENTS } from '../utils/events.js';
import { getPetTrait } from '../pets/registry.js';

/**
 * Actions configuration
 * Add new actions by creating entries here
 */
export const ACTIONS = {
    feed: {
        id: 'feed',
        name: 'Feed',
        icon: '🍖',
        buttonClass: 'primary',
        // Which stat this action affects and by how much
        effects: [
            { statId: 'hunger', amount: 25 }
        ],
        // Animation to play on the pet
        animation: 'pet-eating',
        // Animation duration in ms
        animationDuration: CONFIG.FEED_ANIMATION_DURATION,
        // Food particle to show (can be overridden by pet trait)
        foodParticle: '🍖',
        // Cooldown in ms (0 = no cooldown)
        cooldown: 0,
        // Whether action can be performed (can check stat values, etc.)
        canPerform: (statsManager) => {
            return statsManager.getValue('hunger') < 100;
        }
    }
    // Easy to add more actions:
    // play: {
    //     id: 'play',
    //     name: 'Play',
    //     icon: '🎾',
    //     buttonClass: 'secondary',
    //     effects: [
    //         { statId: 'happiness', amount: 20 },
    //         { statId: 'energy', amount: -10 }
    //     ],
    //     animation: 'pet-playing',
    //     animationDuration: 1200,
    //     cooldown: 3000,
    //     canPerform: (statsManager) => statsManager.getValue('energy') >= 10
    // },
    // sleep: {
    //     id: 'sleep',
    //     name: 'Sleep',
    //     icon: '😴',
    //     buttonClass: 'secondary',
    //     effects: [
    //         { statId: 'energy', amount: 30 },
    //         { statId: 'hunger', amount: -5 }
    //     ],
    //     animation: 'pet-sleeping',
    //     animationDuration: 2000,
    //     cooldown: 5000,
    //     canPerform: (statsManager) => statsManager.getValue('energy') < 100
    // }
};

/**
 * Actions Manager - handles performing actions and cooldowns
 */
export class ActionsManager {
    constructor(statsManager) {
        this.statsManager = statsManager;
        this.cooldowns = new Map();
        this.petType = null;
    }
    
    /**
     * Set the current pet type
     * @param {string} petType - Pet type ID
     */
    setPetType(petType) {
        this.petType = petType;
    }
    
    /**
     * Check if an action can be performed
     * @param {string} actionId - Action identifier
     * @returns {boolean} Whether action can be performed
     */
    canPerform(actionId) {
        const action = ACTIONS[actionId];
        if (!action) return false;
        
        // Check cooldown
        if (this.isOnCooldown(actionId)) return false;
        
        // Check action-specific conditions
        if (action.canPerform && !action.canPerform(this.statsManager)) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Check if an action is on cooldown
     * @param {string} actionId - Action identifier
     * @returns {boolean} Whether action is on cooldown
     */
    isOnCooldown(actionId) {
        const cooldownEnd = this.cooldowns.get(actionId);
        if (!cooldownEnd) return false;
        return Date.now() < cooldownEnd;
    }
    
    /**
     * Perform an action
     * @param {string} actionId - Action identifier
     * @returns {Object|null} Action result or null if couldn't perform
     */
    perform(actionId) {
        if (!this.canPerform(actionId)) return null;
        
        const action = ACTIONS[actionId];
        
        // Apply effects to stats
        for (const effect of action.effects) {
            this.statsManager.modifyStat(effect.statId, effect.amount);
        }
        
        // Set cooldown if applicable
        if (action.cooldown > 0) {
            this.cooldowns.set(actionId, Date.now() + action.cooldown);
        }
        
        // Get food particle (use pet's favorite if available)
        let foodParticle = action.foodParticle;
        if (actionId === 'feed' && this.petType) {
            const favoriteFood = getPetTrait(this.petType, 'favoriteFood', null);
            if (favoriteFood) {
                foodParticle = favoriteFood;
            }
        }
        
        // Emit event
        const result = {
            actionId,
            action,
            animation: action.animation,
            animationDuration: action.animationDuration,
            foodParticle
        };
        
        events.emit(EVENTS.ACTION_PERFORMED, result);
        
        return result;
    }
    
    /**
     * Reset all cooldowns
     */
    resetCooldowns() {
        this.cooldowns.clear();
    }
    
    /**
     * Reset manager state
     */
    reset() {
        this.petType = null;
        this.resetCooldowns();
    }
}

/**
 * Get all registered action IDs
 * @returns {string[]} Array of action IDs
 */
export function getActionIds() {
    return Object.keys(ACTIONS);
}

/**
 * Get action configuration
 * @param {string} actionId - Action identifier
 * @returns {Object|null} Action config or null
 */
export function getActionConfig(actionId) {
    return ACTIONS[actionId] || null;
}

