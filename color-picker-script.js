// Advanced Color Picker Tool Script
document.addEventListener('DOMContentLoaded', function() {
    // Current color state
    let currentColor = {
        hex: '#8a2be2',
        rgb: { r: 138, g: 43, b: 226 },
        hsl: { h: 271, s: 76, l: 53 },
        hsv: { h: 271, s: 81, v: 89 },
        cmyk: { c: 39, m: 81, y: 0, k: 11 },
        alpha: 100
    };
    
    // Color history (max 24 colors)
    let colorHistory = JSON.parse(localStorage.getItem('auraTextColorHistory')) || [];
    
    // Canvas and zoom state
    let canvasZoom = 1;
    let isDragging = false;
    let currentImage = null;
    
    // DOM Elements
    const colorCanvas = document.getElementById('colorCanvas');
    const ctx = colorCanvas.getContext('2d');
    const currentColorEl = document.getElementById('currentColor');
    const huePicker = document.getElementById('huePicker');
    const saturationPicker = document.getElementById('saturationPicker');
    const lightnessPicker = document.getElementById('lightnessPicker');
    const alphaPicker = document.getElementById('alphaPicker');
    const hueValue = document.getElementById('hueValue');
    const saturationValue = document.getElementById('saturationValue');
    const lightnessValue = document.getElementById('lightnessValue');
    const alphaValue = document.getElementById('alphaValue');
    const colorHistoryEl = document.getElementById('colorHistory');
    const colorValuesEl = document.getElementById('colorValues');
    const formatButtons = document.querySelectorAll('.format-btn');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const resetZoomBtn = document.getElementById('resetZoom');
    const pickScreenColorBtn = document.getElementById('pickScreenColor');
    const uploadImageBtn = document.getElementById('uploadImage');
    const imageUpload = document.getElementById('imageUpload');
    const magnifier = document.getElementById('magnifier');
    const magnifierPreview = document.getElementById('magnifierPreview').getContext('2d');
    const colorPixel = document.getElementById('colorPixel');
    const clearHistoryBtn = document.getElementById('clearHistory');
    
    // Tool buttons
    const complementaryTool = document.getElementById('complementaryTool');
    const analogousTool = document.getElementById('analogousTool');
    const lighterTool = document.getElementById('lighterTool');
    const darkerTool = document.getElementById('darkerTool');
    const saturateTool = document.getElementById('saturateTool');
    const desaturateTool = document.getElementById('desaturateTool');
    const randomTool = document.getElementById('randomTool');
    const addToPaletteTool = document.getElementById('addToPaletteTool');
    
    // Initialize
    initCanvas();
    updateColorDisplay();
    updateHistoryDisplay();
    updateColorValues();
    drawColorCanvas();
    
    // Event Listeners
    huePicker.addEventListener('input', updateColorFromHSL);
    saturationPicker.addEventListener('input', updateColorFromHSL);
    lightnessPicker.addEventListener('input', updateColorFromHSL);
    alphaPicker.addEventListener('input', updateAlpha);
    
    // Format selection
    formatButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            formatButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateColorValues();
        });
    });
    
    // Zoom controls
    zoomInBtn.addEventListener('click', () => adjustZoom(1.2));
    zoomOutBtn.addEventListener('click', () => adjustZoom(0.8));
    resetZoomBtn.addEventListener('click', resetZoom);
    
    // Screen color picker
    pickScreenColorBtn.addEventListener('click', pickColorFromScreen);
    
    // Image upload
    uploadImageBtn.addEventListener('click', () => imageUpload.click());
    imageUpload.addEventListener('change', handleImageUpload);
    
    // Canvas interaction
    colorCanvas.addEventListener('mousedown', startDrag);
    colorCanvas.addEventListener('mousemove', handleMouseMove);
    colorCanvas.addEventListener('mouseup', endDrag);
    colorCanvas.addEventListener('click', pickColorFromCanvas);
    
    // Color history
    clearHistoryBtn.addEventListener('click', clearColorHistory);
    
    // Tool buttons
    complementaryTool.addEventListener('click', generateComplementary);
    analogousTool.addEventListener('click', generateAnalogous);
    lighterTool.addEventListener('click', makeLighter);
    darkerTool.addEventListener('click', makeDarker);
    saturateTool.addEventListener('click', makeSaturated);
    desaturateTool.addEventListener('click', makeDesaturated);
    randomTool.addEventListener('click', generateRandomColor);
    addToPaletteTool.addEventListener('click', saveToPalette);
    
    // Functions
    function initCanvas() {
        colorCanvas.width = colorCanvas.offsetWidth;
        colorCanvas.height = 300;
        drawColorCanvas();
    }
    
    function drawColorCanvas() {
        const width = colorCanvas.width;
        const height = colorCanvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        if (currentImage) {
            // Draw uploaded image
            const scale = Math.min(width / currentImage.width, height / currentImage.height);
            const x = (width - currentImage.width * scale) / 2;
            const y = (height - currentImage.height * scale) / 2;
            
            ctx.drawImage(currentImage, x, y, currentImage.width * scale, currentImage.height * scale);
        } else {
            // Draw gradient color canvas
            const gradient = ctx.createLinearGradient(0, 0, width, 0);
            
            // Create hue gradient
            for (let i = 0; i <= 360; i += 30) {
                const [r, g, b] = hslToRgb(i / 360, 1, 0.5);
                const color = `rgb(${r}, ${g}, ${b})`;
                const position = i / 360;
                gradient.addColorStop(position, color);
            }
            
            // Draw hue gradient
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height / 2);
            
            // Draw saturation/lightness grid
            for (let x = 0; x < width; x += 10) {
                for (let y = height / 2; y < height; y += 10) {
                    const hue = (x / width) * 360;
                    const saturation = 1 - (y - height / 2) / (height / 2);
                    const lightness = 0.5;
                    
                    const [r, g, b] = hslToRgb(hue / 360, saturation, lightness);
                    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                    ctx.fillRect(x, y, 10, 10);
                }
            }
            
            // Draw current color indicator
            const indicatorX = (currentColor.hsl.h / 360) * width;
            const indicatorY = height / 4;
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(indicatorX, indicatorY, 8, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(indicatorX, indicatorY, 6, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function updateColorFromHSL() {
        const h = parseInt(huePicker.value);
        const s = parseInt(saturationPicker.value);
        const l = parseInt(lightnessPicker.value);
        
        currentColor.hsl = { h, s, l };
        
        // Convert to RGB
        const rgb = hslToRgb(h / 360, s / 100, l / 100);
        currentColor.rgb = { r: rgb[0], g: rgb[1], b: rgb[2] };
        
        // Update other values
        currentColor.hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
        currentColor.hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
        currentColor.cmyk = rgbToCmyk(rgb[0], rgb[1], rgb[2]);
        
        updateColorDisplay();
        drawColorCanvas();
    }
    
    function updateAlpha() {
        const alpha = parseInt(alphaPicker.value);
        currentColor.alpha = alpha;
        alphaValue.textContent = `${alpha}%`;
        updateColorValues();
    }
    
    function updateColorDisplay() {
        // Update current color preview
        currentColorEl.style.backgroundColor = currentColor.hex;
        
        // Update slider values
        huePicker.value = Math.round(currentColor.hsl.h);
        saturationPicker.value = Math.round(currentColor.hsl.s);
        lightnessPicker.value = Math.round(currentColor.hsl.l);
        
        hueValue.textContent = `${Math.round(currentColor.hsl.h)}°`;
        saturationValue.textContent = `${Math.round(currentColor.hsl.s)}%`;
        lightnessValue.textContent = `${Math.round(currentColor.hsl.l)}%`;
        
        // Update color values display
        updateColorValues();
        
        // Add to history
        addToHistory(currentColor.hex);
    }
    
    function updateColorValues() {
        const activeFormat = document.querySelector('.format-btn.active').dataset.format;
        colorValuesEl.innerHTML = '';
        
        const formats = [
            {
                name: 'HEX',
                icon: 'fas fa-hashtag',
                value: currentColor.hex.toUpperCase(),
                copyValue: currentColor.hex.toUpperCase()
            },
            {
                name: 'RGB',
                icon: 'fas fa-r',
                value: `rgb(${currentColor.rgb.r}, ${currentColor.rgb.g}, ${currentColor.rgb.b})`,
                copyValue: `rgb(${currentColor.rgb.r}, ${currentColor.rgb.g}, ${currentColor.rgb.b})`
            },
            {
                name: 'HSL',
                icon: 'fas fa-sliders-h',
                value: `hsl(${Math.round(currentColor.hsl.h)}, ${Math.round(currentColor.hsl.s)}%, ${Math.round(currentColor.hsl.l)}%)`,
                copyValue: `hsl(${Math.round(currentColor.hsl.h)}, ${Math.round(currentColor.hsl.s)}%, ${Math.round(currentColor.hsl.l)}%)`
            },
            {
                name: 'HSV',
                icon: 'fas fa-v',
                value: `hsv(${Math.round(currentColor.hsv.h)}°, ${Math.round(currentColor.hsv.s)}%, ${Math.round(currentColor.hsv.v)}%)`,
                copyValue: `hsv(${Math.round(currentColor.hsv.h)}, ${Math.round(currentColor.hsv.s)}, ${Math.round(currentColor.hsv.v)})`
            },
            {
                name: 'CMYK',
                icon: 'fas fa-c',
                value: `cmyk(${Math.round(currentColor.cmyk.c)}%, ${Math.round(currentColor.cmyk.m)}%, ${Math.round(currentColor.cmyk.y)}%, ${Math.round(currentColor.cmyk.k)}%)`,
                copyValue: `cmyk(${Math.round(currentColor.cmyk.c)}%, ${Math.round(currentColor.cmyk.m)}%, ${Math.round(currentColor.cmyk.y)}%, ${Math.round(currentColor.cmyk.k)}%)`
            },
            {
                name: 'RGBA',
                icon: 'fas fa-r',
                value: `rgba(${currentColor.rgb.r}, ${currentColor.rgb.g}, ${currentColor.rgb.b}, ${(currentColor.alpha / 100).toFixed(2)})`,
                copyValue: `rgba(${currentColor.rgb.r}, ${currentColor.rgb.g}, ${currentColor.rgb.b}, ${(currentColor.alpha / 100).toFixed(2)})`
            },
            {
                name: 'HSLA',
                icon: 'fas fa-sliders-h',
                value: `hsla(${Math.round(currentColor.hsl.h)}, ${Math.round(currentColor.hsl.s)}%, ${Math.round(currentColor.hsl.l)}%, ${(currentColor.alpha / 100).toFixed(2)})`,
                copyValue: `hsla(${Math.round(currentColor.hsl.h)}, ${Math.round(currentColor.hsl.s)}%, ${Math.round(currentColor.hsl.l)}%, ${(currentColor.alpha / 100).toFixed(2)})`
            }
        ];
        
        // Show only selected format
        const formatToShow = formats.find(f => f.name.toLowerCase() === activeFormat) || formats[0];
        
        const valueCard = document.createElement('div');
        valueCard.className = 'value-card';
        
        valueCard.innerHTML = `
            <div class="value-header">
                <div class="value-title">
                    <i class="${formatToShow.icon}"></i>
                    <span>${formatToShow.name}</span>
                </div>
                <button class="copy-value-btn" title="Copy ${formatToShow.name} value">
                    <i class="far fa-copy"></i>
                </button>
            </div>
            <div class="value-content">${formatToShow.value}</div>
        `;
        
        // Add copy functionality
        const copyBtn = valueCard.querySelector('.copy-value-btn');
        copyBtn.addEventListener('click', function() {
            navigator.clipboard.writeText(formatToShow.copyValue).then(() => {
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                this.style.color = '#27ae60';
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.color = '';
                }, 2000);
            });
        });
        
        colorValuesEl.appendChild(valueCard);
    }
    
    function addToHistory(colorHex) {
        // Remove if already exists
        colorHistory = colorHistory.filter(c => c !== colorHex);
        
        // Add to beginning
        colorHistory.unshift(colorHex);
        
        // Keep only last 24 colors
        if (colorHistory.length > 24) {
            colorHistory = colorHistory.slice(0, 24);
        }
        
        // Save to localStorage
        localStorage.setItem('auraTextColorHistory', JSON.stringify(colorHistory));
        
        // Update display
        updateHistoryDisplay();
    }
    
    function updateHistoryDisplay() {
        colorHistoryEl.innerHTML = '';
        
        colorHistory.forEach(colorHex => {
            const historyColor = document.createElement('div');
            historyColor.className = 'history-color';
            historyColor.style.backgroundColor = colorHex;
            historyColor.title = colorHex;
            
            historyColor.addEventListener('click', function() {
                // Set this as current color
                const rgb = hexToRgb(colorHex);
                updateColorFromRGB(rgb.r, rgb.g, rgb.b);
                
                // Add visual feedback
                this.style.transform = 'scale(1.2)';
                this.style.boxShadow = '0 0 20px rgba(138, 43, 226, 0.8)';
                
                setTimeout(() => {
                    this.style.transform = '';
                    this.style.boxShadow = '';
                }, 500);
            });
            
            colorHistoryEl.appendChild(historyColor);
        });
    }
    
    function clearColorHistory() {
        if (confirm('Are you sure you want to clear all color history?')) {
            colorHistory = [];
            localStorage.removeItem('auraTextColorHistory');
            updateHistoryDisplay();
        }
    }
    
    function adjustZoom(factor) {
        canvasZoom *= factor;
        canvasZoom = Math.max(0.5, Math.min(5, canvasZoom));
        
        // Update canvas display
        colorCanvas.style.transform = `scale(${canvasZoom})`;
        colorCanvas.style.transformOrigin = 'center center';
    }
    
    function resetZoom() {
        canvasZoom = 1;
        colorCanvas.style.transform = 'scale(1)';
    }
    
    function pickColorFromScreen() {
        if (typeof EyeDropper !== 'undefined') {
            const eyeDropper = new EyeDropper();
            
            pickScreenColorBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Picking...';
            pickScreenColorBtn.disabled = true;
            
            eyeDropper.open()
                .then(result => {
                    updateColorFromHex(result.sRGBHex);
                    pickScreenColorBtn.innerHTML = '<i class="fas fa-desktop"></i> Pick from Screen';
                    pickScreenColorBtn.disabled = false;
                })
                .catch(e => {
                    console.log('EyeDropper cancelled or not supported:', e);
                    pickScreenColorBtn.innerHTML = '<i class="fas fa-desktop"></i> Pick from Screen';
                    pickScreenColorBtn.disabled = false;
                    
                    if (e.toString().includes('AbortError')) {
                        // User cancelled, do nothing
                    } else {
                        alert('Screen color picker not supported in your browser. Try Chrome or Edge 98+.');
                    }
                });
        } else {
            alert('Screen color picker not supported in your browser. Try Chrome or Edge 98+.');
        }
    }
    
    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                currentImage = img;
                drawColorCanvas();
                
                // Reset zoom
                resetZoom();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
        
        // Reset file input
        event.target.value = '';
    }
    
    function startDrag(e) {
        isDragging = true;
        pickColorFromCanvas(e);
    }
    
    function handleMouseMove(e) {
        if (!isDragging) {
            // Show magnifier
            const rect = colorCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Only show magnifier if mouse is over canvas
            if (x >= 0 && x <= colorCanvas.width && y >= 0 && y <= colorCanvas.height) {
                showMagnifier(x, y);
            } else {
                magnifier.style.display = 'none';
                colorPixel.style.display = 'none';
            }
        }
    }
    
    function endDrag() {
        isDragging = false;
    }
    
    function pickColorFromCanvas(e) {
        const rect = colorCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Adjust for zoom
        const adjustedX = x / canvasZoom;
        const adjustedY = y / canvasZoom;
        
        // Get pixel color
        const pixel = ctx.getImageData(adjustedX, adjustedY, 1, 1).data;
        
        if (pixel[3] > 0) { // Check alpha channel
            updateColorFromRGB(pixel[0], pixel[1], pixel[2]);
            
            // Show pixel indicator
            colorPixel.style.left = `${x - 1.5}px`;
            colorPixel.style.top = `${y - 1.5}px`;
            colorPixel.style.display = 'block';
            
            setTimeout(() => {
                colorPixel.style.display = 'none';
            }, 1000);
        }
    }
    
    function showMagnifier(x, y) {
        const rect = colorCanvas.getBoundingClientRect();
        const canvasX = x - rect.left;
        const canvasY = y - rect.top;
        
        // Adjust for zoom
        const adjustedX = canvasX / canvasZoom;
        const adjustedY = canvasY / canvasZoom;
        
        // Get magnified area
        const magnifierSize = 120;
        const zoomLevel = 8;
        const sourceSize = magnifierSize / zoomLevel;
        
        magnifierPreview.clearRect(0, 0, magnifierSize, magnifierSize);
        
        // Draw magnified view
        magnifierPreview.drawImage(
            colorCanvas,
            adjustedX - sourceSize / 2,
            adjustedY - sourceSize / 2,
            sourceSize,
            sourceSize,
            0,
            0,
            magnifierSize,
            magnifierSize
        );
        
        // Draw crosshair
        magnifierPreview.strokeStyle = '#8a2be2';
        magnifierPreview.lineWidth = 2;
        
        // Vertical line
        magnifierPreview.beginPath();
        magnifierPreview.moveTo(magnifierSize / 2, 0);
        magnifierPreview.lineTo(magnifierSize / 2, magnifierSize);
        magnifierPreview.stroke();
        
        // Horizontal line
        magnifierPreview.beginPath();
        magnifierPreview.moveTo(0, magnifierSize / 2);
        magnifierPreview.lineTo(magnifierSize, magnifierSize / 2);
        magnifierPreview.stroke();
        
        // Draw circle around crosshair
        magnifierPreview.beginPath();
        magnifierPreview.arc(magnifierSize / 2, magnifierSize / 2, 10, 0, Math.PI * 2);
        magnifierPreview.stroke();
        
        // Position magnifier
        magnifier.style.left = `${x - magnifierSize / 2}px`;
        magnifier.style.top = `${y - magnifierSize / 2}px`;
        magnifier.style.display = 'block';
    }
    
    function updateColorFromHex(hex) {
        hex = hex.startsWith('#') ? hex : '#' + hex;
        const rgb = hexToRgb(hex);
        updateColorFromRGB(rgb.r, rgb.g, rgb.b);
    }
    
    function updateColorFromRGB(r, g, b) {
        currentColor.rgb = { r, g, b };
        currentColor.hex = rgbToHex(r, g, b);
        
        const hsl = rgbToHsl(r, g, b);
        currentColor.hsl = hsl;
        currentColor.hsv = rgbToHsv(r, g, b);
        currentColor.cmyk = rgbToCmyk(r, g, b);
        
        updateColorDisplay();
        drawColorCanvas();
    }
    
    function generateComplementary() {
        const newHue = (currentColor.hsl.h + 180) % 360;
        updateColorFromHSLValues(newHue, currentColor.hsl.s, currentColor.hsl.l);
    }
    
    function generateAnalogous() {
        const newHue = (currentColor.hsl.h + 30) % 360;
        updateColorFromHSLValues(newHue, currentColor.hsl.s, currentColor.hsl.l);
    }
    
    function makeLighter() {
        const newLightness = Math.min(100, currentColor.hsl.l + 10);
        updateColorFromHSLValues(currentColor.hsl.h, currentColor.hsl.s, newLightness);
    }
    
    function makeDarker() {
        const newLightness = Math.max(0, currentColor.hsl.l - 10);
        updateColorFromHSLValues(currentColor.hsl.h, currentColor.hsl.s, newLightness);
    }
    
    function makeSaturated() {
        const newSaturation = Math.min(100, currentColor.hsl.s + 10);
        updateColorFromHSLValues(currentColor.hsl.h, newSaturation, currentColor.hsl.l);
    }
    
    function makeDesaturated() {
        const newSaturation = Math.max(0, currentColor.hsl.s - 10);
        updateColorFromHSLValues(currentColor.hsl.h, newSaturation, currentColor.hsl.l);
    }
    
    function generateRandomColor() {
        const h = Math.floor(Math.random() * 360);
        const s = Math.floor(Math.random() * 30) + 50;
        const l = Math.floor(Math.random() * 30) + 35;
        
        updateColorFromHSLValues(h, s, l);
    }
    
    function saveToPalette() {
        // Save current color to localStorage for Palette Generator
        const paletteColors = JSON.parse(localStorage.getItem('auraTextPaletteColors')) || [];
        paletteColors.unshift({
            hex: currentColor.hex,
            name: `Picked ${new Date().toLocaleTimeString()}`,
            rgb: currentColor.rgb,
            hsl: currentColor.hsl
        });
        
        // Keep only last 20
        if (paletteColors.length > 20) {
            paletteColors.pop();
        }
        
        localStorage.setItem('auraTextPaletteColors', JSON.stringify(paletteColors));
        
        // Show success message
        const originalHTML = addToPaletteTool.innerHTML;
        addToPaletteTool.innerHTML = '<i class="fas fa-check"></i> Saved!';
        addToPaletteTool.style.background = 'rgba(39, 174, 96, 0.2)';
        addToPaletteTool.style.borderColor = '#27ae60';
        
        setTimeout(() => {
            addToPaletteTool.innerHTML = originalHTML;
            addToPaletteTool.style.background = '';
            addToPaletteTool.style.borderColor = '';
        }, 2000);
    }
    
    function updateColorFromHSLValues(h, s, l) {
        currentColor.hsl = { h, s, l };
        
        const rgb = hslToRgb(h / 360, s / 100, l / 100);
        updateColorFromRGB(rgb[0], rgb[1], rgb[2]);
    }
    
    // Utility Functions
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
            h = s = 0;
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
            r = g = b = l;
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
});
