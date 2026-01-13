// ============================================
// ACCESSORIES REGISTRY
// Add new accessories by creating entries here!
// ============================================

export const ACCESSORY_SLOTS = {
    hat: {
        id: 'hat',
        name: 'Hat',
        icon: '🎩'
    },
    outfit: {
        id: 'outfit',
        name: 'Outfit',
        icon: '👕'
    }
};

export const ACCESSORIES = {
    // ========== HATS ==========
    none_hat: {
        id: 'none_hat',
        slot: 'hat',
        name: 'None',
        icon: '❌',
        template: ''
    },
    top_hat: {
        id: 'top_hat',
        slot: 'hat',
        name: 'Top Hat',
        icon: '🎩',
        template: `
            <div class="accessory hat top-hat">
                <div class="hat-top"></div>
                <div class="hat-band"></div>
                <div class="hat-brim"></div>
            </div>
        `
    },
    party_hat: {
        id: 'party_hat',
        slot: 'hat',
        name: 'Party Hat',
        icon: '🥳',
        template: `
            <div class="accessory hat party-hat">
                <div class="hat-cone"></div>
                <div class="hat-pom"></div>
                <div class="hat-stripe s1"></div>
                <div class="hat-stripe s2"></div>
            </div>
        `
    },
    crown: {
        id: 'crown',
        slot: 'hat',
        name: 'Crown',
        icon: '👑',
        template: `
            <div class="accessory hat crown">
                <div class="crown-base"></div>
                <div class="crown-point p1"></div>
                <div class="crown-point p2"></div>
                <div class="crown-point p3"></div>
                <div class="crown-gem"></div>
            </div>
        `
    },
    bow: {
        id: 'bow',
        slot: 'hat',
        name: 'Bow',
        icon: '🎀',
        template: `
            <div class="accessory hat bow">
                <div class="bow-loop left"></div>
                <div class="bow-loop right"></div>
                <div class="bow-knot"></div>
            </div>
        `
    },
    wizard_hat: {
        id: 'wizard_hat',
        slot: 'hat',
        name: 'Wizard Hat',
        icon: '🧙',
        template: `
            <div class="accessory hat wizard-hat">
                <div class="wizard-cone"></div>
                <div class="wizard-brim"></div>
                <div class="wizard-star s1">✦</div>
                <div class="wizard-star s2">✦</div>
            </div>
        `
    },
    
    // ========== OUTFITS ==========
    none_outfit: {
        id: 'none_outfit',
        slot: 'outfit',
        name: 'None',
        icon: '❌',
        template: ''
    },
    bowtie: {
        id: 'bowtie',
        slot: 'outfit',
        name: 'Bowtie',
        icon: '🎀',
        template: `
            <div class="accessory outfit bowtie">
                <div class="bowtie-loop left"></div>
                <div class="bowtie-loop right"></div>
                <div class="bowtie-knot"></div>
            </div>
        `
    },
    cape: {
        id: 'cape',
        slot: 'outfit',
        name: 'Cape',
        icon: '🦸',
        template: `
            <div class="accessory outfit cape">
                <div class="cape-body"></div>
                <div class="cape-clasp"></div>
            </div>
        `
    },
    scarf: {
        id: 'scarf',
        slot: 'outfit',
        name: 'Scarf',
        icon: '🧣',
        template: `
            <div class="accessory outfit scarf">
                <div class="scarf-wrap"></div>
                <div class="scarf-tail"></div>
                <div class="scarf-fringe f1"></div>
                <div class="scarf-fringe f2"></div>
                <div class="scarf-fringe f3"></div>
            </div>
        `
    },
    bandana: {
        id: 'bandana',
        slot: 'outfit',
        name: 'Bandana',
        icon: '🏴‍☠️',
        template: `
            <div class="accessory outfit bandana">
                <div class="bandana-body"></div>
                <div class="bandana-knot"></div>
            </div>
        `
    },
    sweater: {
        id: 'sweater',
        slot: 'outfit',
        name: 'Sweater',
        icon: '🧶',
        template: `
            <div class="accessory outfit sweater">
                <div class="sweater-body"></div>
                <div class="sweater-pattern"></div>
            </div>
        `
    }
};

/**
 * Get all accessories for a specific slot
 * @param {string} slotId - Slot identifier (hat, outfit)
 * @returns {Object[]} Array of accessories for that slot
 */
export function getAccessoriesBySlot(slotId) {
    return Object.values(ACCESSORIES).filter(acc => acc.slot === slotId);
}

/**
 * Get a specific accessory by ID
 * @param {string} accessoryId - Accessory identifier
 * @returns {Object|null} Accessory data or null
 */
export function getAccessory(accessoryId) {
    return ACCESSORIES[accessoryId] || null;
}

/**
 * Get all slot definitions
 * @returns {Object} All accessory slots
 */
export function getAccessorySlots() {
    return ACCESSORY_SLOTS;
}

/**
 * Get the default accessories (none for each slot)
 * @returns {Object} Default accessory selections
 */
export function getDefaultAccessories() {
    return {
        hat: 'none_hat',
        outfit: 'none_outfit'
    };
}

