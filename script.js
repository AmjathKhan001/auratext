// DOM Elements
const textInput = document.getElementById('text-input');
const textDisplay = document.getElementById('text-display');
const textColor = document.getElementById('text-color');
const colorSwatches = document.querySelectorAll('.color-swatch');
const fontSize = document.getElementById('font-size');
const fontSizeValue = document.getElementById('font-size-value');
const fontFamily = document.getElementById('font-family');
const clearBtn = document.getElementById('clear-btn');
const randomBtn = document.getElementById('random-btn');
const downloadBtn = document.getElementById('download-btn');
const printBtn = document.getElementById('print-btn');
const copyBtn = document.getElementById('copy-btn');
const effectsGrid = document.querySelector('.effects-grid');
const designerStylesGrid = document.querySelector('.designer-styles-grid');
const styleCategories = document.querySelectorAll('.style-category-btn');
const textSuggestions = document.querySelectorAll('.text-suggestion');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const visitorCounter = document.getElementById('visitor-counter');
const footerVisitorCounter = document.getElementById('footer-visitor-counter');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Current effect state
let currentEffect = null;
let currentCategory = 'all';
let visitorCount = 0;

// Effects data organized by categories
const effects = [
    // Neon Effects
    { name: "Neon Purple", description: "Vibrant purple neon glow", color: "#8a2be2", shadow: "0 0 10px #8a2be2, 0 0 20px #8a2be2, 0 0 40px #8a2be2, 0 0 80px #8a2be2", category: "neon" },
    { name: "Electric Blue", description: "Electric blue aura effect", color: "#00ffff", shadow: "0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 80px #00ffff", category: "neon" },
    { name: "Fire Red", description: "Fiery red glowing text", color: "#ff4a4a", shadow: "0 0 10px #ff4a4a, 0 0 20px #ff4a4a, 0 0 40px #ff4a4a, 0 0 80px #ff4a4a", category: "neon" },
    { name: "Acid Green", description: "Toxic green neon effect", color: "#4aff6b", shadow: "0 0 10px #4aff6b, 0 0 20px #4aff6b, 0 0 40px #4aff6b, 0 0 80px #4aff6b", category: "neon" },
    { name: "Hot Pink", description: "Vibrant pink neon", color: "#ff4ad8", shadow: "0 0 10px #ff4ad8, 0 0 20px #ff4ad8, 0 0 40px #ff4ad8, 0 0 80px #ff4ad8", category: "neon" },
    { name: "Neon Yellow", description: "Bright yellow neon", color: "#ffff00", shadow: "0 0 10px #ffff00, 0 0 20px #ffff00, 0 0 40px #ffff00, 0 0 80px #ffff00", category: "neon" },
    
    // 3D Effects
    { name: "3D Purple", description: "Deep 3D shadow effect", color: "#8a2be2", shadow: "2px 2px 0 #4a00e0, 4px 4px 0 #3a00b0, 6px 6px 0 #2a0080", category: "3d" },
    { name: "3D Blue", description: "Elevated 3D text", color: "#4169e1", shadow: "2px 2px 0 #2a52be, 4px 4px 0 #1e3a8a, 6px 6px 0 #132155", category: "3d" },
    { name: "3D Red", description: "Pop-out 3D effect", color: "#ff4a4a", shadow: "2px 2px 0 #cc0000, 4px 4px 0 #990000, 6px 6px 0 #660000", category: "3d" },
    
    // Grunge Effects
    { name: "Distressed Black", description: "Worn grunge texture", color: "#333333", shadow: "2px 2px 0 #000000, -2px -2px 0 #666666, 4px 4px 8px rgba(0,0,0,0.5)", category: "grunge" },
    { name: "Rusty Metal", description: "Rusted metal texture", color: "#b7410e", shadow: "2px 2px 0 #8b2c0a, -1px -1px 0 #e55d2e, 0 0 10px rgba(183,65,14,0.5)", category: "grunge" },
    
    // Metallic Effects
    { name: "Chrome Silver", description: "Shiny chrome metal", color: "#c0c0c0", shadow: "0 0 5px #ffffff, 0 0 10px #ffffff, 2px 2px 5px rgba(0,0,0,0.5), -2px -2px 5px rgba(255,255,255,0.3)", category: "metallic" },
    { name: "Steel Blue", description: "Polished steel blue", color: "#4682b4", shadow: "0 0 5px #5d9bd4, 0 0 10px #5d9bd4, 2px 2px 5px rgba(0,0,0,0.5), -2px -2px 5px rgba(93,155,212,0.3)", category: "metallic" },
    
    // Gold Effects
    { name: "Solid Gold", description: "Rich gold texture", color: "#ffd700", shadow: "0 0 10px #ffd700, 0 0 20px #ffd700, 2px 2px 5px rgba(139, 69, 19, 0.5)", category: "gold" },
    { name: "Antique Gold", description: "Vintage gold effect", color: "#cfb53b", shadow: "2px 2px 0 #8b6914, 4px 4px 0 #5d4510, 0 0 10px rgba(207,181,59,0.5)", category: "gold" },
    
    // Shiny Effects
    { name: "Glossy Red", description: "High gloss finish", color: "#ff3333", shadow: "0 0 20px #ff3333, 0 0 40px #ff3333, 0 0 60px #ff3333, inset 0 0 20px rgba(255,255,255,0.3)", category: "shiny" },
    { name: "Crystal Blue", description: "Clear crystal effect", color: "#00ccff", shadow: "0 0 10px #00ccff, 0 0 20px #00ccff, 0 0 30px #00ccff, 0 0 40px #0088cc", category: "shiny" },
    
    // Fabric Effects
    { name: "Velvet Purple", description: "Soft velvet texture", color: "#8a2be2", shadow: "2px 2px 5px rgba(0,0,0,0.3), -1px -1px 3px rgba(255,255,255,0.1), inset 0 0 10px rgba(138,43,226,0.3)", category: "fabric" },
    { name: "Denim Blue", description: "Denim fabric texture", color: "#1560bd", shadow: "2px 2px 5px rgba(0,0,0,0.4), -1px -1px 3px rgba(255,255,255,0.1), inset 0 0 8px rgba(21,96,189,0.4)", category: "fabric" },
    
    // Cartoon Effects
    { name: "Comic Book", description: "Bold comic book style", color: "#ff3300", shadow: "3px 3px 0 #000000, 6px 6px 0 #000000, 9px 9px 0 #000000", category: "cartoon" },
    { name: "Anime Glow", description: "Anime-style energy glow", color: "#ff00ff", shadow: "0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff, 0 0 40px #ff00ff", category: "cartoon" },
    
    // Tech Effects
    { name: "Cyber Green", description: "Matrix digital rain", color: "#00ff00", shadow: "0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00, 0 0 40px #00ff00", category: "tech" },
    { name: "Hologram Blue", description: "Futuristic hologram", color: "#00ffff", shadow: "0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #0088cc", category: "tech" },
    
    // Retro Effects
    { name: "80s Retro", description: "1980s neon retro", color: "#ff00ff", shadow: "0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff, 0 0 40px #00ffff", category: "retro" },
    { name: "Vintage Sign", description: "Old vintage sign glow", color: "#ff9900", shadow: "0 0 10px #ff9900, 0 0 20px #ff9900, 0 0 30px #ff9900, 2px 2px 5px rgba(0,0,0,0.5)", category: "retro" },
    
    // Misc Effects
    { name: "Sunset Orange", description: "Warm sunset glow", color: "#ffb74a", shadow: "0 0 10px #ffb74a, 0 0 20px #ffb74a, 0 0 40px #ffb74a, 0 0 80px #ffb74a", category: "misc" },
    { name: "Cosmic Purple", description: "Deep cosmic purple aura", color: "#9d4aff", shadow: "0 0 10px #9d4aff, 0 0 20px #9d4aff, 0 0 40px #9d4aff, 0 0 80px #9d4aff", category: "misc" },
    { name: "Ice Blue", description: "Cool ice blue glow", color: "#4af2ff", shadow: "0 0 10px #4af2ff, 0 0 20px #4af2ff, 0 0 40px #4af2ff, 0 0 80px #4af2ff", category: "misc" }
];

// Designer Text Styles
const designerStyles = [
    {
        name: "Minimalist White",
        description: "Clean, modern minimalist design",
        color: "#ffffff",
        shadow: "2px 2px 4px rgba(0,0,0,0.1), 4px 4px 8px rgba(0,0,0,0.1)",
        fontStyle: "normal",
        fontWeight: "300",
        category: "minimal"
    },
    {
        name: "Bold Impact",
        description: "Strong, attention-grabbing text",
        color: "#000000",
        shadow: "0 0 0 2px #ffffff, 0 0 0 4px #000000",
        fontStyle: "normal",
        fontWeight: "900",
        category: "bold"
    },
    {
        name: "Elegant Script",
        description: "Sophisticated script style",
        color: "#8a2be2",
        shadow: "1px 1px 2px rgba(138,43,226,0.3), 2px 2px 4px rgba(138,43,226,0.2)",
        fontStyle: "italic",
        fontWeight: "400",
        category: "elegant"
    },
    {
        name: "Tech Futuristic",
        description: "Cutting-edge tech style",
        color: "#00ffff",
        shadow: "0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff",
        fontStyle: "normal",
        fontWeight: "700",
        category: "tech"
    },
    {
        name: "Vintage Poster",
        description: "Retro poster text style",
        color: "#ff9900",
        shadow: "2px 2px 0 #cc6600, 4px 4px 0 #993300",
        fontStyle: "normal",
        fontWeight: "800",
        category: "retro"
    },
    {
        name: "Watercolor Effect",
        description: "Soft watercolor texture",
        color: "#ff6699",
        shadow: "0 0 20px rgba(255,102,153,0.3), 0 0 40px rgba(255,102,153,0.2)",
        fontStyle: "normal",
        fontWeight: "400",
        category: "artistic"
    },
    {
        name: "Corporate Blue",
        description: "Professional corporate style",
        color: "#1e3a8a",
        shadow: "1px 1px 2px rgba(30,58,138,0.3), 2px 2px 4px rgba(30,58,138,0.2)",
        fontStyle: "normal",
        fontWeight: "600",
        category: "professional"
    },
    {
        name: "Playful Color",
        description: "Fun, colorful text effect",
        color: "#ff4a4a",
        shadow: "0 0 10px #ff4a4a, 0 0 20px #ff4a4a, 2px 2px 4px rgba(0,0,0,0.2)",
        fontStyle: "normal",
        fontWeight: "700",
        category: "fun"
    }
];

// Initialize the application
function init() {
    loadVisitorCount();
    generateEffects();
    generateDesignerStyles();
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
        try {
            const effect = JSON.parse(savedEffect);
            applyEffect(effect);
        } catch (e) {
            console.error('Error loading saved effect:', e);
        }
    }
}

// Load and update visitor count
function loadVisitorCount() {
    let count = localStorage.getItem('auraVisitorCount');
    
    if (!count) {
        count = Math.floor(Math.random() * 500) + 1500;
        localStorage.setItem('auraVisitorCount', count);
    }
    
    visitorCount = parseInt(count);
    visitorCount++;
    localStorage.setItem('auraVisitorCount', visitorCount);
    
    updateVisitorCounter();
}

// Update visitor counter display
function updateVisitorCounter() {
    const formattedCount = visitorCount.toLocaleString();
    if (visitorCounter) visitorCounter.textContent = formattedCount;
    if (footerVisitorCounter) footerVisitorCounter.textContent = formattedCount;
}

// Generate effects grid with filtering
function generateEffects() {
    if (!effectsGrid) return;
    
    effectsGrid.innerHTML = '';
    
    effects.forEach((effect, index) => {
        const effectCard = document.createElement('div');
        effectCard.className = 'effect-card';
        effectCard.dataset.index = index;
        effectCard.dataset.category = effect.category;
        
        effectCard.innerHTML = `
            <div class="effect-preview">
                <span style="color: ${effect.color}; text-shadow: ${effect.shadow}">Aura</span>
            </div>
            <h3>${effect.name}</h3>
            <p>${effect.description}</p>
            <span class="designer-style-tag">${effect.category.toUpperCase()}</span>
        `;
        
        effectCard.addEventListener('click', () => applyEffect(effect));
        effectsGrid.appendChild(effectCard);
    });
    
    filterEffects();
}

// Generate designer styles
function generateDesignerStyles() {
    if (!designerStylesGrid) return;
    
    designerStylesGrid.innerHTML = '';
    
    designerStyles.forEach((style, index) => {
        const styleCard = document.createElement('div');
        styleCard.className = 'designer-style-card';
        styleCard.dataset.index = index;
        
        styleCard.innerHTML = `
            <div class="designer-style-preview">
                <span style="color: ${style.color}; text-shadow: ${style.shadow}; font-style: ${style.fontStyle}; font-weight: ${style.fontWeight}">Style</span>
            </div>
            <h3>${style.name}</h3>
            <p>${style.description}</p>
            <span class="designer-style-tag">${style.category.toUpperCase()}</span>
        `;
        
        styleCard.addEventListener('click', () => applyDesignerStyle(style));
        designerStylesGrid.appendChild(styleCard);
    });
}

// Filter effects by category
function filterEffects() {
    const effectCards = document.querySelectorAll('.effect-card');
    
    effectCards.forEach(card => {
        if (currentCategory === 'all' || card.dataset.category === currentCategory) {
            card.classList.remove('filtered-out');
        } else {
            card.classList.add('filtered-out');
        }
    });
}

// Apply an effect
function applyEffect(effect) {
    if (!effect || !textDisplay) return;
    
    currentEffect = effect;
    textDisplay.style.color = effect.color;
    textDisplay.style.textShadow = effect.shadow;
    if (textColor) textColor.value = effect.color;
    
    // Reset font styles
    textDisplay.style.fontStyle = 'normal';
    textDisplay.style.fontWeight = 'bold';
    if (fontFamily) fontFamily.value = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    
    localStorage.setItem('auraEffect', JSON.stringify(effect));
    showToast(`${effect.name} applied!`);
}

// Apply designer style
function applyDesignerStyle(style) {
    if (!style || !textDisplay) return;
    
    currentEffect = style;
    textDisplay.style.color = style.color;
    textDisplay.style.textShadow = style.shadow;
    textDisplay.style.fontStyle = style.fontStyle;
    textDisplay.style.fontWeight = style.fontWeight;
    if (textColor) textColor.value = style.color;
    
    localStorage.setItem('auraEffect', JSON.stringify(style));
    showToast(`${style.name} style applied!`);
}

// Apply random effect
function applyRandomEffect() {
    if (effects.length === 0) return;
    const randomIndex = Math.floor(Math.random() * effects.length);
    applyEffect(effects[randomIndex]);
}

// Update text display
function updateTextDisplay() {
    if (!textInput || !textDisplay) return;
    
    const text = textInput.value.trim() || 'AuraText';
    textDisplay.textContent = text;
    localStorage.setItem('auraText', text);
}

// Show toast notification
function showToast(message) {
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Download as PNG
function downloadAsPNG() {
    if (!textDisplay) {
        showToast('Error: Text display not found!');
        return;
    }
    
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Get computed styles
        const style = window.getComputedStyle(textDisplay);
        const fontSize = parseFloat(style.fontSize);
        const fontFamily = style.fontFamily;
        const color = style.color;
        const fontWeight = style.fontWeight;
        const fontStyle = style.fontStyle;
        
        // Calculate text width
        ctx.font = `${fontWeight} ${fontStyle} ${fontSize}px ${fontFamily}`;
        const text = textDisplay.textContent;
        const textWidth = ctx.measureText(text).width;
        
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
        ctx.font = `${fontWeight} ${fontStyle} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Apply shadow effect
        const shadow = style.textShadow;
        const shadowParts = shadow.split('), ');
        
        if (shadowParts.length > 0) {
            // Get the first shadow for main effect
            const firstShadow = shadowParts[0].replace(')', '').split(' ');
            if (firstShadow.length >= 3) {
                const offsetX = parseInt(firstShadow[0]) || 0;
                const offsetY = parseInt(firstShadow[1]) || 0;
                const blur = parseInt(firstShadow[2]) || 0;
                const shadowColor = firstShadow.slice(3).join(' ') || color;
                
                ctx.shadowColor = shadowColor;
                ctx.shadowBlur = blur;
                ctx.shadowOffsetX = offsetX;
                ctx.shadowOffsetY = offsetY;
            }
        }
        
        // Draw text
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        
        // Create download link
        const link = document.createElement('a');
        link.download = 'auratext-effect.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('Image downloaded successfully!');
    } catch (error) {
        console.error('Error downloading PNG:', error);
        showToast('Error downloading image. Please try again.');
    }
}

// Save as PDF
function saveAsPDF() {
    showToast('PDF export feature coming soon!');
}

// Copy CSS to clipboard
function copyCSS() {
    if (!textDisplay || !fontSize) return;
    
    try {
        const style = window.getComputedStyle(textDisplay);
        const css = `
.auratext-effect {
    font-size: ${fontSize.value}px;
    color: ${style.color};
    text-shadow: ${style.textShadow};
    font-style: ${style.fontStyle};
    font-weight: ${style.fontWeight};
    font-family: ${style.fontFamily};
}
        `.trim();
        
        navigator.clipboard.writeText(css).then(() => {
            showToast('CSS copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = css;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast('CSS copied to clipboard!');
        });
    } catch (error) {
        console.error('Error copying CSS:', error);
        showToast('Failed to copy CSS. Please try again.');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Text input
    if (textInput) {
        textInput.addEventListener('input', updateTextDisplay);
        textInput.addEventListener('keyup', updateTextDisplay);
    }
    
    // Color picker
    if (textColor) {
        textColor.addEventListener('input', (e) => {
            if (textDisplay) textDisplay.style.color = e.target.value;
            currentEffect = null;
        });
    }
    
    // Color swatches
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            const color = swatch.dataset.color;
            if (textColor) textColor.value = color;
            if (textDisplay) textDisplay.style.color = color;
            currentEffect = null;
        });
    });
    
    // Font size slider
    if (fontSize) {
        fontSize.addEventListener('input', (e) => {
            const size = e.target.value + 'px';
            if (textDisplay) textDisplay.style.fontSize = size;
            if (fontSizeValue) fontSizeValue.textContent = size;
        });
    }
    
    // Font family selector
    if (fontFamily) {
        fontFamily.addEventListener('change', (e) => {
            if (textDisplay) textDisplay.style.fontFamily = e.target.value;
        });
    }
    
    // Style category buttons
    styleCategories.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            styleCategories.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            // Update current category and filter effects
            currentCategory = btn.dataset.category;
            filterEffects();
        });
    });
    
    // Text suggestions
    textSuggestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.dataset.text;
            if (textInput) {
                textInput.value = text;
                updateTextDisplay();
                showToast(`Text changed to "${text}"`);
            }
        });
    });
    
    // Clear button
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (textInput) textInput.value = '';
            updateTextDisplay();
            showToast('Text cleared!');
        });
    }
    
    // Random button
    if (randomBtn) {
        randomBtn.addEventListener('click', () => {
            applyRandomEffect();
        });
    }
    
    // Download button
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadAsPNG);
    }
    
    // Print/PDF button
    if (printBtn) {
        printBtn.addEventListener('click', saveAsPDF);
    }
    
    // Copy button
    if (copyBtn) {
        copyBtn.addEventListener('click', copyCSS);
    }
    
    // Menu toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('show');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('show');
            }
        });
    }
    
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
                if (navLinks) navLinks.classList.remove('show');
            }
        });
    });
    
    // Initialize font size display
    if (fontSize && fontSizeValue) {
        fontSizeValue.textContent = fontSize.value + 'px';
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
// Dropdown menu functionality for mobile
function setupDropdownMenu() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // For desktop - hover works automatically via CSS
    
    // For mobile - toggle on click
    if (window.innerWidth <= 768) {
        dropdowns.forEach(dropdown => {
            const dropbtn = dropdown.querySelector('.dropbtn');
            
            dropbtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Close other dropdowns
                dropdowns.forEach(other => {
                    if (other !== dropdown) {
                        other.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown')) {
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    }
}
