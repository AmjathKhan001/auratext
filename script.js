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
            element.style.fontFamily = "'Monoton', cursive";
            element.style.color = '#fff';
            element.style.textShadow = `
                0 0 20px ${currentColor},
                0 0 40px ${currentColor},
                0 0 60px ${currentColor},
                0 0 80px ${currentColor},
                0 0 100px ${currentColor}
            `;
            element.style.letterSpacing = '3px';
        }
    },
    {
        id: 'purple-aura',
        name: 'Purple Aura',
        apply: (element) => {
            element.style.fontFamily = "'Poppins', sans-serif";
            element.style.fontWeight = '900';
            element.style.color = '#fff';
            element.style.textShadow = `
                0 0 10px #9d4aff,
                0 0 20px #9d4aff,
                0 0 30px #9d4aff,
                0 0 40px #8a2be2,
                0 0 70px #8a2be2,
                0 0 80px #8a2be2
            `;
            element.style.letterSpacing = '2px';
        }
    },
    {
        id: 'neon-cyan',
        name: 'Neon Cyan',
        apply: (element) => {
            element.style.fontFamily = "'Bungee', cursive";
            element.style.color = '#00ffff';
            element.style.textShadow = `
                0 0 10px #00ffff,
                0 0 20px #00ffff,
                0 0 30px #00ffff,
                0 0 40px #008b8b,
                0 0 70px #008b8b,
                0 0 80px #008b8b,
                0 0 100px #008b8b,
                0 0 150px #008b8b
            `;
            element.style.letterSpacing = '1px';
        }
    },
    {
        id: 'bungee-3d',
        name: 'Bungee 3D',
        apply: (element) => {
            element.style.fontFamily = "'Bungee', cursive";
            element.style.color = currentColor;
            element.style.textShadow = `
                3px 3px 0 #000,
                6px 6px 0 rgba(0,0,0,0.2),
                9px 9px 0 rgba(0,0,0,0.1)
            `;
            element.style.letterSpacing = '1px';
        }
    },
    {
        id: 'glitch',
        name: 'Glitch',
        apply: (element) => {
            element.style.fontFamily = "'Rubik Glitch', cursive";
            element.style.color = currentColor;
            element.style.textShadow = `
                2px 0 #ff00ff,
                -2px 0 #00ffff
            `;
            element.style.letterSpacing = '2px';
            element.style.animation = 'glitch 0.3s infinite';
        }
    },
    {
        id: 'gradient',
        name: 'Gradient',
        apply: (element) => {
            element.style.fontFamily = "'Poppins', sans-serif";
            element.style.fontWeight = '800';
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
            element.style.fontFamily = "'Poppins', sans-serif";
            element.style.fontWeight = '900';
            element.style.color = 'transparent';
            element.style.webkitTextStroke = `3px ${currentColor}`;
            element.style.textShadow = 'none';
            element.style.letterSpacing = '1px';
        }
    },
    {
        id: 'vintage',
        name: 'Vintage',
        apply: (element) => {
            element.style.fontFamily = "'Times New Roman', serif";
            element.style.fontWeight = '700';
            element.style.color = '#8B4513';
            element.style.textShadow = `
                2px 2px 0 #DEB887,
                4px 4px 0 rgba(139, 69, 19, 0.3)
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
            element.style.fontWeight = '900';
            element.style.color = '#ff4a4a';
            element.style.textShadow = `
                3px 3px 0 #000,
                5px 5px 0 rgba(0,0,0,0.2)
            `;
            element.style.letterSpacing = '1px';
            element.style.transform = 'skew(-5deg)';
        }
    },
    {
        id: 'elegant',
        name: 'Elegant',
        apply: (element) => {
            element.style.fontFamily = "'Georgia', serif";
            element.style.fontWeight = '400';
            element.style.color = '#333';
            element.style.textShadow = `
                1px 1px 0 #fff,
                2px 2px 0 rgba(0,0,0,0.1)
            `;
            element.style.letterSpacing = '3px';
            element.style.textTransform = 'uppercase';
        }
    },
    {
        id: 'fire',
        name: 'Fire',
        apply: (element) => {
            element.style.fontFamily = "'Poppins', sans-serif";
            element.style.fontWeight = '900';
            element.style.background = 'linear-gradient(to bottom, #ff4a4a, #ffb74a)';
            element.style.webkitBackgroundClip = 'text';
            element.style.backgroundClip = 'text';
            element.style.color = 'transparent';
            element.style.textShadow = '0 0 20px #ff4a4a';
            element.style.letterSpacing = '1px';
        }
    },
    {
        id: 'ice',
        name: 'Ice',
        apply: (element) => {
            element.style.fontFamily = "'Poppins', sans-serif";
            element.style.fontWeight = '900';
            element.style.color = '#4aefff';
            element.style.textShadow = `
                0 0 10px #4aefff,
                0 0 20px #4aefff,
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
            element.style.fontFamily = "'Poppins', sans-serif";
            element.style.fontWeight = '900';
            element.style.color = currentColor;
            
            let shadow = '';
            for(let i = 1; i <= 20; i++) {
                shadow += `${i}px ${i}px 0 rgba(0,0,0,${0.1 + (i * 0.02)})`;
                if(i < 20) shadow += ', ';
            }
            
            element.style.textShadow = shadow;
            element.style.letterSpacing = '1px';
        }
    },
    {
        id: 'gold',
        name: 'Gold Foil',
        apply: (element) => {
            element.style.fontFamily = "'Poppins', sans-serif";
            element.style.fontWeight = '900';
            element.style.background = 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)';
            element.style.webkitBackgroundClip = 'text';
            element.style.backgroundClip = 'text';
            element.style.color = 'transparent';
            element.style.textShadow = '2px 2px 4px rgba(0,0,0,0.3)';
        }
    },
    {
        id: 'chrome',
        name: 'Chrome',
        apply: (element) => {
            element.style.fontFamily = "'Poppins', sans-serif";
            element.style.fontWeight = '900';
            element.style.background = 'linear-gradient(to right, #757F9A, #D7DDE8)';
            element.style.webkitBackgroundClip = 'text';
            element.style.backgroundClip = 'text';
            element.style.color = 'transparent';
            element.style.textShadow = '2px 2px 4px rgba(0,0,0,0.3)';
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
            <div class="effect-preview" style="font-size: 24px;">
                <span class="effect-preview-text">${effect.name}</span>
            </div>
            <div class="effect-name">${effect.name}</div>
        `;
        
        // Apply preview styling
        const previewText = card.querySelector('.effect-preview-text');
        previewText.textContent = effect.name.length > 10 ? effect.name.substring(0, 10) + '...' : effect.name;
        
        // Create a temporary function to apply effect to preview
        const tempApply = effect.apply;
        effect.apply(previewText);
        
        // Reset some styles for preview
        previewText.style.fontSize = '24px';
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
        preview.textContent = text.length > 10 ? text.substring(0, 10) + '...' : text;
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
    if (!textDisplay) return;
    
    // Show loading state
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    downloadBtn.disabled = true;
    
    // Use html2canvas to capture the text
    html2canvas(textDisplay, {
        backgroundColor: null,
        scale: 3,
        width: textDisplay.offsetWidth,
        height: textDisplay.offsetHeight,
        onclone: function(clonedDoc) {
            const clonedText = clonedDoc.getElementById('text-display');
            if (clonedText) {
                clonedText.style.fontSize = textDisplay.style.fontSize;
                clonedText.style.color = textDisplay.style.color;
                clonedText.style.textShadow = textDisplay.style.textShadow;
                clonedText.style.fontFamily = textDisplay.style.fontFamily;
                clonedText.style.fontWeight = textDisplay.style.fontWeight;
                clonedText.style.background = textDisplay.style.background;
                clonedText.style.webkitBackgroundClip = textDisplay.style.webkitBackgroundClip;
                clonedText.style.backgroundClip = textDisplay.style.backgroundClip;
                clonedText.style.webkitTextStroke = textDisplay.style.webkitTextStroke;
            }
        }
    }).then(canvas => {
        // Convert canvas to data URL
        const imageURL = canvas.toDataURL('image/png', 1.0);
        
        // Create download link
        const link = document.createElement('a');
        link.href = imageURL;
        const text = textInput ? textInput.value.trim() || 'AuraText' : 'AuraText';
        link.download = `auratext-${text}-${currentEffect}-${Date.now()}.png`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Reset button
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
        
        showToast('Image downloaded successfully!');
    }).catch(error => {
        console.error('Error generating image:', error);
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
        showToast('Error generating image. Please try again.', 'error');
    });
}

// Save as PDF function
function saveAsPDF() {
    if (!textDisplay) return;
    
    // Show loading state
    const originalText = printBtn.innerHTML;
    printBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating PDF...';
    printBtn.disabled = true;
    
    // Use html2canvas first
    html2canvas(textDisplay, {
        backgroundColor: null,
        scale: 2,
        width: textDisplay.offsetWidth,
        height: textDisplay.offsetHeight,
        onclone: function(clonedDoc) {
            const clonedText = clonedDoc.getElementById('text-display');
            if (clonedText) {
                clonedText.style.fontSize = textDisplay.style.fontSize;
                clonedText.style.color = textDisplay.style.color;
                clonedText.style.textShadow = textDisplay.style.textShadow;
                clonedText.style.fontFamily = textDisplay.style.fontFamily;
                clonedText.style.fontWeight = textDisplay.style.fontWeight;
                clonedText.style.background = textDisplay.style.background;
                clonedText.style.webkitBackgroundClip = textDisplay.style.webkitBackgroundClip;
                clonedText.style.backgroundClip = textDisplay.style.backgroundClip;
                clonedText.style.webkitTextStroke = textDisplay.style.webkitTextStroke;
            }
        }
    }).then(canvas => {
        // Convert canvas to image data
        const imgData = canvas.toDataURL('image/png');
        
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        const text = textInput ? textInput.value.trim() || 'AuraText' : 'AuraText';
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>AuraText - ${text}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        margin: 0;
                        padding: 20px;
                        background: #f5f5f5;
                    }
                    .print-container {
                        text-align: center;
                        background: white;
                        padding: 40px;
                        border-radius: 10px;
                        box-shadow: 0 0 20px rgba(0,0,0,0.1);
                        max-width: 800px;
                    }
                    .logo {
                        font-size: 24px;
                        font-weight: bold;
                        color: #8a2be2;
                        margin-bottom: 20px;
                    }
                    .print-image {
                        max-width: 100%;
                        height: auto;
                        margin: 20px 0;
                    }
                    .details {
                        text-align: left;
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #eee;
                    }
                    .details h3 {
                        color: #333;
                        margin-bottom: 10px;
                    }
                    .details p {
                        margin: 5px 0;
                        color: #666;
                    }
                    @media print {
                        body {
                            background: white;
                            padding: 0;
                        }
                        .print-container {
                            box-shadow: none;
                            padding: 0;
                        }
                        .no-print {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="print-container">
                    <div class="logo">AuraText Generator</div>
                    <h1>Your Text Effect</h1>
                    <img src="${imgData}" alt="${text} with ${currentEffect} effect" class="print-image">
                    
                    <div class="details">
                        <h3>Details:</h3>
                        <p><strong>Text:</strong> ${text}</p>
                        <p><strong>Effect:</strong> ${currentEffect}</p>
                        <p><strong>Color:</strong> ${currentColor}</p>
                        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                        <p><strong>Website:</strong> auratext.app</p>
                    </div>
                    
                    <div class="no-print" style="margin-top: 30px;">
                        <button onclick="window.print()" style="padding: 10px 20px; background: #8a2be2; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                            Print
                        </button>
                        <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            Close
                        </button>
                    </div>
                </div>
                <script>
                    // Auto-print option (optional)
                    // window.onload = function() {
                    //     window.print();
                    // }
                </script>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        
        // Reset button
        printBtn.innerHTML = originalText;
        printBtn.disabled = false;
        
        showToast('PDF ready for printing!');
        
    }).catch(error => {
        console.error('Error creating PDF:', error);
        printBtn.innerHTML = originalText;
        printBtn.disabled = false;
        showToast('Error creating PDF. Please try again.', 'error');
    });
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
        toast.style.backgroundColor = 'var(--danger-color)';
    } else if (type === 'warning') {
        toast.style.backgroundColor = 'var(--warning-color)';
    } else {
        toast.style.backgroundColor = 'var(--primary-color)';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Add glitch animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
    }
    
    .effect-preview-text {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
