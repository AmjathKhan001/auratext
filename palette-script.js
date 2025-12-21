// Color Palette Generator Script
document.addEventListener('DOMContentLoaded', function() {
    // Current palette
    let currentPalette = [
        { hex: '#8a2be2', name: 'Primary' },
        { hex: '#4a00e0', name: 'Secondary' },
        { hex: '#9b4dff', name: 'Accent' },
        { hex: '#6a1bb8', name: 'Dark' },
        { hex: '#b388ff', name: 'Light' }
    ];
    
    // Current color
    let currentColor = {
        hex: '#8a2be2',
        rgb: { r: 138, g: 43, b: 226 },
        hsl: { h: 271, s: 76, l: 53 },
        hsv: { h: 271, s: 81, v: 89 },
        cmyk: { c: 39, m: 81, y: 0, k: 11 }
    };
    
    // Current harmony
    let currentHarmony = 'complementary';
    
    // Saved palettes
    let savedPalettes = JSON.parse(localStorage.getItem('auraTextSavedPalettes')) || [];
    
    // DOM Elements
    const colorPreview = document.getElementById('colorPreview');
    const colorHex = document.getElementById('colorHex');
    const rgbValue = document.getElementById('rgbValue');
    const hslValue = document.getElementById('hslValue');
    const hsvValue = document.getElementById('hsvValue');
    const cmykValue = document.getElementById('cmykValue');
    const hueSlider = document.getElementById('hueSlider');
    const saturationSlider = document.getElementById('saturationSlider');
    const lightnessSlider = document.getElementById('lightnessSlider');
    const alphaSlider = document.getElementById('alphaSlider');
    const hueValue = document.getElementById('hueValue');
    const saturationValue = document.getElementById('saturationValue');
    const lightnessValue = document.getElementById('lightnessValue');
    const alphaValue = document.getElementById('alphaValue');
    const randomColorBtn = document.getElementById('randomColor');
    const harmonyBtns = document.querySelectorAll('.harmony-btn');
    const paletteGrid = document.getElementById('paletteGrid');
    const paletteName = document.getElementById('paletteName');
    const savePaletteBtn = document.getElementById('savePalette');
    const exportPaletteBtn = document.getElementById('exportPalette');
    const addToPaletteBtn = document.getElementById('addToPalette');
    const clearPaletteBtn = document.getElementById('clearPalette');
    const contrastRatios = document.getElementById('contrastRatios');
    const psychologyGrid = document.getElementById('psychologyGrid');
    const savedGrid = document.getElementById('savedGrid');
    const exportModal = document.getElementById('exportModal');
    const exportCode = document.getElementById('exportCode');
    const copyExportBtn = document.getElementById('copyExport');
    const exportFormatBtns = document.querySelectorAll('.export-format');
    const exportBtns = document.querySelectorAll('.export-btn');
    
    // Color wheel elements
    const wheelCanvas = document.getElementById('wheelCanvas');
    const wheelMarker = document.getElementById('wheelMarker');
    const colorWheel = document.getElementById('colorWheel');
    
    // Initialize
    initColorWheel();
    updateColorDisplay();
    generateHarmonyPalette();
    updatePaletteDisplay();
    updateAccessibility();
    updatePsychologyInfo();
    loadSavedPalettes();
    
    // Event Listeners
    colorHex.addEventListener('input', function() {
        const hex = this.value;
        if (isValidHex(hex)) {
            updateColorFromHex(hex);
        }
    });
    
    colorHex.addEventListener('change', function() {
        if (!isValidHex(this.value)) {
            this.value = currentColor.hex;
        }
    });
    
    hueSlider.addEventListener('input', updateColorFromHSL);
    saturationSlider.addEventListener('input', updateColorFromHSL);
    lightnessSlider.addEventListener('input', updateColorFromHSL);
    alphaSlider.addEventListener('input', updateAlpha);
    
    randomColorBtn.addEventListener('click', generateRandomColor);
    
    harmonyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            harmonyBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentHarmony = this.dataset.harmony;
            generateHarmonyPalette();
        });
    });
    
    savePaletteBtn.addEventListener('click', saveCurrentPalette);
    exportPaletteBtn.addEventListener('click', showExportModal);
    addToPaletteBtn.addEventListener('click', addCurrentColorToPalette);
    clearPaletteBtn.addEventListener('click', clearPalette);
    
    paletteName.addEventListener('input', function() {
        // Update saved palette name if it exists
        const savedIndex = savedPalettes.findIndex(p => p.name === this.value);
        if (savedIndex !== -1) {
            savedPalettes[savedIndex].name = this.value;
            savePalettesToStorage();
        }
    });
    
    // Color picker from screen
    colorPreview.addEventListener('click', function() {
        if (typeof EyeDropper !== 'undefined') {
            const eyeDropper = new EyeDropper();
            eyeDropper.open()
                .then(result => {
                    updateColorFromHex(result.sRGBHex);
                })
                .catch(e => {
                    console.log('EyeDropper not supported or cancelled:', e);
                    alert('Color picker not supported in your browser. Try Chrome or Edge.');
                });
        } else {
            alert('Color picker not supported in your browser. Try Chrome or Edge 98+.');
        }
    });
    
    // Export format buttons
    exportFormatBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            exportFormatBtns.forEach(b => b.style.borderColor = 'transparent');
            this.style.borderColor = '#8a2be2';
        });
    });
    
    exportBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const format = this.dataset.format;
            showExportModal();
            generateExportCode(format);
        });
    });
    
    // Modal close
    document.querySelector('.modal-close').addEventListener('click', function() {
        exportModal.style.display = 'none';
    });
    
    copyExportBtn.addEventListener('click', function() {
        const text = exportCode.textContent;
        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Copied!';
            this.classList.add('success');
            
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.classList.remove('success');
            }, 2000);
        });
    });
    
    // Close modal on outside click
    window.addEventListener('click', function(e) {
        if (e.target === exportModal) {
            exportModal.style.display = 'none';
        }
    });
    
    // Functions
    function initColorWheel() {
        const ctx = wheelCanvas.getContext('2d');
        const width = wheelCanvas.width = 300;
        const height = wheelCanvas.height = 300;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2;
        
        // Draw color wheel
        for (let angle = 0; angle < 360; angle += 0.5) {
            const startAngle = (angle - 2) * Math.PI / 180;
            const endAngle = angle * Math.PI / 180;
            
            for (let r = 0; r < radius; r++) {
                const saturation = r / radius;
                const hue = angle;
                const lightness = 0.5;
                
                const [rVal, gVal, bVal] = hslToRgb(hue / 360, saturation, lightness);
                
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, r, startAngle, endAngle);
                ctx.closePath();
                
                ctx.fillStyle = `rgb(${rVal}, ${gVal}, ${bVal})`;
                ctx.fill();
            }
        }
        
        // Add click event
        wheelCanvas.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= radius) {
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                const hue = (angle + 360) % 360;
                const saturation = distance / radius;
                
                updateColorFromHSLValues(hue, saturation * 100, 50);
                
                // Update marker position
                const markerX = centerX + (distance * Math.cos(angle * Math.PI / 180));
                const markerY = centerY + (distance * Math.sin(angle * Math.PI / 180));
                
                wheelMarker.style.left = `${markerX - 10}px`;
                wheelMarker.style.top = `${markerY - 10}px`;
            }
        });
        
        // Set initial marker position
        const markerX = centerX + (radius * 0.76 * Math.cos(currentColor.hsl.h * Math.PI / 180));
        const markerY = centerY + (radius * 0.76 * Math.sin(currentColor.hsl.h * Math.PI / 180));
        wheelMarker.style.left = `${markerX - 10}px`;
        wheelMarker.style.top = `${markerY - 10}px`;
    }
    
    function updateColorDisplay() {
        // Update preview
        colorPreview.style.backgroundColor = currentColor.hex;
        
        // Update hex input
        colorHex.value = currentColor.hex;
        
        // Update RGB
        rgbValue.textContent = `${currentColor.rgb.r}, ${currentColor.rgb.g}, ${currentColor.rgb.b}`;
        
        // Update HSL
        hslValue.textContent = `${Math.round(currentColor.hsl.h)}°, ${Math.round(currentColor.hsl.s)}%, ${Math.round(currentColor.hsl.l)}%`;
        
        // Update HSV
        hsvValue.textContent = `${Math.round(currentColor.hsv.h)}°, ${Math.round(currentColor.hsv.s)}%, ${Math.round(currentColor.hsv.v)}%`;
        
        // Update CMYK
        cmykValue.textContent = `${Math.round(currentColor.cmyk.c)}, ${Math.round(currentColor.cmyk.m)}, ${Math.round(currentColor.cmyk.y)}, ${Math.round(currentColor.cmyk.k)}`;
        
        // Update sliders
        hueSlider.value = Math.round(currentColor.hsl.h);
        saturationSlider.value = Math.round(currentColor.hsl.s);
        lightnessSlider.value = Math.round(currentColor.hsl.l);
        
        hueValue.textContent = `${Math.round(currentColor.hsl.h)}°`;
        saturationValue.textContent = `${Math.round(currentColor.hsl.s)}%`;
        lightnessValue.textContent = `${Math.round(currentColor.hsl.l)}%`;
    }
    
    function updateColorFromHex(hex) {
        hex = hex.startsWith('#') ? hex : '#' + hex;
        
        // Convert hex to RGB
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        updateColorFromRGB(r, g, b);
    }
    
    function updateColorFromRGB(r, g, b) {
        // Update RGB
        currentColor.rgb = { r, g, b };
        
        // Convert to hex
        currentColor.hex = rgbToHex(r, g, b);
        
        // Convert to HSL
        const hsl = rgbToHsl(r, g, b);
        currentColor.hsl = hsl;
        
        // Convert to HSV
        const hsv = rgbToHsv(r, g, b);
        currentColor.hsv = hsv;
        
        // Convert to CMYK
        const cmyk = rgbToCmyk(r, g, b);
        currentColor.cmyk = cmyk;
        
        updateColorDisplay();
        generateHarmonyPalette();
        updateAccessibility();
    }
    
    function updateColorFromHSL() {
        const h = parseInt(hueSlider.value);
        const s = parseInt(saturationSlider.value);
        const l = parseInt(lightnessSlider.value);
        
        updateColorFromHSLValues(h, s, l);
    }
    
    function updateColorFromHSLValues(h, s, l) {
        currentColor.hsl = { h, s, l };
        
        // Convert to RGB
        const rgb = hslToRgb(h / 360, s / 100, l / 100);
        currentColor.rgb = { r: rgb[0], g: rgb[1], b: rgb[2] };
        
        // Update other values
        currentColor.hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
        currentColor.hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
        currentColor.cmyk = rgbToCmyk(rgb[0], rgb[1], rgb[2]);
        
        updateColorDisplay();
        generateHarmonyPalette();
        updateAccessibility();
    }
    
    function updateAlpha() {
        const alpha = parseInt(alphaSlider.value);
        alphaValue.textContent = `${alpha}%`;
    }
    
    function generateRandomColor() {
        const h = Math.floor(Math.random() * 360);
        const s = Math.floor(Math.random() * 30) + 50; // 50-80%
        const l = Math.floor(Math.random() * 30) + 35; // 35-65%
        
        updateColorFromHSLValues(h, s, l);
    }
    
    function generateHarmonyPalette() {
        const baseHue = currentColor.hsl.h;
        const baseSat = currentColor.hsl.s;
        const baseLight = currentColor.hsl.l;
        
        let harmonyColors = [];
        
        switch(currentHarmony) {
            case 'complementary':
                harmonyColors = [
                    { h: baseHue, s: baseSat, l: baseLight },
                    { h: (baseHue + 180) % 360, s: baseSat, l: baseLight },
                    { h: baseHue, s: baseSat, l: baseLight + 20 },
                    { h: (baseHue + 180) % 360, s: baseSat, l: baseLight + 20 },
                    { h: baseHue, s: baseSat, l: baseLight - 20 }
                ];
                break;
                
            case 'analogous':
                harmonyColors = [
                    { h: (baseHue - 30 + 360) % 360, s: baseSat, l: baseLight },
                    { h: (baseHue - 15 + 360) % 360, s: baseSat, l: baseLight },
                    { h: baseHue, s: baseSat, l: baseLight },
                    { h: (baseHue + 15) % 360, s: baseSat, l: baseLight },
                    { h: (baseHue + 30) % 360, s: baseSat, l: baseLight }
                ];
                break;
                
            case 'triadic':
                harmonyColors = [
                    { h: baseHue, s: baseSat, l: baseLight },
                    { h: (baseHue + 120) % 360, s: baseSat, l: baseLight },
                    { h: (baseHue + 240) % 360, s: baseSat, l: baseLight },
                    { h: baseHue, s: baseSat, l: baseLight + 20 },
                    { h: (baseHue + 120) % 360, s: baseSat, l: baseLight + 20 }
                ];
                break;
                
            case 'tetradic':
                harmonyColors = [
                    { h: baseHue, s: baseSat, l: baseLight },
                    { h: (baseHue + 90) % 360, s: baseSat, l: baseLight },
                    { h: (baseHue + 180) % 360, s: baseSat, l: baseLight },
                    { h: (baseHue + 270) % 360, s: baseSat, l: baseLight },
                    { h: baseHue, s: baseSat, l: baseLight + 20 }
                ];
                break;
                
            case 'monochromatic':
                harmonyColors = [
                    { h: baseHue, s: baseSat, l: baseLight - 40 },
                    { h: baseHue, s: baseSat, l: baseLight - 20 },
                    { h: baseHue, s: baseSat, l: baseLight },
                    { h: baseHue, s: baseSat, l: baseLight + 20 },
                    { h: baseHue, s: baseSat, l: baseLight + 40 }
                ];
                break;
                
            case 'split-complementary':
                harmonyColors = [
                    { h: baseHue, s: baseSat, l: baseLight },
                    { h: (baseHue + 150) % 360, s: baseSat, l: baseLight },
                    { h: (baseHue + 210) % 360, s: baseSat, l: baseLight },
                    { h: baseHue, s: baseSat, l: baseLight + 20 },
                    { h: (baseHue + 150) % 360, s: baseSat, l: baseLight + 20 }
                ];
                break;
        }
        
        // Convert to palette format
        currentPalette = harmonyColors.map((color, index) => {
            const rgb = hslToRgb(color.h / 360, color.s / 100, color.l / 100);
            const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
            
            const names = ['Primary', 'Secondary', 'Accent', 'Dark', 'Light'];
            return {
                hex: hex,
                name: names[index] || `Color ${index + 1}`,
                rgb: { r: rgb[0], g: rgb[1], b: rgb[2] },
                hsl: { h: color.h, s: color.s, l: color.l }
            };
        });
        
        updatePaletteDisplay();
    }
    
    function updatePaletteDisplay() {
        paletteGrid.innerHTML = '';
        
        currentPalette.forEach((color, index) => {
            const rgb = hexToRgb(color.hex);
            const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
            
            const colorCard = document.createElement('div');
            colorCard.className = 'color-card';
            colorCard.dataset.index = index;
            
            colorCard.innerHTML = `
                <div class="color-swatch" style="background-color: ${color.hex};">
                    <i class="fas fa-palette"></i>
                </div>
                <div class="color-info">
                    <div class="color-hex">
                        ${color.hex.toUpperCase()}
                        <button class="copy-hex" title="Copy hex value">
                            <i class="far fa-copy"></i>
                        </button>
                    </div>
                    <div class="color-values-small">
                        <span>RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}</span>
                        <span>HSL: ${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%</span>
                    </div>
                </div>
            `;
            
            // Add click event to select color
            colorCard.addEventListener('click', function(e) {
                if (!e.target.closest('.copy-hex')) {
                    // Select this color as current
                    updateColorFromHex(color.hex);
                    
                    // Update active state
                    document.querySelectorAll('.color-card').forEach(card => {
                        card.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            });
            
            // Add copy event
            const copyBtn = colorCard.querySelector('.copy-hex');
            copyBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                navigator.clipboard.writeText(color.hex).then(() => {
                    const originalHTML = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i>';
                    
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                    }, 2000);
                });
            });
            
            paletteGrid.appendChild(colorCard);
        });
        
        // Update accessibility after palette changes
        updateAccessibility();
    }
    
    function updateAccessibility() {
        contrastRatios.innerHTML = '';
        
        // Check contrast between primary color and common backgrounds
        const primaryColor = currentPalette[0];
        const primaryRgb = hexToRgb(primaryColor.hex);
        
        const testColors = [
            { name: 'White', hex: '#ffffff', rgb: { r: 255, g: 255, b: 255 } },
            { name: 'Light Gray', hex: '#f0f0f0', rgb: { r: 240, g: 240, b: 240 } },
            { name: 'Dark Gray', hex: '#333333', rgb: { r: 51, g: 51, b: 51 } },
            { name: 'Black', hex: '#000000', rgb: { r: 0, g: 0, b: 0 } }
        ];
        
        testColors.forEach(testColor => {
            const ratio = calculateContrastRatio(primaryRgb, testColor.rgb);
            const rating = getContrastRating(ratio);
            
            const contrastItem = document.createElement('div');
            contrastItem.className = 'contrast-item';
            
            contrastItem.innerHTML = `
                <div class="contrast-preview">
                    <div class="contrast-color" style="background-color: ${testColor.hex}; color: ${primaryColor.hex}">
                        Aa
                    </div>
                    <div class="contrast-color" style="background-color: ${primaryColor.hex}; color: ${testColor.hex}">
                        Aa
                    </div>
                </div>
                <div class="contrast-info">
                    <div class="contrast-ratio">${ratio.toFixed(2)}:1</div>
                    <div class="contrast-rating ${rating.class}">${rating.text}</div>
                    <div style="font-size: 12px; color: #b5b3cc; margin-top: 5px;">
                        ${primaryColor.hex} on ${testColor.name}
                    </div>
                </div>
            `;
            
            contrastRatios.appendChild(contrastItem);
        });
    }
    
    function updatePsychologyInfo() {
        const psychologyData = [
            {
                color: '#ff0000',
                title: 'Red',
                icon: 'fas fa-fire',
                content: 'Energy, passion, danger, excitement. Increases heart rate and creates urgency.'
            },
            {
                color: '#ff8000',
                title: 'Orange',
                icon: 'fas fa-sun',
                content: 'Creativity, enthusiasm, success, encouragement. Friendly and approachable.'
            },
            {
                color: '#ffff00',
                title: 'Yellow',
                icon: 'fas fa-star',
                content: 'Happiness, optimism, clarity, warmth. Grabs attention but can be overwhelming.'
            },
            {
                color: '#00ff00',
                title: 'Green',
                icon: 'fas fa-leaf',
                content: 'Nature, growth, health, money. Calming and associated with safety.'
            },
            {
                color: '#0000ff',
                title: 'Blue',
                icon: 'fas fa-tint',
                content: 'Trust, stability, calm, professionalism. Most popular brand color.'
            },
            {
                color: '#8000ff',
                title: 'Purple',
                icon: 'fas fa-crown',
                content: 'Royalty, luxury, spirituality, creativity. Associated with wisdom and dignity.'
            },
            {
                color: '#ff00ff',
                title: 'Magenta',
                icon: 'fas fa-heart',
                content: 'Harmony, balance, imagination, innovation. Spiritual yet practical.'
            },
            {
                color: '#000000',
                title: 'Black',
                icon: 'fas fa-moon',
                content: 'Power, elegance, sophistication, mystery. Creates strong contrast.'
            }
        ];
        
        psychologyGrid.innerHTML = '';
        
        psychologyData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'psychology-card';
            
            card.innerHTML = `
                <div class="psychology-header">
                    <div class="psychology-icon" style="background-color: ${item.color};">
                        <i class="${item.icon}"></i>
                    </div>
                    <div class="psychology-title">${item.title}</div>
                </div>
                <div class="psychology-content">
                    ${item.content}
                </div>
            `;
            
            psychologyGrid.appendChild(card);
        });
    }
    
    function addCurrentColorToPalette() {
        // Add current color to palette if not already there
        const hex = currentColor.hex.toUpperCase();
        const exists = currentPalette.some(color => color.hex.toUpperCase() === hex);
        
        if (!exists) {
            const name = `Color ${currentPalette.length + 1}`;
            currentPalette.push({
                hex: currentColor.hex,
                name: name,
                rgb: currentColor.rgb,
                hsl: currentColor.hsl
            });
            
            updatePaletteDisplay();
        }
    }
    
    function clearPalette() {
        if (confirm('Are you sure you want to clear the palette?')) {
            currentPalette = [];
            updatePaletteDisplay();
        }
    }
    
    function saveCurrentPalette() {
        const name = paletteName.value.trim() || 'Untitled Palette';
        const date = new Date().toLocaleDateString();
        
        const paletteToSave = {
            id: Date.now(),
            name: name,
            date: date,
            colors: [...currentPalette]
        };
        
        // Check if palette with this name already exists
        const existingIndex = savedPalettes.findIndex(p => p.name === name);
        if (existingIndex !== -1) {
            savedPalettes[existingIndex] = paletteToSave;
        } else {
            savedPalettes.unshift(paletteToSave);
        }
        
        // Keep only last 20 palettes
        if (savedPalettes.length > 20) {
            savedPalettes = savedPalettes.slice(0, 20);
        }
        
        savePalettesToStorage();
        loadSavedPalettes();
        
        // Show success message
        const originalText = savePaletteBtn.innerHTML;
        savePaletteBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
        savePaletteBtn.classList.add('success');
        
        setTimeout(() => {
            savePaletteBtn.innerHTML = originalText;
            savePaletteBtn.classList.remove('success');
        }, 2000);
    }
    
    function loadSavedPalettes() {
        savedGrid.innerHTML = '';
        
        if (savedPalettes.length === 0) {
            savedGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #b5b3cc;">
                    <i class="fas fa-palette" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                    <p>No saved palettes yet. Save your first palette to see it here!</p>
                </div>
            `;
            return;
        }
        
        savedPalettes.forEach(palette => {
            const savedItem = document.createElement('div');
            savedItem.className = 'saved-item';
            savedItem.dataset.id = palette.id;
            
            const colorsHtml = palette.colors.map(color => 
                `<div class="saved-color" style="background-color: ${color.hex};"></div>`
            ).join('');
            
            savedItem.innerHTML = `
                <div class="saved-colors">
                    ${colorsHtml}
                </div>
                <div class="saved-info">
                    <div class="saved-name">${palette.name}</div>
                    <div class="saved-meta">
                        <span>${palette.colors.length} colors</span>
                        <span>${palette.date}</span>
                    </div>
                </div>
            `;
            
            savedItem.addEventListener('click', function() {
                // Load this palette
                currentPalette = [...palette.colors];
                paletteName.value = palette.name;
                updatePaletteDisplay();
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            
            savedGrid.appendChild(savedItem);
        });
    }
    
    function savePalettesToStorage() {
        localStorage.setItem('auraTextSavedPalettes', JSON.stringify(savedPalettes));
    }
    
    function showExportModal() {
        exportModal.style.display = 'block';
        generateExportCode('css');
    }
    
    function generateExportCode(format) {
        let code = '';
        
        switch(format) {
            case 'css':
                code = `/* CSS Variables for ${paletteName.value} */\n:root {\n`;
                currentPalette.forEach((color, index) => {
                    const varName = color.name.toLowerCase().replace(/\s+/g, '-');
                    code += `  --color-${varName}: ${color.hex};\n`;
                    code += `  --color-${varName}-rgb: ${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b};\n`;
                });
                code += '}\n';
                break;
                
            case 'scss':
                code = `/* SCSS Variables for ${paletteName.value} */\n`;
                currentPalette.forEach((color, index) => {
                    const varName = color.name.toLowerCase().replace(/\s+/g, '-');
                    code += `$${varName}: ${color.hex};\n`;
                    code += `$${varName}-rgb: ${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b};\n`;
                });
                break;
                
            case 'json':
                code = JSON.stringify({
                    name: paletteName.value,
                    colors: currentPalette.map(color => ({
                        name: color.name,
                        hex: color.hex,
                        rgb: color.rgb,
                        hsl: color.hsl
                    }))
                }, null, 2);
                break;
                
            case 'tailwind':
                code = `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        '${paletteName.value.toLowerCase().replace(/\s+/g, '-')}': {\n`;
                currentPalette.forEach((color, index) => {
                    const varName = color.name.toLowerCase().replace(/\s+/g, '-');
                    code += `          '${varName}': '${color.hex}',\n`;
                });
                code += `        }\n      }\n    }\n  }\n}\n`;
                break;
        }
        
        exportCode.innerHTML = `<code class="${format === 'json' ? 'json' : 'css'}">${escapeHtml(code)}</code>`;
    }
    
    // Utility Functions
    function isValidHex(hex) {
        return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }
    
    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        
        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('');
        }
        
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return { r, g, b };
    }
    
    function rgbToHex(r, g, b) {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }
        
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }
    
    function hslToRgb(h, s, l) {
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return [
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255)
        ];
    }
    
    function rgbToHsv(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const d = max - min;
        
        let h = 0;
        if (d !== 0) {
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        const s = max === 0 ? 0 : d / max;
        const v = max;
        
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            v: Math.round(v * 100)
        };
    }
    
    function rgbToCmyk(r, g, b) {
        if (r === 0 && g === 0 && b === 0) {
            return { c: 0, m: 0, y: 0, k: 100 };
        }
        
        const c = 1 - (r / 255);
        const m = 1 - (g / 255);
        const y = 1 - (b / 255);
        
        const k = Math.min(c, m, y);
        
        return {
            c: Math.round(((c - k) / (1 - k)) * 100),
            m: Math.round(((m - k) / (1 - k)) * 100),
            y: Math.round(((y - k) / (1 - k)) * 100),
            k: Math.round(k * 100)
        };
    }
    
    function calculateContrastRatio(rgb1, rgb2) {
        const luminance1 = calculateRelativeLuminance(rgb1);
        const luminance2 = calculateRelativeLuminance(rgb2);
        
        const lighter = Math.max(luminance1, luminance2);
        const darker = Math.min(luminance1, luminance2);
        
        return (lighter + 0.05) / (darker + 0.05);
    }
    
    function calculateRelativeLuminance(rgb) {
        const { r, g, b } = rgb;
        
        const rsrgb = r / 255;
        const gsrgb = g / 255;
        const bsrgb = b / 255;
        
        const rlinear = rsrgb <= 0.03928 ? rsrgb / 12.92 : Math.pow((rsrgb + 0.055) / 1.055, 2.4);
        const glinear = gsrgb <= 0.03928 ? gsrgb / 12.92 : Math.pow((gsrgb + 0.055) / 1.055, 2.4);
        const blinear = bsrgb <= 0.03928 ? bsrgb / 12.92 : Math.pow((bsrgb + 0.055) / 1.055, 2.4);
        
        return 0.2126 * rlinear + 0.7152 * glinear + 0.0722 * blinear;
    }
    
    function getContrastRating(ratio) {
        if (ratio >= 7) {
            return { class: 'rating-aaa', text: 'AAA' };
        } else if (ratio >= 4.5) {
            return { class: 'rating-aa', text: 'AA' };
        } else if (ratio >= 3) {
            return { class: 'rating-aa', text: 'AA Large' };
        } else {
            return { class: 'rating-fail', text: 'Fail' };
        }
    }
    
    function escapeHtml(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }
});
