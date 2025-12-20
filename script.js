// DOM Elements
const textInput = document.getElementById('text-input');
const textDisplay = document.getElementById('text-display');
const textColorPicker = document.getElementById('text-color');
const fontSizeSlider = document.getElementById('font-size');
const fontSizeValue = document.getElementById('font-size-value');
const clearBtn = document.getElementById('clear-btn');
const randomBtn = document.getElementById('random-btn');
const downloadBtn = document.getElementById('download-btn');
const printBtn = document.getElementById('print-btn');
const copyBtn = document.getElementById('copy-btn');
const effectsGrid = document.querySelector('.effects-grid');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const colorSwatches = document.querySelectorAll('.color-swatch');
const visitorCounter = document.getElementById('visitor-counter');
const footerVisitorCounter = document.getElementById('footer-visitor-counter');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Current state
let currentEffect = 'aura-glow';
let currentColor = '#8a2be2';

// Visitor counter - Using localStorage for demo
let visitorCount = localStorage.getItem('auratext_visitors') || 12547;

// Update visitor counter
function updateVisitorCounter() {
    // Increment count
    visitorCount = parseInt(visitorCount) + 1;
    localStorage.setItem('auratext_visitors', visitorCount);
    
    // Format number with commas
    const formattedCount = visitorCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    // Update both counters
    if (visitorCounter) visitorCounter.textContent = formattedCount;
    if (footerVisitorCounter) footerVisitorCounter.textContent = formattedCount;
}

// Text effects data
const textEffects = [
    {
        id: 'aura-glow',
        name: 'Aura Glow',
        apply: (element) => {
            element.style.fontFamily = "'Arial Black', 'Arial Bold', Gadget, sans-serif";
            element.style.color = '#fff';
            element.style.textShadow = `
                0 0 10px ${currentColor},
                0 0 20px ${currentColor},
                0 0 30px ${currentColor},
                0 0 40px ${currentColor},
                0 0 50px ${currentColor}
            `;
            element.style.letterSpacing = '2px';
        }
    },
    {
        id: 'purple-aura',
        name: 'Purple Aura',
        apply: (element) => {
            element.style.fontFamily = "'Arial Black', 'Arial Bold', Gadget, sans-serif";
            element.style.color = '#fff';
            element.style.textShadow = `
                0 0 10px #9d4aff,
                0 0 20px #9d4aff,
                0 0 30px #9d4aff,
                0 0 40px #8a2be2,
                0 0 60px #8a2be2,
                0 0 70px #8a2be2
            `;
            element.style.letterSpacing = '1px';
        }
    },
    {
        id: 'neon-cyan',
        name: 'Neon Cyan',
        apply: (element) => {
            element.style.fontFamily = "'Arial Black', 'Arial Bold', Gadget, sans-serif";
            element.style.color = '#00ffff';
            element.style.textShadow = `
                0 0 10px #00ffff,
                0 0 20px #00ffff,
                0 0 30px #00ffff,
                0 0 40px #008b8b,
                0 0 60px #008b8b,
                0 0 80px #008b8b
            `;
            element.style.letterSpacing = '1px';
        }
    },
    {
        id: 'bungee-3d',
        name: 'Bungee 3D',
        apply: (element) => {
            element.style.fontFamily = "'Arial Black', 'Arial Bold', Gadget, sans-serif";
            element.style.color = currentColor;
            element.style.textShadow = `
                2px 2px 0 #000,
                4px 4px 0 rgba(0,0,0,0.2),
                6px 6px 0 rgba(0,0,0,0.1)
            `;
            element.style.letterSpacing = '1px';
        }
    },
    {
        id: 'glitch',
        name: 'Glitch',
        apply: (element) => {
            element.style.fontFamily = "'Courier New', monospace";
            element.style.color = currentColor;
            element.style.textShadow = `
                1px 0 #ff00ff,
                -1px 0 #00ffff
            `;
            element.style.letterSpacing = '1px';
            element.style.animation = 'glitch 0.3s infinite';
        }
    },
    {
        id: 'gradient',
        name: 'Gradient',
        apply: (element) => {
            element.style.fontFamily = "'Arial Black', 'Arial Bold', Gadget, sans-serif";
            element.style.background = `linear-gradient(45deg, ${currentColor}, #ff4a4a, #ffb74a)`;
            element.style.webkitBackgroundClip = 'text';
            element.style.backgroundClip = 'text';
            element.style.color = 'transparent';
            element.style.textShadow = 'none';
            element.style.letterSpacing = '1px';
        }
    },
    {
        id: 'outline',
        name: 'Outline',
        apply: (element) => {
            element.style.fontFamily = "'Arial Black', 'Arial Bold', Gadget, sans-serif";
            element.style.color = 'transparent';
            element.style.webkitTextStroke = `2px ${currentColor}`;
            element.style.textShadow = 'none';
            element.style.letterSpacing = '1px';
        }
    },
    {
        id: 'vintage',
        name: 'Vintage',
        apply: (element) => {
            element.style.fontFamily = "'Times New Roman', serif";
            element.style.color = '#8B4513';
            element.style.textShadow = `
                1px 1px 0 #DEB887,
                2px 2px 0 rgba(139, 69, 19, 0.3)
            `;
            element.style.letterSpacing = '1px';
            element.style.fontStyle = 'italic';
        }
    },
    {
        id: 'comic',
        name: 'Comic Book',
        apply: (element) => {
            element.style.fontFamily = "'Comic Sans MS', cursive";
            element.style.color = '#ff4a4a';
            element.style.textShadow = `
                2px 2px 0 #000,
                4px 4px 0 rgba(0,0,0,0.2)
            `;
            element.style.letterSpacing = '1px';
            element.style.transform = 'skew(-3deg)';
        }
    },
    {
        id: 'elegant',
        name: 'Elegant',
        apply: (element) => {
            element.style.fontFamily = "'Georgia', serif";
            element.style.color = '#333';
            element.style.textShadow = `
                1px 1px 0 #fff,
                2px 2px 0 rgba(0,0,0,0.1)
            `;
            element.style.letterSpacing = '2px';
            element.style.textTransform = 'uppercase';
        }
    },
    {
        id: 'fire',
        name: 'Fire',
        apply: (element) => {
            element.style.fontFamily = "'Arial Black', 'Arial Bold', Gadget, sans-serif";
            element.style.background = 'linear-gradient(to bottom, #ff4a4a, #ffb74a)';
            element.style.webkitBackgroundClip = 'text';
            element.style.backgroundClip = 'text';
            element.style.color = 'transparent';
            element.style.textShadow = '0 0 10px #ff4a4a';
            element.style.letterSpacing = '1px';
        }
    },
    {
        id: 'ice',
        name: 'Ice',
        apply: (element) => {
            element.style.fontFamily = "'Arial Black', 'Arial Bold', Gadget, sans-serif";
            element.style.color = '#4aefff';
            element.style.textShadow = `
                0 0 5px #4aefff,
                0 0 10px #4aefff,
                1px 1px 0 #0066cc,
                2px 2px 0 #0066cc
            `;
            element.style.letterSpacing = '1px';
        }
    },
    {
        id: 'shadow',
        name: 'Long Shadow',
        apply: (element) => {
            element.style.fontFamily = "'Arial Black', 'Arial Bold', Gadget, sans-serif";
            element.style.color = currentColor;
            
            // Create long shadow effect
            let shadow = '';
            for(let i = 1; i <= 15; i++) {
                shadow += `${i}px ${i}px 0 rgba(0,0,0,${0.1 + (i * 0.02)})`;
                if(i < 15) shadow += ', ';
            }
            
            element.style.textShadow = shadow;
            element.style.letterSpacing = '1px';
        }
    },
    {
        id: 'gold',
        name: 'Gold Foil',
        apply: (element) => {
            element.style.fontFamily = "'Arial Black', 'Arial Bold', Gadget, sans-serif";
            element.style.background = 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)';
            element.style.webkitBackgroundClip = 'text';
            element.style.backgroundClip = 'text';
            element.style.color = 'transparent';
            element.style.textShadow = '1px 1px 2px rgba(0,0,0,0.3)';
        }
    },
    {
        id: 'chrome',
        name: 'Chrome',
        apply: (element) => {
            element.style.fontFamily = "'Arial Black', 'Arial Bold', Gadget, sans-serif";
            element.style.background = 'linear-gradient(to right, #757F9A, #D7DDE8)';
            element.style.webkitBackgroundClip = 'text';
            element.style.backgroundClip = 'text';
            element.style.color = 'transparent';
            element.style.textShadow = '1px 1px 2px rgba(0,0,0,0.3)';
        }
    }
];

// Initialize the app
function init() {
    // Update visitor counter
    updateVisitorCounter();
    
    // Set initial text
    updateTextDisplay();
    
    // Create effect cards
    createEffectCards();
    
    // Apply default effect
    applyEffect(currentEffect);
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup color swatches
    setupColorSwatches();
}

// Create effect cards for the gallery
function createEffectCards() {
    if (!effectsGrid) return;
    
    effectsGrid.innerHTML = '';
    
    textEffects.forEach(effect => {
        const card = document.createElement('div');
        card.className = 'effect-card';
        card.dataset.effect = effect.id;
        
        if (effect.id === currentEffect) {
            card.classList.add('active');
        }
        
        card.innerHTML = `
            <div class="effect-preview" style="font-size: 22px;">
                <span class="effect-preview-text">${effect.name}</span>
            </div>
            <div class="effect-name">${effect.name}</div>
        `;
        
        // Apply preview styling
        const previewText = card.querySelector('.effect-preview-text');
        previewText.textContent = effect.name;
        
        // Apply the effect to preview
        effect.apply(previewText);
        
        // Reset some styles for preview
        previewText.style.fontSize = '22px';
        previewText.style.animation = 'none';
        
        card.addEventListener('click', () => {
            applyEffect(effect.id);
            showToast(`"${effect.name}" effect applied!`);
            
            // Update active card
            document.querySelectorAll('.effect-card').forEach(c => {
                c.classList.remove('active');
            });
            card.classList.add('active');
        });
        
        effectsGrid.appendChild(card);
    });
}

// Apply a specific effect
function applyEffect(effectId) {
    currentEffect = effectId;
    const effect = textEffects.find(e => e.id === effectId);
    
    if (effect && textDisplay) {
        // Reset animation first
        textDisplay.style.animation = 'none';
        
        // Apply the effect
        effect.apply(textDisplay);
        
        // Update preview cards
        document.querySelectorAll('.effect-card').forEach(card => {
            const cardEffectId = card.dataset.effect;
            if (cardEffectId === effectId) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }
}

// Update the text display
function updateTextDisplay() {
    const text = textInput.value.trim() || 'AuraText';
    if (textDisplay) {
        textDisplay.textContent = text;
    }
    
    // Update preview cards text
    document.querySelectorAll('.effect-preview-text').forEach(preview => {
        preview.textContent = text;
    });
}

// Setup color swatches
function setupColorSwatches() {
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            const color = swatch.dataset.color;
            currentColor = color;
            if (textColorPicker) textColorPicker.value = color;
            
            // Update active swatch
            colorSwatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            
            // Re-apply current effect with new color
            applyEffect(currentEffect);
            showToast(`Color changed to ${color}`);
        });
    });
    
    // Set first swatch as active
    if (colorSwatches.length > 0) {
        colorSwatches[0].classList.add('active');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Text input
    if (textInput) {
        textInput.addEventListener('input', updateTextDisplay);
    }
    
    // Color picker
    if (textColorPicker) {
        textColorPicker.addEventListener('input', (e) => {
            currentColor = e.target.value;
            
            // Update active color swatch if it matches a swatch color
            let matchedSwatch = false;
            colorSwatches.forEach(swatch => {
                if (swatch.dataset.color === currentColor) {
                    swatch.classList.add('active');
                    matchedSwatch = true;
                } else {
                    swatch.classList.remove('active');
                }
            });
            
            // If no match, remove all active states
            if (!matchedSwatch) {
                colorSwatches.forEach(swatch => swatch.classList.remove('active'));
            }
            
            // Re-apply current effect with new color
            applyEffect(currentEffect);
        });
    }
    
    // Font size slider
    if (fontSizeSlider && fontSizeValue) {
        fontSizeSlider.addEventListener('input', (e) => {
            const size = e.target.value;
            fontSizeValue.textContent = `${size}px`;
            if (textDisplay) {
                textDisplay.style.fontSize = `${size}px`;
            }
        });
    }
    
    // Clear button
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (textInput) textInput.value = '';
            updateTextDisplay();
            showToast('Text cleared');
        });
    }
    
    // Random button
    if (randomBtn) {
        randomBtn.addEventListener('click', () => {
            const randomWords = ['Aura', 'Glow', 'Neon', 'Effect', 'Design', 'Create', 'Magic', 'Light', 'Shine', 'Sparkle'];
            const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)];
            if (textInput) textInput.value = randomWord;
            updateTextDisplay();
            showToast(`Random text: "${randomWord}"`);
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
    
    // Copy style button
    if (copyBtn) {
        copyBtn.addEventListener('click', copyStyle);
    }
    
    // Menu toggle for mobile
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });
}

// Download text as PNG
function downloadAsPNG() {
    if (!textDisplay || !downloadBtn) return;
    
    // Show loading state
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '🔄 Generating...';
    downloadBtn.disabled = true;
    
    try {
        // Create a temporary div with the text
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '-9999px';
        tempDiv.style.fontSize = textDisplay.style.fontSize;
        tempDiv.style.fontFamily = textDisplay.style.fontFamily;
        tempDiv.style.color = textDisplay.style.color;
        tempDiv.style.textShadow = textDisplay.style.textShadow;
        tempDiv.style.fontWeight = textDisplay.style.fontWeight;
        tempDiv.style.background = textDisplay.style.background;
        tempDiv.style.webkitBackgroundClip = textDisplay.style.webkitBackgroundClip;
        tempDiv.style.backgroundClip = textDisplay.style.backgroundClip;
        tempDiv.style.webkitTextStroke = textDisplay.style.webkitTextStroke;
        tempDiv.style.letterSpacing = textDisplay.style.letterSpacing;
        tempDiv.style.transform = textDisplay.style.transform;
        tempDiv.style.fontStyle = textDisplay.style.fontStyle;
        tempDiv.style.textTransform = textDisplay.style.textTransform;
        tempDiv.textContent = textDisplay.textContent;
        document.body.appendChild(tempDiv);
        
        // Get dimensions
        const text = textInput ? textInput.value.trim() || 'AuraText' : 'AuraText';
        
        // Create a simple download with canvas (basic version)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = 800;
        canvas.height = 400;
        
        // Draw background
        ctx.fillStyle = '#f5f7ff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw text with simple styling (basic fallback)
        ctx.font = `bold 60px Arial`;
        ctx.fillStyle = currentColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        
        // Add some glow effect
        ctx.shadowColor = currentColor;
        ctx.shadowBlur = 20;
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        ctx.shadowBlur = 0;
        
        // Create download link
        const imageURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imageURL;
        link.download = `auratext-${text}-${currentEffect}.png`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        document.body.removeChild(tempDiv);
        
        showToast('Image downloaded!');
        
    } catch (error) {
        console.error('Error generating image:', error);
        showToast('Error generating image', 'error');
    } finally {
        // Reset button
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
    }
}

// Save as PDF function
function saveAsPDF() {
    if (!textDisplay || !printBtn) return;
    
    // Show loading state
    const originalText = printBtn.innerHTML;
    printBtn.innerHTML = '📄 Creating PDF...';
    printBtn.disabled = true;
    
    try {
        const text = textInput ? textInput.value.trim() || 'AuraText' : 'AuraText';
        
        // Create print window
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>AuraText - ${text}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 40px;
                        background: white;
                    }
                    .print-container {
                        max-width: 800px;
                        margin: 0 auto;
                        text-align: center;
                    }
                    .logo {
                        font-size: 24px;
                        font-weight: bold;
                        color: #8a2be2;
                        margin-bottom: 20px;
                    }
                    .text-display {
                        font-size: 48px;
                        font-weight: bold;
                        margin: 40px 0;
                        padding: 30px;
                        background: #f5f7ff;
                        border-radius: 12px;
                        word-break: break-word;
                    }
                    .details {
                        text-align: left;
                        margin-top: 30px;
                        padding: 20px;
                        background: #f8f9fa;
                        border-radius: 8px;
                    }
                    @media print {
                        body { padding: 20px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="print-container">
                    <div class="logo">AuraText Generator</div>
                    <h1>Your Text Effect</h1>
                    
                    <div class="text-display" style="
                        font-family: ${textDisplay.style.fontFamily || 'Arial'};
                        color: ${textDisplay.style.color || '#8a2be2'};
                        text-shadow: ${textDisplay.style.textShadow || 'none'};
                        background: ${textDisplay.style.background || 'none'};
                        -webkit-text-stroke: ${textDisplay.style.webkitTextStroke || 'none'};
                    ">
                        ${text}
                    </div>
                    
                    <div class="details">
                        <h3>Details:</h3>
                        <p><strong>Text:</strong> ${text}</p>
                        <p><strong>Effect:</strong> ${currentEffect}</p>
                        <p><strong>Color:</strong> ${currentColor}</p>
                        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                        <p><strong>Website:</strong> auratext.app</p>
                    </div>
                    
                    <div class="no-print" style="margin-top: 30px;">
                        <button onclick="window.print()" style="
                            padding: 12px 24px;
                            background: #8a2be2;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            margin-right: 10px;
                            font-size: 16px;
                        ">
                            🖨️ Print
                        </button>
                        <button onclick="window.close()" style="
                            padding: 12px 24px;
                            background: #666;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 16px;
                        ">
                            ❌ Close
                        </button>
                    </div>
                </div>
                <script>
                    // Auto-focus print dialog
                    setTimeout(() => {
                        window.print();
                    }, 500);
                </script>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        
        showToast('PDF ready for printing!');
        
    } catch (error) {
        console.error('Error creating PDF:', error);
        showToast('Error creating PDF', 'error');
    } finally {
        // Reset button
        printBtn.innerHTML = originalText;
        printBtn.disabled = false;
    }
}

// Copy CSS style to clipboard
function copyStyle() {
    if (!textDisplay) return;
    
    const styles = window.getComputedStyle(textDisplay);
    
    // Get relevant styles
    const css = `
/* AuraText CSS - ${currentEffect} */
.text-effect {
    font-family: ${styles.fontFamily};
    font-size: ${styles.fontSize};
    font-weight: ${styles.fontWeight};
    color: ${styles.color};
    text-shadow: ${styles.textShadow};
    letter-spacing: ${styles.letterSpacing};
    ${styles.background && styles.background !== 'none' ? `background: ${styles.background};` : ''}
    ${styles.webkitBackgroundClip ? `-webkit-background-clip: ${styles.webkitBackgroundClip};` : ''}
    ${styles.backgroundClip ? `background-clip: ${styles.backgroundClip};` : ''}
    ${styles.webkitTextStroke ? `-webkit-text-stroke: ${styles.webkitTextStroke};` : ''}
    ${styles.fontStyle ? `font-style: ${styles.fontStyle};` : ''}
    ${styles.textTransform ? `text-transform: ${styles.textTransform};` : ''}
    ${styles.transform ? `transform: ${styles.transform};` : ''}
}
    `.trim();
    
    // Copy to clipboard
    navigator.clipboard.writeText(css).then(() => {
        showToast('CSS style copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        // Fallback method
        const textArea = document.createElement('textarea');
        textArea.value = css;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('CSS style copied to clipboard!');
    });
}

// Show toast notification
function showToast(message, type = 'success') {
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    
    // Set color based on type
    if (type === 'error') {
        toast.style.backgroundColor = '#dc3545';
    } else if (type === 'warning') {
        toast.style.backgroundColor = '#ffc107';
        toast.style.color = '#000';
    } else {
        toast.style.backgroundColor = '#8a2be2';
        toast.style.color = '#fff';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize the app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
