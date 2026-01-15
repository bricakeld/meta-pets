// ============================================
// POCKET CRITTERS - Main Application
// ============================================

import { CONFIG } from './config.js';
import { events, EVENTS } from './utils/events.js';
import { savePet, loadPet, clearPet, calculateOfflineDecay } from './utils/storage.js';
import { PET_TYPES, getPetTemplate, getPetType, getPetColors, getDefaultColor, getPetColor } from './pets/registry.js';
import { StatsManager, STATS, getStatIds, getStatConfig } from './features/stats.js';
import { ActionsManager, ACTIONS, getActionIds, getActionConfig } from './features/actions.js';

class VirtualPet {
    constructor() {
        this.petType = null;
        this.petName = '';
        this.petColor = null;
        
        // Initialize managers
        this.stats = new StatsManager();
        this.actions = new ActionsManager(this.stats);
        
        this.init();
    }
    
    init() {
        this.renderPetChoices();
        this.renderStatsPanel();
        this.renderActionButtons();
        this.bindEvents();
        this.subscribeToEvents();
        this.loadSavedPet();
    }
    
    // ========================================
    // DYNAMIC RENDERING
    // ========================================
    
    /**
     * Render pet selection buttons from registry
     */
    renderPetChoices() {
        const container = document.getElementById('pet-choices-container');
        container.innerHTML = '';
        
        for (const [petId, petData] of Object.entries(PET_TYPES)) {
            const button = document.createElement('button');
            button.className = 'pet-choice';
            button.dataset.pet = petId;
            button.innerHTML = `
                <div class="pet-preview ${petId}-preview">
                    ${petData.template}
                </div>
                <span>${petData.name}</span>
            `;
            container.appendChild(button);
        }
    }
    
    /**
     * Render stats panel from stats registry
     */
    renderStatsPanel() {
        const container = document.getElementById('stats-container');
        container.innerHTML = '';
        
        for (const statId of getStatIds()) {
            const stat = getStatConfig(statId);
            const statElement = document.createElement('div');
            statElement.className = 'stat';
            statElement.dataset.stat = statId;
            statElement.innerHTML = `
                <div class="stat-label">
                    <span class="stat-icon">${stat.icon}</span>
                    <span>${stat.name}</span>
                </div>
                <div class="stat-bar-container">
                    <div class="stat-bar" id="${statId}-bar">
                        <div class="stat-fill"></div>
                    </div>
                    <span class="stat-value" id="${statId}-value">100%</span>
                </div>
            `;
            container.appendChild(statElement);
        }
    }
    
    /**
     * Render action buttons from actions registry
     */
    renderActionButtons() {
        const container = document.getElementById('actions-container');
        
        // Clear existing action buttons (keep change-pet button)
        const changePetBtn = document.getElementById('change-pet-btn');
        container.innerHTML = '';
        
        for (const actionId of getActionIds()) {
            const action = getActionConfig(actionId);
            const button = document.createElement('button');
            button.id = `${actionId}-btn`;
            button.className = `btn action-btn ${action.buttonClass || ''}`;
            button.dataset.action = actionId;
            button.innerHTML = `
                <span class="btn-icon-large">${action.icon}</span>
                <span>${action.name}</span>
            `;
            container.appendChild(button);
        }
        
        // Re-add change pet button
        container.appendChild(changePetBtn);
    }
    
    // ========================================
    // EVENT BINDING
    // ========================================
    
    bindEvents() {
        // Pet selection (event delegation)
        document.getElementById('pet-choices-container').addEventListener('click', (e) => {
            const btn = e.target.closest('.pet-choice');
            if (btn) {
                this.selectPet(btn.dataset.pet);
            }
        });
        
        // Color selection (event delegation)
        document.getElementById('color-choices').addEventListener('click', (e) => {
            // Handle clicks on the button or anywhere in the wrapper
            const wrapper = e.target.closest('.color-choice-wrapper');
            if (wrapper) {
                const btn = wrapper.querySelector('.color-choice');
                if (btn) {
                    this.selectColor(btn.dataset.color);
                }
            }
        });
        
        // Name confirmation
        document.getElementById('confirm-name-btn').addEventListener('click', () => {
            this.confirmName();
        });
        
        document.getElementById('pet-name-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.confirmName();
        });
        
        // Action buttons (event delegation)
        document.getElementById('actions-container').addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (btn) {
                this.performAction(btn.dataset.action);
            }
        });
        
        // Rename button
        document.getElementById('rename-btn').addEventListener('click', () => {
            this.openRenameModal();
        });
        
        // Rename modal
        document.getElementById('confirm-rename').addEventListener('click', () => {
            this.confirmRename();
        });
        
        document.getElementById('cancel-rename').addEventListener('click', () => {
            this.closeRenameModal();
        });
        
        document.getElementById('rename-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.confirmRename();
        });
        
        // Change pet button
        document.getElementById('change-pet-btn').addEventListener('click', () => {
            this.changePet();
        });
        
        // Back button in naming screen
        document.getElementById('back-to-selection-btn').addEventListener('click', () => {
            this.backToSelection();
        });
        
        // Close modal on outside click
        document.getElementById('rename-modal').addEventListener('click', (e) => {
            if (e.target.id === 'rename-modal') {
                this.closeRenameModal();
            }
        });
    }
    
    /**
     * Subscribe to event bus events
     */
    subscribeToEvents() {
        // Update UI when stats change
        events.on(EVENTS.STAT_CHANGED, ({ statId, newValue, stat }) => {
            this.updateStatDisplay(statId, newValue, stat);
            this.save();
        });
        
        // Handle critical stats (low values)
        events.on(EVENTS.STAT_CRITICAL, ({ statId }) => {
            console.log(`Warning: ${statId} is critically low!`);
        });
    }
    
    // ========================================
    // PET LIFECYCLE
    // ========================================
    
    selectPet(type) {
        this.petType = type;
        const petData = getPetType(type);
        
        // Set default color
        this.petColor = getDefaultColor(type);
        
        // Update naming screen
        document.getElementById('pet-type-label').textContent = petData.name;
        
        // Get breed-specific template
        document.getElementById('naming-pet-display').innerHTML = getPetTemplate(type, this.petColor);
        
        // Render color choices
        this.renderColorChoices(type);
        
        // Apply default color to preview
        this.applyColorToElement(document.getElementById('naming-pet-display'), type, this.petColor);
        
        this.showScreen('naming-screen');
        events.emit(EVENTS.PET_SELECTED, { type, petData });
    }
    
    /**
     * Render color selection buttons for a pet type
     */
    renderColorChoices(petType) {
        const container = document.getElementById('color-choices');
        container.innerHTML = '';
        
        const colors = getPetColors(petType);
        const defaultColor = getDefaultColor(petType);
        
        for (const [colorId, colorData] of Object.entries(colors)) {
            // Create wrapper for color choice and label
            const wrapper = document.createElement('div');
            wrapper.className = 'color-choice-wrapper';
            
            const button = document.createElement('button');
            button.className = 'color-choice';
            button.dataset.color = colorId;
            button.title = colorData.name;
            button.setAttribute('aria-label', `Select ${colorData.name}`);
            
            // Set CSS custom properties for the button gradient
            button.style.setProperty('--color-primary', colorData.primary);
            button.style.setProperty('--color-secondary', colorData.secondary);
            button.style.setProperty('--color-accent', colorData.accent);
            
            // Mark default as selected
            if (colorId === defaultColor) {
                button.classList.add('selected');
            }
            
            // Create breed label
            const label = document.createElement('span');
            label.className = 'color-choice-label';
            label.textContent = colorData.name;
            
            wrapper.appendChild(button);
            wrapper.appendChild(label);
            container.appendChild(wrapper);
        }
    }
    
    /**
     * Handle color selection
     */
    selectColor(colorId) {
        this.petColor = colorId;
        
        // Update UI selection state
        document.querySelectorAll('.color-choice').forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.color === colorId);
        });
        
        // Apply color to preview pet - regenerate template for breed-specific features
        const previewDisplay = document.getElementById('naming-pet-display');
        previewDisplay.classList.add('color-changing');
        
        // Get breed-specific template
        previewDisplay.innerHTML = getPetTemplate(this.petType, colorId);
        this.applyColorToElement(previewDisplay, this.petType, colorId);
        
        setTimeout(() => {
            previewDisplay.classList.remove('color-changing');
        }, 300);
    }
    
    /**
     * Apply pet color to a display element
     */
    applyColorToElement(element, petType, colorId) {
        const colorData = getPetColor(petType, colorId);
        if (!colorData) return;
        
        // Find the pet element inside and apply CSS variables
        const petElement = element.querySelector(`.${petType}`);
        if (petElement) {
            petElement.style.setProperty(`--${petType}-primary`, colorData.primary);
            petElement.style.setProperty(`--${petType}-secondary`, colorData.secondary);
            petElement.style.setProperty(`--${petType}-accent`, colorData.accent);
        }
    }
    
    confirmName() {
        const nameInput = document.getElementById('pet-name-input');
        const name = nameInput.value.trim();
        
        if (!name) {
            nameInput.classList.add('shake');
            setTimeout(() => nameInput.classList.remove('shake'), 500);
            return;
        }
        
        this.petName = name;
        
        // Initialize managers with pet type
        this.stats.setPetType(this.petType);
        this.stats.initializeStats();
        this.actions.setPetType(this.petType);
        
        this.setupPetScreen();
        this.showScreen('pet-screen');
        this.stats.startDecay();
        this.save();
        
        events.emit(EVENTS.PET_NAMED, { name, petType: this.petType });
    }
    
    setupPetScreen() {
        document.getElementById('display-name').textContent = this.petName;
        
        // Get breed-specific template
        document.getElementById('main-pet-display').innerHTML = getPetTemplate(this.petType, this.petColor);
        
        // Apply pet color
        this.applyColorToElement(document.getElementById('main-pet-display'), this.petType, this.petColor);
        
        // Update all stat displays
        for (const statId of getStatIds()) {
            const stat = getStatConfig(statId);
            this.updateStatDisplay(statId, this.stats.getValue(statId), stat);
        }
        
        this.updateMoodIndicator();
    }
    
    changePet() {
        this.stats.reset();
        this.actions.reset();
        clearPet();
        
        this.petType = null;
        this.petName = '';
        this.petColor = null;
        
        document.getElementById('pet-name-input').value = '';
        this.showScreen('selection-screen');
        
        events.emit(EVENTS.PET_CHANGED);
    }
    
    backToSelection() {
        this.petType = null;
        this.petColor = null;
        document.getElementById('pet-name-input').value = '';
        this.showScreen('selection-screen');
    }
    
    // ========================================
    // ACTIONS
    // ========================================
    
    performAction(actionId) {
        const result = this.actions.perform(actionId);
        if (!result) return;
        
        this.playActionAnimation(result);
    }
    
    playActionAnimation(result) {
        const foodParticle = document.getElementById('food-particle');
        const petDisplay = document.getElementById('main-pet-display');
        
        // Update food particle emoji
        foodParticle.textContent = result.foodParticle;
        
        // Position food above pet
        foodParticle.style.left = '50%';
        foodParticle.style.top = '80px';
        foodParticle.style.transform = 'translateX(-50%)';
        foodParticle.classList.remove('hidden');
        foodParticle.classList.add('animate');
        
        // Add animation to pet
        if (result.animation) {
            petDisplay.classList.add(result.animation);
        }
        
        // Remove animations after duration
        setTimeout(() => {
            foodParticle.classList.remove('animate');
            foodParticle.classList.add('hidden');
            if (result.animation) {
                petDisplay.classList.remove(result.animation);
            }
        }, result.animationDuration);
    }
    
    // ========================================
    // UI UPDATES
    // ========================================
    
    updateStatDisplay(statId, value, stat) {
        const bar = document.getElementById(`${statId}-bar`);
        const valueDisplay = document.getElementById(`${statId}-value`);
        
        if (!bar || !valueDisplay) return;
        
        const fill = bar.querySelector('.stat-fill');
        fill.style.width = `${value}%`;
        valueDisplay.textContent = `${Math.round(value)}%`;
        
        // Update color gradient position
        const position = 100 - value;
        fill.style.backgroundPosition = `${position}% 0`;
        
        // Update mood and hungry state
        this.updateMoodIndicator();
        this.updateHungryState();
    }
    
    updateMoodIndicator() {
        const moodIndicator = document.getElementById('mood-indicator');
        
        // Calculate average of all stats for mood
        const statIds = getStatIds();
        const avgStat = statIds.reduce((sum, id) => sum + this.stats.getValue(id), 0) / statIds.length;
        
        const { happy, neutral, worried } = CONFIG.MOOD_THRESHOLDS;
        
        if (avgStat >= happy) {
            moodIndicator.textContent = '😊';
        } else if (avgStat >= neutral) {
            moodIndicator.textContent = '😐';
        } else if (avgStat >= worried) {
            moodIndicator.textContent = '😟';
        } else {
            moodIndicator.textContent = '😢';
        }
    }
    
    updateHungryState() {
        const petDisplay = document.getElementById('main-pet-display');
        const hunger = this.stats.getValue('hunger');
        
        petDisplay.classList.toggle('pet-hungry', hunger < CONFIG.MOOD_THRESHOLDS.worried);
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        
        events.emit(EVENTS.SCREEN_CHANGED, { screenId });
    }
    
    // ========================================
    // RENAME MODAL
    // ========================================
    
    openRenameModal() {
        const modal = document.getElementById('rename-modal');
        const input = document.getElementById('rename-input');
        
        input.value = this.petName;
        modal.classList.remove('hidden');
        input.focus();
        input.select();
        
        events.emit(EVENTS.MODAL_OPENED, { modalId: 'rename-modal' });
    }
    
    closeRenameModal() {
        document.getElementById('rename-modal').classList.add('hidden');
        events.emit(EVENTS.MODAL_CLOSED, { modalId: 'rename-modal' });
    }
    
    confirmRename() {
        const input = document.getElementById('rename-input');
        const newName = input.value.trim();
        
        if (!newName) return;
        
        this.petName = newName;
        document.getElementById('display-name').textContent = newName;
        this.closeRenameModal();
        this.save();
    }
    
    // ========================================
    // PERSISTENCE
    // ========================================
    
    save() {
        savePet({
            petType: this.petType,
            petName: this.petName,
            petColor: this.petColor,
            stats: this.stats.getAllValues()
        });
    }
    
    loadSavedPet() {
        const saved = loadPet();
        if (!saved || !saved.petType || !saved.petName) return;
        
        // Validate pet type still exists
        if (!getPetType(saved.petType)) {
            clearPet();
            return;
        }
        
        this.petType = saved.petType;
        this.petName = saved.petName;
        this.petColor = saved.petColor || getDefaultColor(saved.petType);
        
        // Initialize managers
        this.stats.setPetType(this.petType);
        this.actions.setPetType(this.petType);
        
        // Load stats with offline decay
        if (saved.stats) {
            for (const [statId, value] of Object.entries(saved.stats)) {
                const stat = getStatConfig(statId);
                if (stat) {
                    const decayRate = this.stats.getDecayRate(statId);
                    const decayedValue = calculateOfflineDecay(saved.lastSaved, value, decayRate);
                    this.stats.setValue(statId, decayedValue);
                }
            }
        }
        
        // Show pet screen
        this.setupPetScreen();
        this.showScreen('pet-screen');
        this.stats.startDecay();
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new VirtualPet();
});

