// ============================================
// GAME CONFIGURATION
// Adjust these values to tune game balance
// ============================================

export const CONFIG = {
    // Timing
    STAT_DECAY_INTERVAL: 5000,      // How often stats decay (ms)
    FEED_ANIMATION_DURATION: 900,   // Feeding animation length (ms)
    
    // Stat thresholds for mood
    MOOD_THRESHOLDS: {
        happy: 70,
        neutral: 40,
        worried: 20
    },
    
    // Storage
    SAVE_KEY: 'pocketCritter',
    
    // UI
    MAX_PET_NAME_LENGTH: 20
};

