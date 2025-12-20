// DOM Elements
const textInput = document.getElementById('text-input');
const textDisplay = document.getElementById('text-display');
const textColor = document.getElementById('text-color');
const colorSwatches = document.querySelectorAll('.color-swatch');
const fontSize = document.getElementById('font-size');
const fontSizeValue = document.getElementById('font-size-value');
const clearBtn = document.getElementById('clear-btn');
const randomBtn = document.getElementById('random-btn');
const downloadBtn = document.getElementById('download-btn');
const printBtn = document.getElementById('print-btn');
const copyBtn = document.getElementById('copy-btn');
const effectsGrid = document.querySelector('.effects-grid');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const visitorCounter = document.getElementById('visitor-counter');
const footerVisitorCounter = document.getElementById('footer-visitor-counter');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Current effect state
let currentEffect = null;
let visitorCount = 0;

// Effects data
const effects = [
    {
        name: "Neon Purple",
        description: "Vibrant purple neon glow",
        color: "#8a2be2",
        shadow: "0 0 10px #8a2be2, 0 0 20px #8a2be2, 0 0 40px #8a2be2, 0 0 80px #8a2be2"
    },
    {
        name: "Electric Blue",
        description: "Electric blue aura effect",
        color: "#00ffff",
        shadow: "0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 80px #00ffff"
    },
    {
        name: "Fire Red",
        description: "Fiery red glowing text",
        color: "#ff4a4a",
        shadow: "0 0 10px #ff4a4a, 0 0 20px #ff4a4a, 0 0 40px #ff4a4a, 0 0 80px #ff4a4a"
    },
    {
        name: "Acid Green",
        description: "Toxic green neon effect",
        color: "#4aff6b",
        shadow: "0 0 10px #4aff6b, 0 0 20px #4aff6b, 0 0 40px #4aff6b, 0 0 80px #4aff6b"
    },
    {
        name: "Sunset Orange",
        description: "Warm orange sunset glow",
        color: "#ffb74a",
        shadow: "0 0 10px #ffb74a, 0 0 20px #ffb74a, 0 0 40px #ffb74a, 0 0 80px #ffb74a"
    },
    {
        name: "Cosmic Purple",
        description: "Deep cosmic purple aura",
        color: "#9d4aff",
        shadow: "0 0 10px #9d4aff, 0 0 20px #9d4aff, 0 0 40px #9d4aff, 0 0 80px #9d4aff"
    },
    {
        name: "Ice Blue",
        description: "Cool ice blue glow",
        color: "#4af2ff",
        shadow: "0 0 10px #4af2ff, 0 0 20px #4af2ff, 0 0 40px #4af2ff, 0 0 80px #4af2ff"
    },
    {
        name: "Hot Pink",
        description: "Vibrant pink neon",
        color: "#ff4ad8",
        shadow: "0 0 10px #ff4ad8, 0 0 20px #ff4ad8, 0 0 40px #ff4ad8, 0 0 80px #ff4ad8"
    },
    {
        name: "Gold Glow",
        description: "Royal golden aura",
        color: "#ffd700",
        shadow: "0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 40px #ffd700, 0 0 80px #ffd700"
    },
    {
        name: "Aqua Marine",
        description: "Ocean aqua marine glow",
        color: "#4affdd",
        shadow: "0 0 10px #4affdd, 0 0 20px #4affdd, 0 0 40px #4affdd, 0 0 80px #4affdd"
    },
    {
        name: "Lava Red",
        description: "Molten lava effect",
        color: "#ff3300",
        shadow: "0 0 10px #ff3300, 0 0 20px #ff3300, 0 0 40px #ff3300, 0 0 80px #ff3300"
    },
    {
        name: "Emerald Green",
        description: "Rich emerald green",
        color: "#00cc66",
        shadow: "0 0 10px #00cc66, 0 0 20px #00cc66, 0 0 40px #00cc66, 0 0 80px #00cc66"
    },
    {
        name: "Neon Yellow",
        description: "Bright yellow neon",
        color: "#ffff00",
        shadow: "0 0 10px #ffff00, 0 0 20px #ffff00, 0 0 40px #ffff00, 0 0 80px #ffff00"
    },
    {
        name: "Royal Blue",
        description: "Deep royal blue",
        color: "#4169e1",
        shadow: "0 0 10px #4169e1, 0 0 20px #4169e1, 0 0 40px #4169e1, 0 0 80px #4169e1"
    },
    {
        name: "Magenta Pulse",
        description: "Pulsing magenta effect",
        color: "#ff00ff",
        shadow: "0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff, 0 0 80px #ff00ff, 0 0 100px #ff00ff"
    },
    {
        name: "Cyber Green",
        description: "Matrix-style green",
        color: "#00ff00",
        shadow: "0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 40px #00ff00, 0 0 80px #00ff00"
    },
    {
        name: "Sunrise Orange",
        description: "Warm sunrise glow",
        color: "#ff8c00",
        shadow: "0 0 10px #ff8c00, 0 0 20px #ff8c00, 0 0 40px #ff8c00, 0 0 80px #ff8c00"
    },
    {
        name: "Twilight Purple",
        description: "Twilight purple aura",
        color: "#9370db",
        shadow: "0 0 10px #9370db, 0 0 20px #9370db, 0 0 40px #9370db, 0 0 80px #9370db"
    },
    {
        name: "Ocean Blue",
        description: "Deep ocean blue",
        color: "#1e90ff",
        shadow: "0 0 10px #1e90ff, 0 0 20px #1e90ff, 0 0 40px #1e90ff, 0 0 80px #1e90ff"
    },
    {
        name: "Ruby Red",
        description: "Sparkling ruby effect",
        color: "#e0115f",
        shadow: "0 0 10px #e0115f, 0 0 20px #e0115f, 0 0 40px #e0115f, 0 0 80px #e0115f"
    },
    {
        name: "Amethyst Purple",
        description: "Crystal amethyst glow",
        color: "#9966cc",
        shadow: "0 0 10px #9966cc, 0 0 20px #9966cc, 0 0 40px #9966cc, 0 0 80px #9966cc"
    },
    {
        name: "Turquoise Glow",
        description: "Bright turquoise aura",
        color: "#40e0d0",
        shadow: "0 0 10px #40e0d0, 0 0 20px #40e0d0, 0 0 40px #40e0d0, 0 0 80px #40e0d0"
    },
    {
        name: "Crimson Red",
        description: "Deep crimson red",
        color: "#dc143c",
        shadow: "0 0 10px #dc143c, 0 0 20px #dc143c, 0 0 40px #dc143c, 0 0 80px #dc143c"
    }
];

// Initialize the application
function init() {
    loadVisitorCount();
    generateEffects();
    setupEventListeners();
    applyRandomEffect();
    
    // Load saved text from localStorage
    const savedText = localStorage.getItem('auraText');
    if (savedText) {
        textInput.value = savedText;
        updateTextDisplay();
    }
    
    // Load saved effect from localStorage
    const savedEffect = localStorage.getItem('auraEffect');
    if (savedEffect) {
        const effect = JSON.parse(savedEffect);
        applyEffect(effect);
    }
}

// Load and update visitor count
function loadVisitorCount() {
    // Try to get visitor count from localStorage
    let count = localStorage.getItem('auraVisitorCount');
    
    if (!count) {
        // Start with a random number between 1500-2000 for demo
        count = Math.floor(Math.random() * 500) + 1500;
        localStorage.setItem('auraVisitorCount', count);
    }
    
    visitorCount = parseInt(count);
    
    // Increment for this visit
    visitorCount++;
    localStorage.setItem('auraVisitorCount', visitorCount);
    
    // Update display
    updateVisitorCounter();
}

// Update visitor counter display
function updateVisitorCounter() {
    const formattedCount = visitorCount.toLocaleString();
    visitorCounter.textContent = formattedCount;
    footerVisitorCounter.textContent = formattedCount;
}

// Generate effects grid
function generateEffects() {
    effectsGrid.innerHTML = '';
    
    effects.forEach((effect, index) => {
        const effectCard = document.createElement('div');
        effectCard.className = 'effect-card';
        effectCard.dataset.index = index;
        
        effectCard.innerHTML = `
            <div class="effect-preview">
                <span style="color: ${effect.color}; text-shadow: ${effect.shadow}">Aura</span>
            </div>
            <h3>${effect.name}</h3>
            <p>${effect.description}</p>
        `;
        
        effectCard.addEventListener('click', () => applyEffect(effect));
        effectsGrid.appendChild(effectCard);
    });
}

// Apply an effect
function applyEffect(effect) {
    currentEffect = effect;
    textDisplay.style.color = effect.color;
    textDisplay.style.textShadow = effect.shadow;
    textColor.value = effect.color;
    
    // Save to localStorage
    localStorage.setItem('auraEffect', JSON.stringify(effect));
    
    showToast(`${effect.name} applied!`);
}

// Apply random effect
function applyRandomEffect() {
    const randomIndex = Math.floor(Math.random() * effects.length);
    applyEffect(effects[randomIndex]);
}

// Update text display
function updateTextDisplay() {
    const text = textInput.value.trim() || 'AuraText';
    textDisplay.textContent = text;
    
    // Save to localStorage
    localStorage.setItem('auraText', text);
}

// Show toast notification
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Download as PNG
function downloadAsPNG() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Get computed styles
    const style = window.getComputedStyle(textDisplay);
    const fontSize = parseFloat(style.fontSize);
    const fontFamily = style.fontFamily;
    const color = style.color;
    const textShadow = style.textShadow;
    
    // Calculate text width
    ctx.font = `${fontSize}px ${fontFamily}`;
    const textWidth = ctx.measureText(textDisplay.textContent).width;
    
    // Set canvas size with padding
    const padding = 100;
    canvas.width = textWidth + padding * 2;
    canvas.height = fontSize * 2 + padding * 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set background
    ctx.fillStyle = '#0f0c29';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set text properties
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Apply text shadow (simplified for canvas)
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Draw text
    ctx.fillText(textDisplay.textContent, canvas.width / 2, canvas.height / 2);
    
    // Create download link
    const link = document.createElement('a');
    link.download = 'auratext-effect.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    showToast('Image downloaded successfully!');
}

// Save as PDF
function saveAsPDF() {
    showToast('PDF export feature coming soon!');
}

// Copy CSS to clipboard
function copyCSS() {
    const css = `
.auratext-effect {
    font-size: ${fontSize.value}px;
    color: ${textDisplay.style.color};
    text-shadow: ${textDisplay.style.textShadow};
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-weight: bold;
}
    `.trim();
    
    navigator.clipboard.writeText(css).then(() => {
        showToast('CSS copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy CSS. Please try again.');
    });
}

// Setup event listeners
function setupEventListeners() {
    // Text input
    textInput.addEventListener('input', updateTextDisplay);
    
    // Color picker
    textColor.addEventListener('input', (e) => {
        textDisplay.style.color = e.target.value;
        currentEffect = null;
    });
    
    // Color swatches
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            const color = swatch.dataset.color;
            textColor.value = color;
            textDisplay.style.color = color;
            currentEffect = null;
        });
    });
    
    // Font size slider
    fontSize.addEventListener('input', (e) => {
        const size = e.target.value + 'px';
        textDisplay.style.fontSize = size;
        fontSizeValue.textContent = size;
    });
    
    // Clear button
    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        updateTextDisplay();
        showToast('Text cleared!');
    });
    
    // Random button
    randomBtn.addEventListener('click', () => {
        applyRandomEffect();
    });
    
    // Download button
    downloadBtn.addEventListener('click', downloadAsPNG);
    
    // Print/PDF button
    printBtn.addEventListener('click', saveAsPDF);
    
    // Copy button
    copyBtn.addEventListener('click', copyCSS);
    
    // Menu toggle
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('show');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                navLinks.classList.remove('show');
            }
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
