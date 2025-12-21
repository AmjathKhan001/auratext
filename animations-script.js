// CSS Animations Generator Script
document.addEventListener('DOMContentLoaded', function() {
    // Animation configuration
    let animationConfig = {
        name: 'myAnimation',
        duration: 2,
        delay: 0,
        iterationCount: 1,
        direction: 'normal',
        fillMode: 'none',
        playState: 'running',
        timingFunction: 'ease',
        cubicBezier: '0.42, 0, 0.58, 1',
        properties: {
            transform: {
                enabled: true,
                keyframes: [
                    { time: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'ease' },
                    { time: 100, translateX: 0, translateY: 0, scale: 1, rotate: 360, skewX: 0, skewY: 0, easing: 'ease' }
                ]
            },
            opacity: {
                enabled: true,
                keyframes: [
                    { time: 0, value: 1, easing: 'linear' },
                    { time: 100, value: 1, easing: 'linear' }
                ]
            },
            backgroundColor: {
                enabled: false,
                keyframes: [
                    { time: 0, value: '#8a2be2', easing: 'linear' },
                    { time: 100, value: '#4a00e0', easing: 'linear' }
                ]
            }
        }
    };

    // DOM Elements
    const animationName = document.getElementById('animationName');
    const animationDuration = document.getElementById('animationDuration');
    const animationDelay = document.getElementById('animationDelay');
    const animationIteration = document.getElementById('animationIteration');
    const animationDirection = document.getElementById('animationDirection');
    const animationFillMode = document.getElementById('animationFillMode');
    const animationPlayState = document.getElementById('animationPlayState');
    const animationTiming = document.getElementById('animationTiming');
    const cubicBezier = document.getElementById('cubicBezier');
    const toggleAdvanced = document.getElementById('toggleAdvanced');
    const advancedSettings = document.getElementById('advancedSettings');
    const propertyControls = document.getElementById('propertyControls');
    const previewElement = document.getElementById('previewElement');
    const playPauseBtn = document.getElementById('playPause');
    const stopBtn = document.getElementById('stopBtn');
    const restartBtn = document.getElementById('restartBtn');
    const speedBtns = document.querySelectorAll('.speed-btn');
    const previewObjects = document.querySelectorAll('.preview-object');
    const presetButtons = document.querySelectorAll('.animation-preset');
    const newAnimationBtn = document.getElementById('newAnimation');
    const resetAnimationBtn = document.getElementById('resetAnimation');
    const timelineProgress = document.getElementById('timelineProgress');
    const curveCanvas = document.getElementById('curveCanvas');
    const codeTabs = document.querySelectorAll('.code-tab');
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    // Output elements
    const keyframesOutput = document.getElementById('keyframesOutput');
    const animationOutput = document.getElementById('animationOutput');
    const completeOutput = document.getElementById('completeOutput');
    
    // Animation state
    let isPlaying = false;
    let animationSpeed = 1;
    let currentPreviewObject = 'box';
    let animationInstance = null;
    
    // Initialize
    initializePropertyControls();
    updateAnimationSettings();
    updatePreviewElement();
    updateCodeOutput();
    drawEasingCurve();
    
    // Event Listeners
    animationName.addEventListener('input', updateAnimationSettings);
    animationDuration.addEventListener('input', updateAnimationSettings);
    animationDelay.addEventListener('input', updateAnimationSettings);
    animationIteration.addEventListener('change', updateAnimationSettings);
    animationDirection.addEventListener('change', updateAnimationSettings);
    animationFillMode.addEventListener('change', updateAnimationSettings);
    animationPlayState.addEventListener('change', updateAnimationSettings);
    animationTiming.addEventListener('change', updateAnimationSettings);
    cubicBezier.addEventListener('input', updateAnimationSettings);
    
    toggleAdvanced.addEventListener('click', function() {
        advancedSettings.classList.toggle('show');
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-chevron-down');
        icon.classList.toggle('fa-chevron-up');
    });
    
    animationTiming.addEventListener('change', function() {
        cubicBezier.disabled = this.value !== 'cubic-bezier';
    });
    
    // Playback Controls
    playPauseBtn.addEventListener('click', togglePlayPause);
    stopBtn.addEventListener('click', stopAnimation);
    restartBtn.addEventListener('click', restartAnimation);
    
    speedBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            speedBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            animationSpeed = parseFloat(this.dataset.speed);
            updateAnimationSpeed();
        });
    });
    
    // Preview Objects
    previewObjects.forEach(obj => {
        obj.addEventListener('click', function() {
            previewObjects.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            currentPreviewObject = this.dataset.object;
            updatePreviewElement();
        });
    });
    
    // Presets
    presetButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const preset = this.dataset.preset;
            applyPreset(preset);
        });
    });
    
    // New Animation
    newAnimationBtn.addEventListener('click', function() {
        animationConfig.name = `animation${Math.floor(Math.random() * 1000)}`;
        animationConfig.duration = 2;
        animationConfig.delay = 0;
        animationConfig.iterationCount = 1;
        animationConfig.direction = 'normal';
        animationConfig.fillMode = 'none';
        animationConfig.timingFunction = 'ease';
        
        // Reset properties
        Object.keys(animationConfig.properties).forEach(key => {
            animationConfig.properties[key].enabled = key === 'transform' || key === 'opacity';
            if (key === 'transform') {
                animationConfig.properties[key].keyframes = [
                    { time: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'ease' },
                    { time: 100, translateX: 0, translateY: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'ease' }
                ];
            } else if (key === 'opacity') {
                animationConfig.properties[key].keyframes = [
                    { time: 0, value: 1, easing: 'linear' },
                    { time: 100, value: 1, easing: 'linear' }
                ];
            }
        });
        
        updateUIFromConfig();
        updatePreviewElement();
        updateCodeOutput();
        drawEasingCurve();
    });
    
    // Reset Animation
    resetAnimationBtn.addEventListener('click', function() {
        animationConfig = {
            name: 'myAnimation',
            duration: 2,
            delay: 0,
            iterationCount: 1,
            direction: 'normal',
            fillMode: 'none',
            playState: 'running',
            timingFunction: 'ease',
            cubicBezier: '0.42, 0, 0.58, 1',
            properties: {
                transform: {
                    enabled: true,
                    keyframes: [
                        { time: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'ease' },
                        { time: 100, translateX: 0, translateY: 0, scale: 1, rotate: 360, easing: 'ease' }
                    ]
                },
                opacity: {
                    enabled: true,
                    keyframes: [
                        { time: 0, value: 1, easing: 'linear' },
                        { time: 100, value: 1, easing: 'linear' }
                    ]
                }
            }
        };
        
        updateUIFromConfig();
        updatePreviewElement();
        updateCodeOutput();
        drawEasingCurve();
    });
    
    // Code Tabs
    codeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            codeTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.code-content').forEach(content => {
                content.classList.remove('active');
            });
            
            document.getElementById(`${tabId}Code`).classList.add('active');
        });
    });
    
    // Copy Buttons
    copyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const targetElement = document.getElementById(targetId);
            const text = targetElement.textContent;
            
            navigator.clipboard.writeText(text).then(() => {
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                this.classList.add('success');
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.classList.remove('success');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy to clipboard');
            });
        });
    });
    
    // Functions
    function initializePropertyControls() {
        propertyControls.innerHTML = '';
        
        Object.entries(animationConfig.properties).forEach(([property, config]) => {
            const propertyGroup = document.createElement('div');
            propertyGroup.className = 'property-group';
            propertyGroup.dataset.property = property;
            
            let propertyContent = '';
            
            if (property === 'transform') {
                propertyContent = `
                    <div class="property-header">
                        <div class="property-name">
                            <i class="fas fa-arrows-alt"></i>
                            <span>Transform</span>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" class="property-toggle" ${config.enabled ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="keyframe-list" id="transformKeyframes">
                        ${config.keyframes.map((kf, index) => `
                            <div class="keyframe-item" data-index="${index}">
                                <div class="keyframe-header">
                                    <span class="keyframe-time">${kf.time}%</span>
                                    <button class="layer-btn delete-keyframe" title="Delete keyframe">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                                <div class="transform-inputs">
                                    <div class="transform-input">
                                        <label>Translate X</label>
                                        <input type="number" class="transform-value translateX" value="${kf.translateX}" placeholder="px">
                                    </div>
                                    <div class="transform-input">
                                        <label>Translate Y</label>
                                        <input type="number" class="transform-value translateY" value="${kf.translateY}" placeholder="px">
                                    </div>
                                    <div class="transform-input">
                                        <label>Scale</label>
                                        <input type="number" class="transform-value scale" value="${kf.scale}" step="0.1" placeholder="1">
                                    </div>
                                    <div class="transform-input">
                                        <label>Rotate</label>
                                        <input type="number" class="transform-value rotate" value="${kf.rotate}" placeholder="deg">
                                    </div>
                                    <div class="transform-input">
                                        <label>Skew X</label>
                                        <input type="number" class="transform-value skewX" value="${kf.skewX}" placeholder="deg">
                                    </div>
                                    <div class="transform-input">
                                        <label>Skew Y</label>
                                        <input type="number" class="transform-value skewY" value="${kf.skewY}" placeholder="deg">
                                    </div>
                                </div>
                                <div style="margin-top: 10px;">
                                    <label>Easing:</label>
                                    <select class="easing-select" style="width: 100%;">
                                        <option value="linear" ${kf.easing === 'linear' ? 'selected' : ''}>Linear</option>
                                        <option value="ease" ${kf.easing === 'ease' ? 'selected' : ''}>Ease</option>
                                        <option value="ease-in" ${kf.easing === 'ease-in' ? 'selected' : ''}>Ease In</option>
                                        <option value="ease-out" ${kf.easing === 'ease-out' ? 'selected' : ''}>Ease Out</option>
                                        <option value="ease-in-out" ${kf.easing === 'ease-in-out' ? 'selected' : ''}>Ease In Out</option>
                                        <option value="cubic-bezier(0.68, -0.55, 0.27, 1.55)" ${kf.easing === 'cubic-bezier(0.68, -0.55, 0.27, 1.55)' ? 'selected' : ''}>Bounce</option>
                                    </select>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="add-keyframe-btn add-transform-keyframe">
                        <i class="fas fa-plus"></i> Add Transform Keyframe
                    </button>
                `;
            } else {
                propertyContent = `
                    <div class="property-header">
                        <div class="property-name">
                            <i class="fas fa-palette"></i>
                            <span>${property === 'opacity' ? 'Opacity' : 'Background Color'}</span>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" class="property-toggle" ${config.enabled ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="keyframe-list" id="${property}Keyframes">
                        ${config.keyframes.map((kf, index) => `
                            <div class="keyframe-item" data-index="${index}">
                                <div class="keyframe-header">
                                    <span class="keyframe-time">${kf.time}%</span>
                                    <button class="layer-btn delete-keyframe" title="Delete keyframe">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                                <div style="display: flex; gap: 10px; align-items: center;">
                                    ${property === 'opacity' ? `
                                        <input type="range" class="range-slider opacity-value" min="0" max="1" step="0.1" value="${kf.value}">
                                        <span class="control-value">${kf.value}</span>
                                    ` : `
                                        <input type="color" class="color-input" value="${kf.value}">
                                        <span class="control-value">${kf.value}</span>
                                    `}
                                </div>
                                <div style="margin-top: 10px;">
                                    <label>Easing:</label>
                                    <select class="easing-select" style="width: 100%;">
                                        <option value="linear" ${kf.easing === 'linear' ? 'selected' : ''}>Linear</option>
                                        <option value="ease" ${kf.easing === 'ease' ? 'selected' : ''}>Ease</option>
                                        <option value="ease-in" ${kf.easing === 'ease-in' ? 'selected' : ''}>Ease In</option>
                                        <option value="ease-out" ${kf.easing === 'ease-out' ? 'selected' : ''}>Ease Out</option>
                                        <option value="ease-in-out" ${kf.easing === 'ease-in-out' ? 'selected' : ''}>Ease In Out</option>
                                    </select>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="add-keyframe-btn add-${property}-keyframe">
                        <i class="fas fa-plus"></i> Add ${property === 'opacity' ? 'Opacity' : 'Background'} Keyframe
                    </button>
                `;
            }
            
            propertyGroup.innerHTML = propertyContent;
            propertyControls.appendChild(propertyGroup);
        });
        
        attachPropertyEvents();
    }
    
    function attachPropertyEvents() {
        // Property toggles
        document.querySelectorAll('.property-toggle').forEach(toggle => {
            toggle.addEventListener('change', function() {
                const propertyGroup = this.closest('.property-group');
                const property = propertyGroup.dataset.property;
                animationConfig.properties[property].enabled = this.checked;
                updateCodeOutput();
            });
        });
        
        // Add transform keyframe
        document.querySelectorAll('.add-transform-keyframe').forEach(btn => {
            btn.addEventListener('click', function() {
                const property = 'transform';
                const keyframes = animationConfig.properties[property].keyframes;
                
                // Find a unique time between existing keyframes
                let newTime = 50;
                const times = keyframes.map(kf => kf.time);
                times.sort((a, b) => a - b);
                
                for (let i = 0; i < times.length - 1; i++) {
                    if (times[i + 1] - times[i] > 20) {
                        newTime = Math.floor((times[i] + times[i + 1]) / 2);
                        break;
                    }
                }
                
                keyframes.push({
                    time: newTime,
                    translateX: 0,
                    translateY: 0,
                    scale: 1,
                    rotate: 0,
                    skewX: 0,
                    skewY: 0,
                    easing: 'ease'
                });
                
                // Sort by time
                keyframes.sort((a, b) => a.time - b.time);
                
                initializePropertyControls();
                updateCodeOutput();
            });
        });
        
        // Add opacity/background keyframe
        document.querySelectorAll('.add-opacity-keyframe, .add-backgroundColor-keyframe').forEach(btn => {
            btn.addEventListener('click', function() {
                const property = btn.classList.contains('add-opacity-keyframe') ? 'opacity' : 'backgroundColor';
                const keyframes = animationConfig.properties[property].keyframes;
                
                let newTime = 50;
                const times = keyframes.map(kf => kf.time);
                times.sort((a, b) => a - b);
                
                for (let i = 0; i < times.length - 1; i++) {
                    if (times[i + 1] - times[i] > 20) {
                        newTime = Math.floor((times[i] + times[i + 1]) / 2);
                        break;
                    }
                }
                
                const defaultValue = property === 'opacity' ? 1 : '#8a2be2';
                keyframes.push({
                    time: newTime,
                    value: defaultValue,
                    easing: 'linear'
                });
                
                keyframes.sort((a, b) => a.time - b.time);
                
                initializePropertyControls();
                updateCodeOutput();
            });
        });
        
        // Delete keyframe
        document.addEventListener('click', function(e) {
            if (e.target.closest('.delete-keyframe')) {
                const keyframeItem = e.target.closest('.keyframe-item');
                const propertyGroup = e.target.closest('.property-group');
                const property = propertyGroup.dataset.property;
                const index = parseInt(keyframeItem.dataset.index);
                
                if (animationConfig.properties[property].keyframes.length > 2) {
                    animationConfig.properties[property].keyframes.splice(index, 1);
                    initializePropertyControls();
                    updateCodeOutput();
                } else {
                    alert('You must have at least two keyframes');
                }
            }
        });
        
        // Transform value changes
        document.addEventListener('input', function(e) {
            if (e.target.classList.contains('transform-value') || 
                e.target.classList.contains('opacity-value') || 
                e.target.classList.contains('color-input')) {
                
                const keyframeItem = e.target.closest('.keyframe-item');
                const propertyGroup = e.target.closest('.property-group');
                const property = propertyGroup.dataset.property;
                const index = parseInt(keyframeItem.dataset.index);
                const keyframe = animationConfig.properties[property].keyframes[index];
                
                if (property === 'transform') {
                    const type = e.target.classList[1];
                    keyframe[type] = parseFloat(e.target.value) || 0;
                    
                    // Update display value for opacity
                    if (type === 'opacity') {
                        e.target.nextElementSibling.textContent = e.target.value;
                    }
                } else {
                    keyframe.value = property === 'opacity' ? parseFloat(e.target.value) : e.target.value;
                    
                    if (property === 'opacity') {
                        e.target.nextElementSibling.textContent = e.target.value;
                    } else {
                        e.target.nextElementSibling.textContent = e.target.value;
                    }
                }
                
                updatePreviewElement();
                updateCodeOutput();
            }
        });
        
        // Easing select changes
        document.addEventListener('change', function(e) {
            if (e.target.classList.contains('easing-select')) {
                const keyframeItem = e.target.closest('.keyframe-item');
                const propertyGroup = e.target.closest('.property-group');
                const property = propertyGroup.dataset.property;
                const index = parseInt(keyframeItem.dataset.index);
                
                animationConfig.properties[property].keyframes[index].easing = e.target.value;
                updateCodeOutput();
                drawEasingCurve();
            }
        });
    }
    
    function updateAnimationSettings() {
        animationConfig.name = animationName.value || 'myAnimation';
        animationConfig.duration = parseFloat(animationDuration.value);
        animationConfig.delay = parseFloat(animationDelay.value);
        animationConfig.iterationCount = animationIteration.value === 'infinite' ? 'infinite' : parseInt(animationIteration.value);
        animationConfig.direction = animationDirection.value;
        animationConfig.fillMode = animationFillMode.value;
        animationConfig.playState = animationPlayState.value;
        animationConfig.timingFunction = animationTiming.value;
        animationConfig.cubicBezier = cubicBezier.value;
        
        // Update display values
        document.getElementById('durationValue').textContent = `${animationConfig.duration}s`;
        document.getElementById('delayValue').textContent = `${animationConfig.delay}s`;
        
        updatePreviewElement();
        updateCodeOutput();
        drawEasingCurve();
    }
    
    function updateUIFromConfig() {
        animationName.value = animationConfig.name;
        animationDuration.value = animationConfig.duration;
        animationDelay.value = animationConfig.delay;
        animationIteration.value = animationConfig.iterationCount;
        animationDirection.value = animationConfig.direction;
        animationFillMode.value = animationConfig.fillMode;
        animationPlayState.value = animationConfig.playState;
        animationTiming.value = animationConfig.timingFunction;
        cubicBezier.value = animationConfig.cubicBezier;
        
        document.getElementById('durationValue').textContent = `${animationConfig.duration}s`;
        document.getElementById('delayValue').textContent = `${animationConfig.delay}s`;
        cubicBezier.disabled = animationConfig.timingFunction !== 'cubic-bezier';
        
        initializePropertyControls();
    }
    
    function updatePreviewElement() {
        // Update preview element style based on current object
        previewElement.innerHTML = '';
        
        switch(currentPreviewObject) {
            case 'box':
                previewElement.innerHTML = '<i class="fas fa-square"></i>';
                previewElement.style.borderRadius = '12px';
                break;
            case 'circle':
                previewElement.innerHTML = '<i class="fas fa-circle"></i>';
                previewElement.style.borderRadius = '50%';
                break;
            case 'star':
                previewElement.innerHTML = '<i class="fas fa-star"></i>';
                previewElement.style.borderRadius = '12px';
                break;
            case 'text':
                previewElement.innerHTML = 'Text';
                previewElement.style.fontSize = '24px';
                previewElement.style.fontWeight = 'bold';
                previewElement.style.borderRadius = '12px';
                break;
        }
        
        // Apply current animation
        applyAnimationToElement(previewElement);
    }
    
    function applyAnimationToElement(element) {
        // Remove existing animation
        element.style.animation = '';
        
        // Generate animation CSS
        const animationCSS = generateAnimationCSS();
        
        // Apply to element
        element.style.animation = animationCSS;
        
        // Create style tag for keyframes
        let styleTag = document.getElementById('dynamicAnimationStyle');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'dynamicAnimationStyle';
            document.head.appendChild(styleTag);
        }
        
        styleTag.textContent = generateKeyframesCSS();
        
        // Update timeline markers
        updateTimelineMarkers();
    }
    
    function generateKeyframesCSS() {
        const keyframes = [];
        
        // Collect all unique time points
        const timePoints = new Set();
        Object.values(animationConfig.properties).forEach(prop => {
            if (prop.enabled) {
                prop.keyframes.forEach(kf => timePoints.add(kf.time));
            }
        });
        
        const sortedTimes = Array.from(timePoints).sort((a, b) => a - b);
        
        sortedTimes.forEach(time => {
            const properties = [];
            
            Object.entries(animationConfig.properties).forEach(([propName, prop]) => {
                if (!prop.enabled) return;
                
                // Find the keyframe for this time or interpolate
                let keyframe = prop.keyframes.find(kf => kf.time === time);
                
                if (!keyframe) {
                    // Find surrounding keyframes for interpolation
                    const prevKeyframe = [...prop.keyframes].reverse().find(kf => kf.time < time);
                    const nextKeyframe = prop.keyframes.find(kf => kf.time > time);
                    
                    if (prevKeyframe && nextKeyframe) {
                        const progress = (time - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time);
                        keyframe = { ...prevKeyframe, time };
                        
                        if (propName === 'transform') {
                            // Interpolate transform values
                            keyframe.translateX = prevKeyframe.translateX + (nextKeyframe.translateX - prevKeyframe.translateX) * progress;
                            keyframe.translateY = prevKeyframe.translateY + (nextKeyframe.translateY - prevKeyframe.translateY) * progress;
                            keyframe.scale = prevKeyframe.scale + (nextKeyframe.scale - prevKeyframe.scale) * progress;
                            keyframe.rotate = prevKeyframe.rotate + (nextKeyframe.rotate - prevKeyframe.rotate) * progress;
                            keyframe.skewX = prevKeyframe.skewX + (nextKeyframe.skewX - prevKeyframe.skewX) * progress;
                            keyframe.skewY = prevKeyframe.skewY + (nextKeyframe.skewY - prevKeyframe.skewY) * progress;
                        } else {
                            // For opacity and background color, use previous value
                            keyframe.value = prevKeyframe.value;
                        }
                    } else {
                        return;
                    }
                }
                
                if (propName === 'transform') {
                    const transforms = [];
                    if (keyframe.translateX !== 0 || keyframe.translateY !== 0) {
                        transforms.push(`translate(${keyframe.translateX}px, ${keyframe.translateY}px)`);
                    }
                    if (keyframe.scale !== 1) {
                        transforms.push(`scale(${keyframe.scale})`);
                    }
                    if (keyframe.rotate !== 0) {
                        transforms.push(`rotate(${keyframe.rotate}deg)`);
                    }
                    if (keyframe.skewX !== 0 || keyframe.skewY !== 0) {
                        transforms.push(`skew(${keyframe.skewX}deg, ${keyframe.skewY}deg)`);
                    }
                    
                    if (transforms.length > 0) {
                        properties.push(`transform: ${transforms.join(' ')};`);
                    }
                } else if (propName === 'opacity') {
                    properties.push(`opacity: ${keyframe.value};`);
                } else if (propName === 'backgroundColor') {
                    properties.push(`background-color: ${keyframe.value};`);
                }
            });
            
            if (properties.length > 0) {
                keyframes.push(`  ${time}% {\n    ${properties.join('\n    ')}\n  }`);
            }
        });
        
        return `@keyframes ${animationConfig.name} {\n${keyframes.join('\n')}\n}`;
    }
    
    function generateAnimationCSS() {
        const timing = animationConfig.timingFunction === 'cubic-bezier' 
            ? `cubic-bezier(${animationConfig.cubicBezier})`
            : animationConfig.timingFunction;
        
        return `${animationConfig.name} ${animationConfig.duration}s ${timing} ${animationConfig.delay}s ${animationConfig.iterationCount} ${animationConfig.direction} ${animationConfig.fillMode} ${animationConfig.playState}`;
    }
    
    function updateCodeOutput() {
        const keyframesCSS = generateKeyframesCSS();
        const animationCSS = generateAnimationCSS();
        
        keyframesOutput.innerHTML = `<code class="css">${keyframesCSS}</code>`;
        animationOutput.innerHTML = `<code class="css">.element {\n  animation: ${animationCSS};\n}</code>`;
        completeOutput.innerHTML = `<code class="css">${keyframesCSS}\n\n.element {\n  animation: ${animationCSS};\n}</code>`;
    }
    
    function updateTimelineMarkers() {
        const timeline = document.getElementById('timeline');
        timeline.innerHTML = '<div class="timeline-progress" id="timelineProgress"></div>';
        
        // Collect all time points
        const timePoints = new Set();
        Object.values(animationConfig.properties).forEach(prop => {
            if (prop.enabled) {
                prop.keyframes.forEach(kf => timePoints.add(kf.time));
            }
        });
        
        Array.from(timePoints).sort((a, b) => a - b).forEach(time => {
            const marker = document.createElement('div');
            marker.className = 'keyframe-marker';
            marker.style.left = `${time}%`;
            
            const label = document.createElement('div');
            label.className = 'keyframe-label';
            label.textContent = `${time}%`;
            label.style.left = `${time}%`;
            
            timeline.appendChild(marker);
            timeline.appendChild(label);
        });
    }
    
    function drawEasingCurve() {
        const canvas = curveCanvas;
        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = canvas.offsetHeight;
        const padding = 20;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        // Vertical lines
        for (let i = 0; i <= 10; i++) {
            const x = padding + (width - 2 * padding) * (i / 10);
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let i = 0; i <= 10; i++) {
            const y = padding + (height - 2 * padding) * (i / 10);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // Draw axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        
        // X axis
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
        
        // Y axis
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.stroke();
        
        // Draw curve based on timing function
        ctx.strokeStyle = '#8a2be2';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        const timing = animationConfig.timingFunction;
        
        for (let i = 0; i <= 100; i++) {
            const t = i / 100;
            let y;
            
            switch(timing) {
                case 'linear':
                    y = t;
                    break;
                case 'ease':
                    y = ease(t);
                    break;
                case 'ease-in':
                    y = easeIn(t);
                    break;
                case 'ease-out':
                    y = easeOut(t);
                    break;
                case 'ease-in-out':
                    y = easeInOut(t);
                    break;
                default:
                    y = t;
            }
            
            const x = padding + (width - 2 * padding) * t;
            const yPos = height - padding - (height - 2 * padding) * y;
            
            if (i === 0) {
                ctx.moveTo(x, yPos);
            } else {
                ctx.lineTo(x, yPos);
            }
        }
        
        ctx.stroke();
        
        // Draw control points for cubic-bezier
        if (timing === 'cubic-bezier') {
            const [x1, y1, x2, y2] = animationConfig.cubicBezier.split(',').map(v => parseFloat(v.trim()));
            
            ctx.fillStyle = '#ff6b6b';
            ctx.strokeStyle = '#ff6b6b';
            
            // Draw control points
            const drawControlPoint = (x, y, label) => {
                const pointX = padding + (width - 2 * padding) * x;
                const pointY = height - padding - (height - 2 * padding) * y;
                
                ctx.beginPath();
                ctx.arc(pointX, pointY, 6, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#fff';
                ctx.font = '12px Arial';
                ctx.fillText(label, pointX + 8, pointY + 4);
                ctx.fillStyle = '#ff6b6b';
            };
            
            drawControlPoint(x1, y1, 'P1');
            drawControlPoint(x2, y2, 'P2');
            
            // Draw control lines
            ctx.setLineDash([5, 5]);
            ctx.lineWidth = 1;
            
            ctx.beginPath();
            ctx.moveTo(padding, height - padding);
            ctx.lineTo(padding + (width - 2 * padding) * x1, height - padding - (height - 2 * padding) * y1);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(width - padding, padding);
            ctx.lineTo(padding + (width - 2 * padding) * x2, height - padding - (height - 2 * padding) * y2);
            ctx.stroke();
            
            ctx.setLineDash([]);
        }
        
        // Easing functions
        function ease(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }
        
        function easeIn(t) {
            return t * t;
        }
        
        function easeOut(t) {
            return t * (2 - t);
        }
        
        function easeInOut(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }
    }
    
    function togglePlayPause() {
        if (isPlaying) {
            pauseAnimation();
        } else {
            playAnimation();
        }
    }
    
    function playAnimation() {
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playPauseBtn.classList.add('active');
        
        previewElement.style.animationPlayState = 'running';
        
        // Update timeline progress
        const duration = animationConfig.duration * 1000;
        let startTime = Date.now();
        let progress = 0;
        
        function updateProgress() {
            if (!isPlaying) return;
            
            const elapsed = Date.now() - startTime;
            progress = (elapsed % duration) / duration;
            
            timelineProgress.style.width = `${progress * 100}%`;
            
            requestAnimationFrame(updateProgress);
        }
        
        updateProgress();
    }
    
    function pauseAnimation() {
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        playPauseBtn.classList.remove('active');
        
        previewElement.style.animationPlayState = 'paused';
    }
    
    function stopAnimation() {
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        playPauseBtn.classList.remove('active');
        
        // Reset animation
        previewElement.style.animation = 'none';
        void previewElement.offsetWidth; // Trigger reflow
        applyAnimationToElement(previewElement);
        
        timelineProgress.style.width = '0%';
    }
    
    function restartAnimation() {
        stopAnimation();
        setTimeout(() => playAnimation(), 100);
    }
    
    function updateAnimationSpeed() {
        previewElement.style.animationDuration = `${animationConfig.duration / animationSpeed}s`;
    }
    
    function applyPreset(preset) {
        switch(preset) {
            case 'bounce':
                animationConfig.name = 'bounce';
                animationConfig.duration = 1;
                animationConfig.iterationCount = 'infinite';
                animationConfig.timingFunction = 'cubic-bezier(0.68, -0.55, 0.27, 1.55)';
                
                animationConfig.properties.transform.enabled = true;
                animationConfig.properties.transform.keyframes = [
                    { time: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)' },
                    { time: 50, translateX: 0, translateY: -50, scale: 1.2, rotate: 0, skewX: 0, skewY: 0, easing: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)' },
                    { time: 100, translateX: 0, translateY: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)' }
                ];
                break;
                
            case 'fadeIn':
                animationConfig.name = 'fadeIn';
                animationConfig.duration = 1.5;
                
                animationConfig.properties.opacity.enabled = true;
                animationConfig.properties.opacity.keyframes = [
                    { time: 0, value: 0, easing: 'ease-out' },
                    { time: 100, value: 1, easing: 'ease-out' }
                ];
                break;
                
            case 'slideIn':
                animationConfig.name = 'slideIn';
                animationConfig.duration = 1;
                
                animationConfig.properties.transform.enabled = true;
                animationConfig.properties.transform.keyframes = [
                    { time: 0, translateX: -100, translateY: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'ease-out' },
                    { time: 100, translateX: 0, translateY: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'ease-out' }
                ];
                break;
                
            case 'rotate':
                animationConfig.name = 'rotate';
                animationConfig.duration = 2;
                animationConfig.iterationCount = 'infinite';
                animationConfig.timingFunction = 'linear';
                
                animationConfig.properties.transform.enabled = true;
                animationConfig.properties.transform.keyframes = [
                    { time: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'linear' },
                    { time: 100, translateX: 0, translateY: 0, scale: 1, rotate: 360, skewX: 0, skewY: 0, easing: 'linear' }
                ];
                break;
                
            case 'pulse':
                animationConfig.name = 'pulse';
                animationConfig.duration = 1.5;
                animationConfig.iterationCount = 'infinite';
                
                animationConfig.properties.transform.enabled = true;
                animationConfig.properties.transform.keyframes = [
                    { time: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'ease-in-out' },
                    { time: 50, translateX: 0, translateY: 0, scale: 1.1, rotate: 0, skewX: 0, skewY: 0, easing: 'ease-in-out' },
                    { time: 100, translateX: 0, translateY: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'ease-in-out' }
                ];
                break;
                
            case 'shake':
                animationConfig.name = 'shake';
                animationConfig.duration = 0.5;
                animationConfig.iterationCount = 'infinite';
                
                animationConfig.properties.transform.enabled = true;
                animationConfig.properties.transform.keyframes = [
                    { time: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'ease-in-out' },
                    { time: 10, translateX: -10, translateY: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'ease-in-out' },
                    { time: 20, translateX: 10, translateY: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'ease-in-out' },
                    { time: 30, translateX: -10, translateY: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'ease-in-out' },
                    { time: 40, translateX: 10, translateY: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'ease-in-out' },
                    { time: 50, translateX: -10, translateY: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'ease-in-out' },
                    { time: 60, translateX: 10, translateY: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'ease-in-out' },
                    { time: 70, translateX: -10, translateY: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'ease-in-out' },
                    { time: 80, translateX: 10, translateY: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'ease-in-out' },
                    { time: 90, translateX: -10, translateY: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'ease-in-out' },
                    { time: 100, translateX: 0, translateY: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'ease-in-out' }
                ];
                break;
                
            case 'zoomIn':
                animationConfig.name = 'zoomIn';
                animationConfig.duration = 1;
                
                animationConfig.properties.transform.enabled = true;
                animationConfig.properties.transform.keyframes = [
                    { time: 0, translateX: 0, translateY: 0, scale: 0.5, rotate: 0, skewX: 0, skewY: 0, easing: 'ease-out' },
                    { time: 100, translateX: 0, translateY: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'ease-out' }
                ];
                break;
                
            case 'float':
                animationConfig.name = 'float';
                animationConfig.duration = 3;
                animationConfig.iterationCount = 'infinite';
                animationConfig.direction = 'alternate';
                
                animationConfig.properties.transform.enabled = true;
                animationConfig.properties.transform.keyframes = [
                    { time: 0, translateX: 0, translateY: -20, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'ease-in-out' },
                    { time: 100, translateX: 0, translateY: 20, scale: 1, rotate: 0, skewX: 0, skewY: 0, easing: 'ease-in-out' }
                ];
                break;
        }
        
        updateUIFromConfig();
        updatePreviewElement();
        updateCodeOutput();
        drawEasingCurve();
    }
});
