// DOM Elements
const textPreview = document.getElementById('textPreview');
const textInput = document.getElementById('textInput');
const fontSize = document.getElementById('fontSize');
const fontSizeValue = document.getElementById('fontSizeValue');
const textColor = document.getElementById('textColor');
const bgColor = document.getElementById('bgColor');
const layersContainer = document.getElementById('layersContainer');
const addLayerBtn = document.getElementById('addLayer');
const resetLayersBtn = document.getElementById('resetLayers');
const downloadPNGBtn = document.getElementById('downloadPNG');
const savePDFBtn = document.getElementById('savePDF');
const copyCSSBtn = document.getElementById('copyCSS');
const effectsGrid = document.querySelector('.effects-grid');
const toast = document.getElementById('toast');

// State
let layers = [];
let currentLayerId = 1;

// Initialize
function init() {
    // Load saved state
    loadState();
    
    // Create first layer
    createLayer();
    
    // Initialize controls
    updateTextPreview();
    
    // Generate effects
    generateEffects();
    
    // Setup event listeners
    setupEventListeners();
}

// Load state from localStorage
function loadState() {
    const savedState = localStorage.getItem('auraTextState');
    if (savedState) {
        const state = JSON.parse(savedState);
        textInput.value = state.text || 'AuraText';
        fontSize.value = state.fontSize || 60;
        textColor.value = state.textColor || '#ffffff';
        bgColor.value = state.bgColor || '#1a1a2e';
        
        if (state.layers && state.layers.length > 0) {
            layers = state.layers;
            currentLayerId = Math.max(...layers.map(l => l.id)) + 1;
            renderLayers();
        }
    }
}

// Save state to localStorage
function saveState() {
    const state = {
        text: textInput.value,
        fontSize: fontSize.value,
        textColor: textColor.value,
        bgColor: bgColor.value,
        layers: layers
    };
    localStorage.setItem('auraTextState', JSON.stringify(state));
}

// Create a new layer
function createLayer() {
    const layer = {
        id: currentLayerId++,
        offsetX: 5,
        offsetY: 5,
        blur: 10,
        color: '#ff6b6b',
        spread: 0
    };
    
    layers.push(layer);
    renderLayers();
    updateTextPreview();
    saveState();
}

// Render all layers
function renderLayers() {
    layersContainer.innerHTML = '';
    
    layers.forEach((layer, index) => {
        const layerElement = document.createElement('div');
        layerElement.className = 'layer-controls';
        layerElement.innerHTML = `
            <div class="layer-header">
                <h3>Layer ${index + 1}</h3>
                ${layers.length > 1 ? '<button class="btn btn-secondary btn-sm remove-layer" data-id="' + layer.id + '"><i class="fas fa-times"></i> Remove</button>' : ''}
            </div>
            <div class="layer-grid">
                <div class="layer-control">
                    <label>Horizontal Offset: <span class="value" id="offsetXValue${layer.id}">${layer.offsetX}px</span></label>
                    <input type="range" class="offset-x" data-id="${layer.id}" min="-50" max="50" value="${layer.offsetX}">
                </div>
                <div class="layer-control">
                    <label>Vertical Offset: <span class="value" id="offsetYValue${layer.id}">${layer.offsetY}px</span></label>
                    <input type="range" class="offset-y" data-id="${layer.id}" min="-50" max="50" value="${layer.offsetY}">
                </div>
                <div class="layer-control">
                    <label>Blur Radius: <span class="value" id="blurValue${layer.id}">${layer.blur}px</span></label>
                    <input type="range" class="blur" data-id="${layer.id}" min="0" max="50" value="${layer.blur}">
                </div>
                <div class="layer-control">
                    <label>Spread: <span class="value" id="spreadValue${layer.id}">${layer.spread}px</span></label>
                    <input type="range" class="spread" data-id="${layer.id}" min="0" max="50" value="${layer.spread}">
                </div>
                <div class="layer-control">
                    <label>Color</label>
                    <input type="color" class="color" data-id="${layer.id}" value="${layer.color}">
                </div>
            </div>
        `;
        layersContainer.appendChild(layerElement);
    });
    
    // Add event listeners to layer controls
    attachLayerEvents();
}

// Attach events to layer controls
function attachLayerEvents() {
    document.querySelectorAll('.offset-x').forEach(input => {
        input.addEventListener('input', function() {
            const id = parseInt(this.dataset.id);
            const layer = layers.find(l => l.id === id);
            layer.offsetX = parseInt(this.value);
            document.getElementById(`offsetXValue${id}`).textContent = `${layer.offsetX}px`;
            updateTextPreview();
            saveState();
        });
    });
    
    document.querySelectorAll('.offset-y').forEach(input => {
        input.addEventListener('input', function() {
            const id = parseInt(this.dataset.id);
            const layer = layers.find(l => l.id === id);
            layer.offsetY = parseInt(this.value);
            document.getElementById(`offsetYValue${id}`).textContent = `${layer.offsetY}px`;
            updateTextPreview();
            saveState();
        });
    });
    
    document.querySelectorAll('.blur').forEach(input => {
        input.addEventListener('input', function() {
            const id = parseInt(this.dataset.id);
            const layer = layers.find(l => l.id === id);
            layer.blur = parseInt(this.value);
            document.getElementById(`blurValue${id}`).textContent = `${layer.blur}px`;
            updateTextPreview();
            saveState();
        });
    });
    
    document.querySelectorAll('.spread').forEach(input => {
        input.addEventListener('input', function() {
            const id = parseInt(this.dataset.id);
            const layer = layers.find(l => l.id === id);
            layer.spread = parseInt(this.value);
            document.getElementById(`spreadValue${id}`).textContent = `${layer.spread}px`;
            updateTextPreview();
            saveState();
        });
    });
    
    document.querySelectorAll('.color').forEach(input => {
        input.addEventListener('input', function() {
            const id = parseInt(this.dataset.id);
            const layer = layers.find(l => l.id === id);
            layer.color = this.value;
            updateTextPreview();
            saveState();
        });
    });
    
    document.querySelectorAll('.remove-layer').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            layers = layers.filter(l => l.id !== id);
            renderLayers();
            updateTextPreview();
            saveState();
        });
    });
}

// Update text preview
function updateTextPreview() {
    // Update text content
    textPreview.textContent = textInput.value || 'AuraText';
    
    // Update font size
    const size = `${fontSize.value}px`;
    textPreview.style.fontSize = size;
    fontSizeValue.textContent = size;
    
    // Update colors
    textPreview.style.color = textColor.value;
    document.body.style.backgroundColor = bgColor.value;
    
    // Update text shadow
    const shadows = layers.map(layer => 
        `${layer.offsetX}px ${layer.offsetY}px ${layer.blur}px ${layer.spread}px ${layer.color}`
    ).join(', ');
    
    textPreview.style.textShadow = shadows || 'none';
}

// Generate preset effects
function generateEffects() {
    const effects = [
        {
            name: "Neon Glow",
            description: "Bright neon effect with blue glow",
            shadows: [
                { offsetX: 0, offsetY: 0, blur: 20, spread: 0, color: '#00ffff' },
                { offsetX: 0, offsetY: 0, blur: 40, spread: 0, color: '#0080ff' },
                { offsetX: 0, offsetY: 0, blur: 60, spread: 0, color: '#0000ff' }
            ],
            textColor: '#ffffff',
            bgColor: '#000000'
        },
        {
            name: "Fire Text",
            description: "Hot fire effect with orange and red",
            shadows: [
                { offsetX: 0, offsetY: 0, blur: 10, spread: 0, color: '#ff3300' },
                { offsetX: 0, offsetY: 0, blur: 20, spread: 0, color: '#ff6600' },
                { offsetX: 0, offsetY: 0, blur: 30, spread: 0, color: '#ff9900' }
            ],
            textColor: '#ffff00',
            bgColor: '#330000'
        },
        {
            name: "3D Pop",
            description: "Realistic 3D shadow effect",
            shadows: [
                { offsetX: 2, offsetY: 2, blur: 0, spread: 0, color: '#555555' },
                { offsetX: 4, offsetY: 4, blur: 0, spread: 0, color: '#333333' },
                { offsetX: 6, offsetY: 6, blur: 0, spread: 0, color: '#111111' }
            ],
            textColor: '#ffffff',
            bgColor: '#666666'
        },
        {
            name: "Soft Glow",
            description: "Subtle soft shadow glow",
            shadows: [
                { offsetX: 0, offsetY: 0, blur: 30, spread: 0, color: 'rgba(255, 255, 255, 0.5)' },
                { offsetX: 0, offsetY: 0, blur: 60, spread: 0, color: 'rgba(255, 255, 255, 0.3)' }
            ],
            textColor: '#f0f0f0',
            bgColor: '#2a2a2a'
        },
        {
            name: "Rainbow Aura",
            description: "Colorful rainbow shadow effect",
            shadows: [
                { offsetX: 5, offsetY: 5, blur: 15, spread: 0, color: '#ff0000' },
                { offsetX: -5, offsetY: -5, blur: 15, spread: 0, color: '#00ff00' },
                { offsetX: 5, offsetY: -5, blur: 15, spread: 0, color: '#0000ff' },
                { offsetX: -5, offsetY: 5, blur: 15, spread: 0, color: '#ffff00' }
            ],
            textColor: '#ffffff',
            bgColor: '#222222'
        },
        {
            name: "Cyberpunk",
            description: "Cyberpunk style with purple and blue",
            shadows: [
                { offsetX: 0, offsetY: 0, blur: 20, spread: 0, color: '#ff00ff' },
                { offsetX: 0, offsetY: 0, blur: 40, spread: 0, color: '#00ffff' },
                { offsetX: 0, offsetY: 0, blur: 60, spread: 0, color: '#0000ff' }
            ],
            textColor: '#00ff00',
            bgColor: '#0a0a1a'
        }
    ];
    
    effectsGrid.innerHTML = '';
    
    effects.forEach((effect, index) => {
        const effectCard = document.createElement('div');
        effectCard.className = 'effect-card';
        effectCard.dataset.index = index;
        
        // Create preview shadow
        const previewShadows = effect.shadows.map(s => 
            `${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${s.color}`
        ).join(', ');
        
        effectCard.innerHTML = `
            <div class="effect-preview" style="color: ${effect.textColor}; text-shadow: ${previewShadows}; background: ${effect.bgColor}">
                Aura
            </div>
            <h3>${effect.name}</h3>
            <p>${effect.description}</p>
        `;
        
        effectCard.addEventListener('click', () => applyEffect(effect));
        effectsGrid.appendChild(effectCard);
    });
}

// Apply selected effect
function applyEffect(effect) {
    layers = effect.shadows.map((shadow, index) => ({
        id: currentLayerId++,
        ...shadow
    }));
    
    textColor.value = effect.textColor;
    bgColor.value = effect.bgColor;
    
    renderLayers();
    updateTextPreview();
    saveState();
    
    showToast(`Applied ${effect.name} effect!`);
}

// Download as PNG
function downloadPNG() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const text = textPreview;
    
    // Get computed styles
    const style = window.getComputedStyle(text);
    const fontSize = parseFloat(style.fontSize);
    const fontFamily = style.fontFamily;
    const color = style.color;
    
    // Set canvas size with padding
    canvas.width = text.offsetWidth + 100;
    canvas.height = text.offsetHeight + 100;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set background
    ctx.fillStyle = bgColor.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set text properties
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Create text shadow
    const shadows = layers.map(layer => 
        `${layer.offsetX}px ${layer.offsetY}px ${layer.blur}px ${layer.color}`
    ).join(', ');
    
    ctx.shadowColor = layers[0]?.color || 'transparent';
    ctx.shadowBlur = layers[0]?.blur || 0;
    ctx.shadowOffsetX = layers[0]?.offsetX || 0;
    ctx.shadowOffsetY = layers[0]?.offsetY || 0;
    
    // Draw text
    ctx.fillText(text.textContent, canvas.width / 2, canvas.height / 2);
    
    // For multiple shadows, we need multiple draws (simplified)
    if (layers.length > 1) {
        for (let i = 1; i < Math.min(layers.length, 3); i++) {
            const layer = layers[i];
            ctx.shadowColor = layer.color;
            ctx.shadowBlur = layer.blur;
            ctx.shadowOffsetX = layer.offsetX;
            ctx.shadowOffsetY = layer.offsetY;
            ctx.fillText(text.textContent, canvas.width / 2, canvas.height / 2);
        }
    }
    
    // Create download link
    const link = document.createElement('a');
    link.download = 'auratext-design.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    showToast('PNG downloaded successfully!');
}

// Save as PDF
function savePDF() {
    showToast('PDF export coming soon! This would require a PDF library integration.');
}

// Copy CSS
function copyCSS() {
    const css = `
.auratext {
    font-size: ${fontSize.value}px;
    color: ${textColor.value};
    text-shadow: ${layers.map(layer => 
        `${layer.offsetX}px ${layer.offsetY}px ${layer.blur}px ${layer.spread}px ${layer.color}`
    ).join(', ')};
}
    `.trim();
    
    navigator.clipboard.writeText(css).then(() => {
        showToast('CSS copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy CSS. Please try again.');
    });
}

// Show toast notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    textInput.addEventListener('input', () => {
        updateTextPreview();
        saveState();
    });
    
    fontSize.addEventListener('input', () => {
        updateTextPreview();
        saveState();
    });
    
    textColor.addEventListener('input', () => {
        updateTextPreview();
        saveState();
    });
    
    bgColor.addEventListener('input', () => {
        updateTextPreview();
        saveState();
    });
    
    addLayerBtn.addEventListener('click', createLayer);
    
    resetLayersBtn.addEventListener('click', () => {
        layers = [];
        createLayer();
        showToast('Layers reset to default');
    });
    
    downloadPNGBtn.addEventListener('click', downloadPNG);
    savePDFBtn.addEventListener('click', savePDF);
    copyCSSBtn.addEventListener('click', copyCSS);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
