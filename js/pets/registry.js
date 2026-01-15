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
        // Available color themes for this pet
        colors: {
            tan: {
                name: 'Tan',
                primary: '#deb887',
                secondary: '#c19a6b',
                accent: '#8b6914'
            },
            golden: {
                name: 'Golden',
                primary: '#f4d03f',
                secondary: '#d4ac0d',
                accent: '#9a7d0a'
            },
            chocolate: {
                name: 'Chocolate',
                primary: '#8b5a2b',
                secondary: '#6b4423',
                accent: '#4a2c17'
            },
            white: {
                name: 'White',
                primary: '#f5f5f5',
                secondary: '#e0e0e0',
                accent: '#a0a0a0'
            },
            black: {
                name: 'Black',
                primary: '#4a4a4a',
                secondary: '#333333',
                accent: '#1a1a1a'
            },
            blue: {
                name: 'Bright Blue',
                primary: '#00bfff',
                secondary: '#0099cc',
                accent: '#006699'
            }
        },
        defaultColor: 'tan',
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
        // Available color themes for this pet
        colors: {
            gray: {
                name: 'Gray',
                primary: '#a0a0a0',
                secondary: '#808080',
                accent: '#909090'
            },
            orange: {
                name: 'Orange Tabby',
                primary: '#e67e22',
                secondary: '#d35400',
                accent: '#ba4a00'
            },
            black: {
                name: 'Black',
                primary: '#3d3d3d',
                secondary: '#2a2a2a',
                accent: '#1a1a1a'
            },
            white: {
                name: 'White',
                primary: '#f5f5f5',
                secondary: '#e8e8e8',
                accent: '#d0d0d0'
            },
            siamese: {
                name: 'Siamese',
                primary: '#f5e6d3',
                secondary: '#e8d4bc',
                accent: '#6b4423'
            },
            blue: {
                name: 'Bright Blue',
                primary: '#00bfff',
                secondary: '#0099cc',
                accent: '#006699'
            }
        },
        defaultColor: 'gray',
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
    },
    
    capybara: {
        name: 'Capybara',
        traits: {
            hungerDecayMultiplier: 1.0,      // Capybaras eat at a normal rate
            happinessDecayMultiplier: 0.6,   // Capybaras are super chill and stay happy
            favoriteFood: '🍉'
        },
        // Available color themes for this pet
        colors: {
            tan: {
                name: 'Tan',
                primary: '#deb887',
                secondary: '#c19a6b',
                accent: '#8b6914'
            },
            golden: {
                name: 'Golden',
                primary: '#f4d03f',
                secondary: '#d4ac0d',
                accent: '#9a7d0a'
            },
            chocolate: {
                name: 'Chocolate',
                primary: '#8b5a2b',
                secondary: '#6b4423',
                accent: '#4a2c17'
            },
            white: {
                name: 'White',
                primary: '#f5f5f5',
                secondary: '#e0e0e0',
                accent: '#a0a0a0'
            },
            black: {
                name: 'Black',
                primary: '#4a4a4a',
                secondary: '#333333',
                accent: '#1a1a1a'
            },
            blue: {
                name: 'Bright Blue',
                primary: '#00bfff',
                secondary: '#0099cc',
                accent: '#006699'
            }
        },
        defaultColor: 'tan',
        template: `
            <div class="capybara">
                <div class="capybara-body"></div>
                <div class="capybara-head">
                    <div class="capybara-ear left"></div>
                    <div class="capybara-ear right"></div>
                    <div class="capybara-face">
                        <div class="capybara-eye left"></div>
                        <div class="capybara-eye right"></div>
                        <div class="capybara-snout">
                            <div class="capybara-nose"></div>
                        </div>
                    </div>
                </div>
                <div class="capybara-legs">
                    <div class="capybara-leg front-left"></div>
                    <div class="capybara-leg front-right"></div>
                    <div class="capybara-leg back-left"></div>
                    <div class="capybara-leg back-right"></div>
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

/**
 * Get available colors for a pet type
 * @param {string} typeId - Pet type identifier
 * @returns {Object} Color options object
 */
export function getPetColors(typeId) {
    const pet = getPetType(typeId);
    return pet?.colors || {};
}

/**
 * Get the default color for a pet type
 * @param {string} typeId - Pet type identifier
 * @returns {string} Default color ID
 */
export function getDefaultColor(typeId) {
    const pet = getPetType(typeId);
    return pet?.defaultColor || Object.keys(pet?.colors || {})[0] || 'default';
}

/**
 * Get a specific color theme for a pet type
 * @param {string} typeId - Pet type identifier
 * @param {string} colorId - Color identifier
 * @returns {Object|null} Color theme object
 */
export function getPetColor(typeId, colorId) {
    const colors = getPetColors(typeId);
    return colors[colorId] || null;
}

