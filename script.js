// script.js - Updated for dropdown fixes and new tools

document.addEventListener('DOMContentLoaded', function() {
    // Dropdown Navigation Functionality
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        // Toggle dropdown on click
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
            
            // Close other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
        
        // Close dropdown when clicking a menu item
        const menuItems = menu.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                dropdown.classList.remove('active');
            });
        });
    });
    
    // Modal functionality for tools
    const modal = document.getElementById('toolModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.querySelector('.close-modal');
    
    // Tool configurations
    const tools = {
        'unit-converter': {
            title: 'Unit Converter',
            description: 'Convert between different units of measurement',
            content: `
                <div class="converter-container">
                    <div class="converter-row">
                        <input type="number" id="fromValue" placeholder="Enter value" class="converter-input">
                        <select id="fromUnit" class="converter-select">
                            <option value="meter">Meters</option>
                            <option value="kilometer">Kilometers</option>
                            <option value="mile">Miles</option>
                            <option value="feet">Feet</option>
                        </select>
                    </div>
                    <div class="converter-row">
                        <div class="equals">=</div>
                    </div>
                    <div class="converter-row">
                        <input type="number" id="toValue" placeholder="Result" readonly class="converter-input">
                        <select id="toUnit" class="converter-select">
                            <option value="meter">Meters</option>
                            <option value="kilometer">Kilometers</option>
                            <option value="mile">Miles</option>
                            <option value="feet">Feet</option>
                        </select>
                    </div>
                    <button id="convertBtn" class="tool-button" style="margin-top: 1rem;">Convert</button>
                </div>
            `
        },
        'color-picker': {
            title: 'Color Picker',
            description: 'Pick, preview, and copy colors in different formats',
            content: `
                <div class="color-picker-container">
                    <div id="colorDisplay" class="color-display" style="background-color: #007AFF;"></div>
                    <div class="color-inputs">
                        <input type="color" id="colorPicker" value="#007AFF" title="Choose a color">
                        <input type="text" id="hexInput" placeholder="#007AFF" maxlength="7">
                        <input type="text" id="rgbInput" placeholder="rgb(0, 122, 255)">
                    </div>
                    <div id="colorValue" class="color-value">#007AFF | rgb(0, 122, 255)</div>
                    <button id="copyColor" class="tool-button" style="margin-top: 1rem;">Copy Color</button>
                </div>
            `
        },
        'calculator': {
            title: 'Calculator',
            description: 'A simple calculator for basic operations',
            content: `
                <div class="calculator-container">
                    <input type="text" id="calcDisplay" readonly class="calc-display" value="0">
                    <div class="calc-buttons">
                        <button class="calc-btn" data-value="C">C</button>
                        <button class="calc-btn" data-value="CE">CE</button>
                        <button class="calc-btn" data-value="%">%</button>
                        <button class="calc-btn operator" data-value="/">/</button>
                        
                        <button class="calc-btn" data-value="7">7</button>
                        <button class="calc-btn" data-value="8">8</button>
                        <button class="calc-btn" data-value="9">9</button>
                        <button class="calc-btn operator" data-value="*">×</button>
                        
                        <button class="calc-btn" data-value="4">4</button>
                        <button class="calc-btn" data-value="5">5</button>
                        <button class="calc-btn" data-value="6">6</button>
                        <button class="calc-btn operator" data-value="-">-</button>
                        
                        <button class="calc-btn" data-value="1">1</button>
                        <button class="calc-btn" data-value="2">2</button>
                        <button class="calc-btn" data-value="3">3</button>
                        <button class="calc-btn operator" data-value="+">+</button>
                        
                        <button class="calc-btn zero" data-value="0">0</button>
                        <button class="calc-btn" data-value=".">.</button>
                        <button class="calc-btn equals" data-value="=">=</button>
                    </div>
                </div>
            `
        }
    };
    
    // Open tool modal
    document.querySelectorAll('.tool-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const toolId = this.getAttribute('data-tool');
            
            if (tools[toolId]) {
                modalTitle.textContent = tools[toolId].title;
                modalDescription.textContent = tools[toolId].description;
                modalContent.innerHTML = tools[toolId].content;
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Initialize tool functionality
                initializeTool(toolId);
            }
        });
    });
    
    // Close modal
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Initialize specific tool functionality
    function initializeTool(toolId) {
        switch(toolId) {
            case 'unit-converter':
                initializeUnitConverter();
                break;
            case 'color-picker':
                initializeColorPicker();
                break;
            case 'calculator':
                initializeCalculator();
                break;
        }
    }
    
    // Unit Converter functionality
    function initializeUnitConverter() {
        const fromValue = document.getElementById('fromValue');
        const fromUnit = document.getElementById('fromUnit');
        const toValue = document.getElementById('toValue');
        const toUnit = document.getElementById('toUnit');
        const convertBtn = document.getElementById('convertBtn');
        
        const conversionRates = {
            meter: 1,
            kilometer: 1000,
            mile: 1609.34,
            feet: 0.3048
        };
        
        function convertUnits() {
            const value = parseFloat(fromValue.value);
            if (isNaN(value)) return;
            
            const from = fromUnit.value;
            const to = toUnit.value;
            
            // Convert to meters first, then to target unit
            const valueInMeters = value * conversionRates[from];
            const convertedValue = valueInMeters / conversionRates[to];
            
            toValue.value = convertedValue.toFixed(4);
        }
        
        convertBtn.addEventListener('click', convertUnits);
        fromValue.addEventListener('input', convertUnits);
        fromUnit.addEventListener('change', convertUnits);
        toUnit.addEventListener('change', convertUnits);
        
        // Initial conversion
        if (fromValue.value) convertUnits();
    }
    
    // Color Picker functionality
    function initializeColorPicker() {
        const colorPicker = document.getElementById('colorPicker');
        const hexInput = document.getElementById('hexInput');
        const rgbInput = document.getElementById('rgbInput');
        const colorDisplay = document.getElementById('colorDisplay');
        const colorValue = document.getElementById('colorValue');
        const copyBtn = document.getElementById('copyColor');
        
        function updateColor(color) {
            let hex, rgb;
            
            if (color.startsWith('#')) {
                hex = color.toUpperCase();
                rgb = hexToRgb(hex);
            } else if (color.startsWith('rgb')) {
                rgb = color;
                hex = rgbToHex(color);
            }
            
            colorDisplay.style.backgroundColor = hex;
            hexInput.value = hex;
            rgbInput.value = rgb;
            colorValue.textContent = `${hex} | ${rgb}`;
        }
        
        function hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null;
        }
        
        function rgbToHex(rgb) {
            const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
            if (!result) return '#000000';
            
            const r = parseInt(result[1]);
            const g = parseInt(result[2]);
            const b = parseInt(result[3]);
            
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
        }
        
        colorPicker.addEventListener('input', (e) => updateColor(e.target.value));
        
        hexInput.addEventListener('input', (e) => {
            const value = e.target.value;
            if (value.startsWith('#') && value.length === 7) {
                updateColor(value);
            }
        });
        
        hexInput.addEventListener('change', (e) => {
            let value = e.target.value;
            if (!value.startsWith('#')) value = '#' + value;
            if (/^#[0-9A-F]{6}$/i.test(value)) {
                updateColor(value);
            }
        });
        
        rgbInput.addEventListener('change', (e) => {
            const value = e.target.value;
            if (/^rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)$/.test(value)) {
                updateColor(value);
            }
        });
        
        copyBtn.addEventListener('click', () => {
            const text = colorValue.textContent;
            navigator.clipboard.writeText(text).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            });
        });
        
        // Initial color
        updateColor('#007AFF');
    }
    
    // Calculator functionality
    function initializeCalculator() {
        const display = document.getElementById('calcDisplay');
        let currentInput = '0';
        let previousInput = '';
        let operator = null;
        let resetScreen = false;
        
        document.querySelectorAll('.calc-btn').forEach(button => {
            button.addEventListener('click', () => {
                const value = button.getAttribute('data-value');
                
                if (value === 'C') {
                    currentInput = '0';
                    previousInput = '';
                    operator = null;
                } else if (value === 'CE') {
                    currentInput = '0';
                } else if (value === '=') {
                    if (operator && previousInput) {
                        currentInput = calculate(previousInput, currentInput, operator);
                        operator = null;
                        previousInput = '';
                        resetScreen = true;
                    }
                } else if (['+', '-', '*', '/', '%'].includes(value)) {
                    if (operator && previousInput && !resetScreen) {
                        currentInput = calculate(previousInput, currentInput, operator);
                    }
                    previousInput = currentInput;
                    operator = value;
                    resetScreen = true;
                } else {
                    if (currentInput === '0' || resetScreen) {
                        currentInput = value;
                        resetScreen = false;
                    } else {
                        currentInput += value;
                    }
                }
                
                display.value = currentInput;
            });
        });
        
        function calculate(a, b, op) {
            a = parseFloat(a);
            b = parseFloat(b);
            
            switch(op) {
                case '+': return (a + b).toString();
                case '-': return (a - b).toString();
                case '*': return (a * b).toString();
                case '/': return b !== 0 ? (a / b).toString() : 'Error';
                case '%': return (a % b).toString();
                default: return b;
            }
        }
    }
    
    // Smooth scroll for navigation links
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
            }
        });
    });
    
    // Add some CSS for the tools
    const style = document.createElement('style');
    style.textContent = `
        .converter-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .converter-row {
            display: flex;
            gap: 0.5rem;
            align-items: center;
        }
        
        .converter-input, .converter-select {
            padding: 0.75rem;
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 1rem;
        }
        
        .converter-input {
            flex: 2;
        }
        
        .converter-select {
            flex: 1;
        }
        
        .converter-input:focus, .converter-select:focus {
            outline: none;
            border-color: #007AFF;
        }
        
        .equals {
            color: #fff;
            font-size: 1.5rem;
            text-align: center;
            width: 100%;
        }
        
        .calculator-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .calc-display {
            padding: 1rem;
            font-size: 1.5rem;
            text-align: right;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border-radius: 8px;
            width: 100%;
        }
        
        .calc-buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 0.5rem;
        }
        
        .calc-btn {
            padding: 1rem;
            border: none;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        
        .calc-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .calc-btn.operator {
            background: rgba(0, 122, 255, 0.3);
        }
        
        .calc-btn.operator:hover {
            background: rgba(0, 122, 255, 0.5);
        }
        
        .calc-btn.equals {
            background: rgba(52, 199, 89, 0.3);
        }
        
        .calc-btn.equals:hover {
            background: rgba(52, 199, 89, 0.5);
        }
        
        .calc-btn.zero {
            grid-column: span 2;
        }
    `;
    document.head.appendChild(style);
});
