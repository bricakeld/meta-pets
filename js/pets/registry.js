// ============================================
// PET REGISTRY
// Add new pets by creating a new entry here!
// Each pet needs: name, template, and optional traits
// ============================================

export const PET_TYPES = {
    dog: {
        name: 'Dog',
        // Pet-specific trait modifiers (multipliers on base values)
        traits: {
            hungerDecayMultiplier: 1.2,     // Dogs get hungrier faster
            happinessDecayMultiplier: 0.8,   // Dogs stay happy longer
            favoriteFood: '🦴'
        },
        template: `
            <div class="dog">
                <div class="dog-body"></div>
                <div class="dog-head">
                    <div class="dog-ear left"></div>
                    <div class="dog-ear right"></div>
                    <div class="dog-face">
                        <div class="dog-eye left"></div>
                        <div class="dog-eye right"></div>
                        <div class="dog-nose"></div>
                        <div class="dog-mouth"></div>
                    </div>
                </div>
                <div class="dog-tail"></div>
                <div class="dog-legs">
                    <div class="dog-leg front-left"></div>
                    <div class="dog-leg front-right"></div>
                    <div class="dog-leg back-left"></div>
                    <div class="dog-leg back-right"></div>
                </div>
            </div>
        `
    },
    
    cat: {
        name: 'Cat',
        traits: {
            hungerDecayMultiplier: 0.9,      // Cats need less food
            happinessDecayMultiplier: 1.1,   // Cats get bored faster
            favoriteFood: '🐟'
        },
        template: `
            <div class="cat">
                <div class="cat-body"></div>
                <div class="cat-head">
                    <div class="cat-ear left"></div>
                    <div class="cat-ear right"></div>
                    <div class="cat-face">
                        <div class="cat-eye left"></div>
                        <div class="cat-eye right"></div>
                        <div class="cat-nose"></div>
                        <div class="cat-whiskers left">
                            <div class="whisker"></div>
                            <div class="whisker"></div>
                            <div class="whisker"></div>
                        </div>
                        <div class="cat-whiskers right">
                            <div class="whisker"></div>
                            <div class="whisker"></div>
                            <div class="whisker"></div>
                        </div>
                    </div>
                </div>
                <div class="cat-tail"></div>
                <div class="cat-legs">
                    <div class="cat-leg front-left"></div>
                    <div class="cat-leg front-right"></div>
                    <div class="cat-leg back-left"></div>
                    <div class="cat-leg back-right"></div>
                </div>
            </div>
        `
    }
};

/**
 * Get a pet type definition
 * @param {string} typeId - Pet type identifier
 * @returns {Object|null} Pet type data or null
 */
export function getPetType(typeId) {
    return PET_TYPES[typeId] || null;
}

/**
 * Get the HTML template for a pet type
 * @param {string} typeId - Pet type identifier
 * @returns {string} HTML template string
 */
export function getPetTemplate(typeId) {
    const pet = getPetType(typeId);
    return pet ? pet.template : '';
}

/**
 * Get all registered pet type IDs
 * @returns {string[]} Array of pet type IDs
 */
export function getPetTypeIds() {
    return Object.keys(PET_TYPES);
}

/**
 * Get a trait value for a pet type, with fallback to default
 * @param {string} typeId - Pet type identifier
 * @param {string} traitName - Name of the trait
 * @param {*} defaultValue - Default if trait not found
 * @returns {*} Trait value
 */
export function getPetTrait(typeId, traitName, defaultValue = 1) {
    const pet = getPetType(typeId);
    if (!pet || !pet.traits) return defaultValue;
    return pet.traits[traitName] ?? defaultValue;
}

