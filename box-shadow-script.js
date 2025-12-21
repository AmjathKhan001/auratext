// Box Shadow Generator Script
document.addEventListener('DOMContentLoaded', function() {
    // Default layer configuration
    let layers = [
        {
            id: 1,
            active: true,
            offsetX: 10,
            offsetY: 10,
            blur: 20,
            spread: 0,
            color: 'rgba(0, 0, 0, 0.3)',
            inset: false
        }
    ];

    let currentLayerId = 1;

    // DOM Elements
    const layersContainer = document.getElementById('layersContainer');
    const addLayerBtn = document.getElementById('addLayer');
    const resetAllBtn = document.getElementById('resetAll');
    const cssOutput = document.getElementById('cssOutput');
    const copyBtn = document.getElementById('copyCode');
    const shadowPreview = document.getElementById('shadowPreview');
    const previewBg = document.getElementById('previewBg');
    const previewShape = document.getElementById('previewShape');
    const presetButtons = document.querySelectorAll('.preset-btn');

    // Initialize
    renderLayers();
    updatePreview();
    updateCssOutput();

    // Add new layer
    addLayerBtn.addEventListener('click', function() {
        currentLayerId++;
        layers.push({
            id: currentLayerId,
            active: true,
            offsetX: 0,
            offsetY: 0,
            blur: 10,
            spread: 0,
            color: 'rgba(0, 0, 0, 0.2)',
            inset: false
        });
        renderLayers();
        updatePreview();
        updateCssOutput();
    });

    // Reset all layers
    resetAllBtn.addEventListener('click', function() {
        layers = [{
            id: 1,
            active: true,
            offsetX: 10,
            offsetY: 10,
            blur: 20,
            spread: 0,
            color: 'rgba(0, 0, 0, 0.3)',
            inset: false
        }];
        currentLayerId = 1;
        renderLayers();
        updatePreview();
        updateCssOutput();
    });

    // Copy CSS code
    copyBtn.addEventListener('click', function() {
        const cssCode = cssOutput.textContent;
        navigator.clipboard.writeText(cssCode).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.classList.add('success');
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.classList.remove('success');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard');
        });
    });

    // Preview background change
    previewBg.addEventListener('change', function() {
        const previewContainer = document.querySelector('.preview-container');
        const previewBox = document.querySelector('.preview-box');
        
        switch(this.value) {
            case '#0f0c29':
                previewContainer.style.background = '#0f0c29';
                previewBox.style.background = 'linear-gradient(145deg, #302b63, #242043)';
                break;
            case '#ffffff':
                previewContainer.style.background = '#ffffff';
                previewBox.style.background = 'linear-gradient(145deg, #f0f0f0, #e0e0e0)';
                previewBox.style.color = '#333';
                break;
            case '#302b63':
                previewContainer.style.background = '#302b63';
                previewBox.style.background = 'linear-gradient(145deg, #4038a0, #302b63)';
                break;
            case 'gradient':
                previewContainer.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                previewBox.style.background = 'linear-gradient(145deg, #302b63, #242043)';
                previewBox.style.color = '#fff';
                break;
        }
    });

    // Preview shape change
    previewShape.addEventListener('change', function() {
        shadowPreview.className = 'preview-box';
        shadowPreview.classList.add(this.value);
    });

    // Preset buttons
    presetButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const preset = this.dataset.preset;
            applyPreset(preset);
        });
    });

    // Render layers
    function renderLayers() {
        layersContainer.innerHTML = '';
        
        layers.forEach(layer => {
            const layerElement = document.createElement('div');
            layerElement.className = `layer-item ${layer.active ? 'active' : ''}`;
            layerElement.dataset.layerId = layer.id;
            
            const [r, g, b, a] = parseColor(layer.color);
            
            layerElement.innerHTML = `
                <div class="layer-header">
                    <div class="layer-title">
                        <i class="fas fa-layer-group"></i>
                        <span>Layer ${layer.id}</span>
                    </div>
                    <div class="layer-actions">
                        <button class="layer-btn toggle-layer" title="${layer.active ? 'Disable' : 'Enable'} layer">
                            <i class="fas fa-power-off"></i>
                        </button>
                        <button class="layer-btn delete-layer" title="Delete layer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="layer-controls">
                    <div class="control-group">
                        <label>
                            <span>Offset X</span>
                            <span class="control-value" id="offsetXValue-${layer.id}">${layer.offsetX}px</span>
                        </label>
                        <input type="range" class="range-slider offset-x" min="-100" max="100" value="${layer.offsetX}"
                               data-layer="${layer.id}">
                    </div>
                    <div class="control-group">
                        <label>
                            <span>Offset Y</span>
                            <span class="control-value" id="offsetYValue-${layer.id}">${layer.offsetY}px</span>
                        </label>
                        <input type="range" class="range-slider offset-y" min="-100" max="100" value="${layer.offsetY}"
                               data-layer="${layer.id}">
                    </div>
                    <div class="control-group">
                        <label>
                            <span>Blur Radius</span>
                            <span class="control-value" id="blurValue-${layer.id}">${layer.blur}px</span>
                        </label>
                        <input type="range" class="range-slider blur" min="0" max="100" value="${layer.blur}"
                               data-layer="${layer.id}">
                    </div>
                    <div class="control-group">
                        <label>
                            <span>Spread</span>
                            <span class="control-value" id="spreadValue-${layer.id}">${layer.spread}px</span>
                        </label>
                        <input type="range" class="range-slider spread" min="-50" max="50" value="${layer.spread}"
                               data-layer="${layer.id}">
                    </div>
                    <div class="control-group">
                        <label>
                            <span>Color</span>
                            <span class="control-value" id="colorValue-${layer.id}">${layer.color}</span>
                        </label>
                        <div class="color-input-group">
                            <input type="color" class="color-input color-hex" value="${rgbToHex(r, g, b)}"
                                   data-layer="${layer.id}">
                            <input type="range" class="range-slider color-alpha" min="0" max="100" value="${Math.round(a * 100)}"
                                   data-layer="${layer.id}">
                            <div class="color-preview" style="background-color: ${layer.color}" 
                                 data-layer="${layer.id}"></div>
                        </div>
                    </div>
                    <div class="control-group">
                        <label>
                            <span>Inset Shadow</span>
                            <label class="toggle-switch">
                                <input type="checkbox" class="inset-toggle" ${layer.inset ? 'checked' : ''}
                                       data-layer="${layer.id}">
                                <span class="toggle-slider"></span>
                            </label>
                        </label>
                    </div>
                </div>
            `;
            
            layersContainer.appendChild(layerElement);
        });
        
        attachLayerEvents();
    }

    // Attach events to layer controls
    function attachLayerEvents() {
        // Range sliders
        document.querySelectorAll('.range-slider').forEach(slider => {
            slider.addEventListener('input', function() {
                const layerId = parseInt(this.dataset.layer);
                const type = this.classList[1];
                const value = parseInt(this.value);
                
                updateLayerProperty(layerId, type, value);
            });
        });

        // Color hex input
        document.querySelectorAll('.color-hex').forEach(input => {
            input.addEventListener('input', function() {
                const layerId = parseInt(this.dataset.layer);
                const alphaSlider = document.querySelector(`.color-alpha[data-layer="${layerId}"]`);
                const alpha = parseInt(alphaSlider.value) / 100;
                
                const hex = this.value;
                const rgb = hexToRgb(hex);
                const newColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
                
                updateLayerProperty(layerId, 'color', newColor);
            });
        });

        // Color alpha slider
        document.querySelectorAll('.color-alpha').forEach(slider => {
            slider.addEventListener('input', function() {
                const layerId = parseInt(this.dataset.layer);
                const colorInput = document.querySelector(`.color-hex[data-layer="${layerId}"]`);
                const hex = colorInput.value;
                const rgb = hexToRgb(hex);
                const alpha = parseInt(this.value) / 100;
                const newColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
                
                updateLayerProperty(layerId, 'color', newColor);
            });
        });

        // Inset toggle
        document.querySelectorAll('.inset-toggle').forEach(toggle => {
            toggle.addEventListener('change', function() {
                const layerId = parseInt(this.dataset.layer);
                updateLayerProperty(layerId, 'inset', this.checked);
            });
        });

        // Toggle layer
        document.querySelectorAll('.toggle-layer').forEach(btn => {
            btn.addEventListener('click', function() {
                const layerElement = this.closest('.layer-item');
                const layerId = parseInt(layerElement.dataset.layerId);
                const layer = layers.find(l => l.id === layerId);
                
                layer.active = !layer.active;
                layerElement.classList.toggle('active');
                
                updatePreview();
                updateCssOutput();
            });
        });

        // Delete layer
        document.querySelectorAll('.delete-layer').forEach(btn => {
            btn.addEventListener('click', function() {
                if (layers.length <= 1) {
                    alert('You must have at least one layer');
                    return;
                }
                
                const layerElement = this.closest('.layer-item');
                const layerId = parseInt(layerElement.dataset.layerId);
                
                layers = layers.filter(l => l.id !== layerId);
                renderLayers();
                updatePreview();
                updateCssOutput();
            });
        });
    }

    // Update layer property
    function updateLayerProperty(layerId, property, value) {
        const layer = layers.find(l => l.id === layerId);
        if (!layer) return;
        
        layer[property] = value;
        
        // Update displayed value
        if (property !== 'color' && property !== 'inset') {
            document.getElementById(`${property}Value-${layerId}`).textContent = `${value}px`;
        }
        
        if (property === 'color') {
            document.getElementById(`colorValue-${layerId}`).textContent = value;
            const preview = document.querySelector(`.color-preview[data-layer="${layerId}"]`);
            preview.style.backgroundColor = value;
        }
        
        updatePreview();
        updateCssOutput();
    }

    // Update preview box
    function updatePreview() {
        const activeLayers = layers.filter(l => l.active);
        if (activeLayers.length === 0) {
            shadowPreview.style.boxShadow = 'none';
            return;
        }
        
        const shadowValue = activeLayers.map(layer => {
            const inset = layer.inset ? 'inset ' : '';
            return `${inset}${layer.offsetX}px ${layer.offsetY}px ${layer.blur}px ${layer.spread}px ${layer.color}`;
        }).join(', ');
        
        shadowPreview.style.boxShadow = shadowValue;
    }

    // Update CSS output
    function updateCssOutput() {
        const activeLayers = layers.filter(l => l.active);
        if (activeLayers.length === 0) {
            cssOutput.innerHTML = '<code class="css">box-shadow: none;</code>';
            return;
        }
        
        const shadowValue = activeLayers.map(layer => {
            const inset = layer.inset ? 'inset ' : '';
            return `${inset}${layer.offsetX}px ${layer.offsetY}px ${layer.blur}px ${layer.spread}px ${layer.color}`;
        }).join(', ');
        
        cssOutput.innerHTML = `<code class="css">box-shadow: ${shadowValue};</code>`;
    }

    // Apply preset
    function applyPreset(preset) {
        switch(preset) {
            case 'soft':
                layers = [{
                    id: 1,
                    active: true,
                    offsetX: 5,
                    offsetY: 5,
                    blur: 15,
                    spread: 0,
                    color: 'rgba(0, 0, 0, 0.1)',
                    inset: false
                }];
                break;
                
            case 'neomorphic':
                layers = [
                    {
                        id: 1,
                        active: true,
                        offsetX: 10,
                        offsetY: 10,
                        blur: 20,
                        spread: 0,
                        color: 'rgba(0, 0, 0, 0.2)',
                        inset: false
                    },
                    {
                        id: 2,
                        active: true,
                        offsetX: -5,
                        offsetY: -5,
                        blur: 20,
                        spread: 0,
                        color: 'rgba(255, 255, 255, 0.1)',
                        inset: false
                    }
                ];
                break;
                
            case 'floating':
                layers = [{
                    id: 1,
                    active: true,
                    offsetX: 0,
                    offsetY: 20,
                    blur: 40,
                    spread: -10,
                    color: 'rgba(138, 43, 226, 0.3)',
                    inset: false
                }];
                break;
                
            case 'inset':
                layers = [{
                    id: 1,
                    active: true,
                    offsetX: 5,
                    offsetY: 5,
                    blur: 15,
                    spread: 0,
                    color: 'rgba(0, 0, 0, 0.2)',
                    inset: true
                }];
                break;
                
            case 'multiple':
                layers = [
                    {
                        id: 1,
                        active: true,
                        offsetX: 2,
                        offsetY: 2,
                        blur: 5,
                        spread: 0,
                        color: 'rgba(0, 0, 0, 0.1)',
                        inset: false
                    },
                    {
                        id: 2,
                        active: true,
                        offsetX: 5,
                        offsetY: 5,
                        blur: 10,
                        spread: 0,
                        color: 'rgba(0, 0, 0, 0.07)',
                        inset: false
                    },
                    {
                        id: 3,
                        active: true,
                        offsetX: 10,
                        offsetY: 10,
                        blur: 20,
                        spread: 0,
                        color: 'rgba(0, 0, 0, 0.05)',
                        inset: false
                    }
                ];
                break;
                
            case 'glow':
                layers = [{
                    id: 1,
                    active: true,
                    offsetX: 0,
                    offsetY: 0,
                    blur: 30,
                    spread: 0,
                    color: 'rgba(138, 43, 226, 0.5)',
                    inset: false
                }];
                break;
        }
        
        currentLayerId = layers.length;
        renderLayers();
        updatePreview();
        updateCssOutput();
    }

    // Helper functions for color conversion
    function parseColor(rgba) {
        const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (match) {
            return [
                parseInt(match[1]),
                parseInt(match[2]),
                parseInt(match[3]),
                match[4] ? parseFloat(match[4]) : 1
            ];
        }
        return [0, 0, 0, 1];
    }

    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : {r: 0, g: 0, b: 0};
    }
});
