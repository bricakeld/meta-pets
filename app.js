// Pocket Critters - Virtual Pet App

// ============================================
// PET REGISTRY - Add new pets here!
// ============================================
const PET_TYPES = {
    dog: {
        name: 'Dog',
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

class VirtualPet {
    constructor() {
        this.petType = null;
        this.petName = '';
        this.hunger = 100;
        this.hungerDecayRate = 2; // Decrease per interval
        this.hungerInterval = null;
        
        this.init();
    }
    
    init() {
        this.renderPetChoices();
        this.bindEvents();
        this.loadSavedPet();
    }
    
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
    
    bindEvents() {
        // Pet selection (use event delegation for dynamically created buttons)
        document.getElementById('pet-choices-container').addEventListener('click', (e) => {
            const btn = e.target.closest('.pet-choice');
            if (btn) {
                const petType = btn.dataset.pet;
                this.selectPet(petType);
            }
        });
        
        // Confirm name
        document.getElementById('confirm-name-btn').addEventListener('click', () => {
            this.confirmName();
        });
        
        document.getElementById('pet-name-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.confirmName();
        });
        
        // Feed button
        document.getElementById('feed-btn').addEventListener('click', () => {
            this.feedPet();
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
        
        // Close modal on outside click
        document.getElementById('rename-modal').addEventListener('click', (e) => {
            if (e.target.id === 'rename-modal') {
                this.closeRenameModal();
            }
        });
    }
    
    selectPet(type) {
        this.petType = type;
        
        // Update naming screen
        document.getElementById('pet-type-label').textContent = this.capitalize(type);
        document.getElementById('naming-pet-display').innerHTML = this.getPetHTML(type);
        
        this.showScreen('naming-screen');
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
        this.hunger = 100;
        
        this.setupPetScreen();
        this.showScreen('pet-screen');
        this.startHungerDecay();
        this.savePet();
    }
    
    setupPetScreen() {
        document.getElementById('display-name').textContent = this.petName;
        document.getElementById('main-pet-display').innerHTML = this.getPetHTML(this.petType);
        this.updateHungerDisplay();
    }
    
    feedPet() {
        if (this.hunger >= 100) return;
        
        // Show food animation
        const foodParticle = document.getElementById('food-particle');
        const petDisplay = document.getElementById('main-pet-display');
        
        // Position food above pet
        foodParticle.style.left = '50%';
        foodParticle.style.top = '80px';
        foodParticle.style.transform = 'translateX(-50%)';
        foodParticle.classList.remove('hidden');
        foodParticle.classList.add('animate');
        
        // Add eating animation to pet
        petDisplay.classList.add('pet-eating');
        
        // Increase hunger
        this.hunger = Math.min(100, this.hunger + 25);
        this.updateHungerDisplay();
        this.savePet();
        
        // Remove animations
        setTimeout(() => {
            foodParticle.classList.remove('animate');
            foodParticle.classList.add('hidden');
            petDisplay.classList.remove('pet-eating');
        }, 900);
    }
    
    startHungerDecay() {
        // Clear any existing interval
        if (this.hungerInterval) {
            clearInterval(this.hungerInterval);
        }
        
        // Decrease hunger every 5 seconds
        this.hungerInterval = setInterval(() => {
            if (this.hunger > 0) {
                this.hunger = Math.max(0, this.hunger - this.hungerDecayRate);
                this.updateHungerDisplay();
                this.savePet();
            }
        }, 5000);
    }
    
    updateHungerDisplay() {
        const hungerBar = document.getElementById('hunger-bar');
        const hungerValue = document.getElementById('hunger-value');
        const hungerFill = hungerBar.querySelector('.stat-fill');
        const moodIndicator = document.getElementById('mood-indicator');
        const petDisplay = document.getElementById('main-pet-display');
        
        // Update bar width
        hungerFill.style.width = `${this.hunger}%`;
        
        // Update percentage text
        hungerValue.textContent = `${Math.round(this.hunger)}%`;
        
        // Update mood indicator and pet state
        petDisplay.classList.remove('pet-hungry');
        
        if (this.hunger >= 70) {
            moodIndicator.textContent = '😊';
        } else if (this.hunger >= 40) {
            moodIndicator.textContent = '😐';
        } else if (this.hunger >= 20) {
            moodIndicator.textContent = '😟';
            petDisplay.classList.add('pet-hungry');
        } else {
            moodIndicator.textContent = '😢';
            petDisplay.classList.add('pet-hungry');
        }
        
        // Change stat bar color position based on hunger
        const position = 100 - this.hunger;
        hungerFill.style.backgroundPosition = `${position}% 0`;
    }
    
    openRenameModal() {
        const modal = document.getElementById('rename-modal');
        const input = document.getElementById('rename-input');
        
        input.value = this.petName;
        modal.classList.remove('hidden');
        input.focus();
        input.select();
    }
    
    closeRenameModal() {
        document.getElementById('rename-modal').classList.add('hidden');
    }
    
    confirmRename() {
        const input = document.getElementById('rename-input');
        const newName = input.value.trim();
        
        if (!newName) return;
        
        this.petName = newName;
        document.getElementById('display-name').textContent = newName;
        this.closeRenameModal();
        this.savePet();
    }
    
    changePet() {
        // Stop hunger decay
        if (this.hungerInterval) {
            clearInterval(this.hungerInterval);
        }
        
        // Clear saved data
        localStorage.removeItem('pocketCritter');
        
        // Reset state
        this.petType = null;
        this.petName = '';
        this.hunger = 100;
        
        // Clear inputs
        document.getElementById('pet-name-input').value = '';
        
        this.showScreen('selection-screen');
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
    
    getPetHTML(type) {
        const pet = PET_TYPES[type];
        return pet ? pet.template : '';
    }
    
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    savePet() {
        const data = {
            petType: this.petType,
            petName: this.petName,
            hunger: this.hunger,
            lastSaved: Date.now()
        };
        localStorage.setItem('pocketCritter', JSON.stringify(data));
    }
    
    loadSavedPet() {
        const saved = localStorage.getItem('pocketCritter');
        
        if (!saved) return;
        
        try {
            const data = JSON.parse(saved);
            
            if (!data.petType || !data.petName) return;
            
            this.petType = data.petType;
            this.petName = data.petName;
            
            // Calculate hunger decay while away
            const timePassed = Date.now() - data.lastSaved;
            const decayAmount = Math.floor(timePassed / 5000) * this.hungerDecayRate;
            this.hunger = Math.max(0, data.hunger - decayAmount);
            
            // Show pet screen directly
            this.setupPetScreen();
            this.showScreen('pet-screen');
            this.startHungerDecay();
            
        } catch (e) {
            console.error('Failed to load saved pet:', e);
            localStorage.removeItem('pocketCritter');
        }
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new VirtualPet();
});

