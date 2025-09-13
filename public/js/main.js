// Main JavaScript for Indian Heritage AR Experience
// Debug logging
console.log('DOM fully loaded');

// Check if we're on a page that uses A-Frame
const isARPage = document.querySelector('a-scene') !== null;

// Only check for A-Frame if we're on an AR page
if (isARPage) {
    if (typeof AFRAME === 'undefined') {
        console.error('A-Frame is not loaded!');
    } else {
        console.log('A-Frame version:', AFRAME.version);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    
    // DOM Elements - only query if they exist
    const loadingScreen = document.getElementById('loading');
    const infoPanel = document.getElementById('info-panel');
    const closeButton = document.getElementById('close-info');
    const infoTitle = document.getElementById('info-title');
    const infoContent = document.getElementById('info-content');
    
    // Only proceed with AR-specific code if we're on an AR page
    if (!isARPage) {
        console.log('Not an AR page, skipping AR initialization');
        return;
    }

    // Heritage sites data with 3D model information
    const heritageSites = {
        'tajmahal': {
            name: 'Taj Mahal',
            description: 'An ivory-white marble mausoleum on the right bank of the Yamuna river in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal.',
            location: 'Agra, Uttar Pradesh',
            built: '1632-1653',
            architect: 'Ustad Ahmad Lahauri',
            unesco: '1983',
            model: {
                type: 'glb',
                path: 'models/taj_mahal/scene.glb',
                scale: '0.5 0.5 0.5',
                rotation: '0 0 0',
                position: '0 0.5 0'
            },
            primitive: {
                type: 'box',
                color: '#ffffff',
                scale: '0.5 0.5 0.5',
                rotation: '0 0 0',
                position: '0 0.25 0'
            }
        },
        'hampi': {
            name: 'Group of Monuments at Hampi',
            description: 'A UNESCO World Heritage Site located in east-central Karnataka, India. Hampi was the capital of the Vijayanagara Empire in the 14th century.',
            location: 'Hampi, Karnataka',
            built: '14th century',
            architect: 'Vijayanagara Empire',
            unesco: '1986',
            model: {
                type: 'glb',
                path: 'models/hampi/scene.glb',
                scale: '0.5 0.5 0.5',
                rotation: '0 0 0',
                position: '0 0.5 0'
            },
            primitive: {
                type: 'box',
                color: '#d4af37',
                scale: '0.5 0.5 0.5',
                rotation: '0 0 0',
                position: '0 0.25 0'
            }
        },
        'khajuraho': {
            name: 'Khajuraho Group of Monuments',
            description: 'A group of Hindu and Jain temples in Chhatarpur district, Madhya Pradesh, India, about 175 kilometers southeast of Jhansi. They are a UNESCO World Heritage Site.',
            location: 'Chhatarpur, Madhya Pradesh',
            built: '950-1050 CE',
            architect: 'Chandela dynasty',
            unesco: '1986',
            model: {
                type: 'glb',
                path: 'models/khajuraho/scene.glb',
                scale: '0.5 0.5 0.5',
                rotation: '0 0 0',
                position: '0 0.5 0'
            },
            primitive: {
                type: 'box',
                color: '#8b4513',
                scale: '0.5 0.5 0.5',
                rotation: '0 0 0',
                position: '0 0.25 0'
            }
        },
        'konark': {
            name: 'Konark Sun Temple',
            description: 'A 13th-century CE Sun temple at Konark about 35 kilometers northeast from Puri on the coastline of Odisha, India. The temple is attributed to king Narasimhadeva I of the Eastern Ganga dynasty about 1250 CE.',
            location: 'Puri, Odisha',
            built: '1250 CE',
            architect: 'Narasimhadeva I',
            unesco: '1984',
            model: {
                type: 'glb',
                path: 'models/konark/scene.glb',
                scale: '0.5 0.5 0.5',
                rotation: '0 0 0',
                position: '0 0.5 0'
            },
            primitive: {
                type: 'box',
                color: '#cd5c5c',
                scale: '0.5 0.5 0.5',
                rotation: '0 0 0',
                position: '0 0.25 0'
            }
        }
    };

    // Initialize AR experience
    function initAR() {
        console.log('Initializing AR experience...');
        // Create model selection buttons
        createModelButtons();
        
        // Hide loading screen
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }

    // Create model selection buttons
    function createModelButtons() {
        const modelSelector = document.getElementById('model-selector');
        if (!modelSelector) return;
        
        // Clear existing buttons
        modelSelector.innerHTML = '';
        
        // Create a button for each heritage site
        Object.entries(heritageSites).forEach(([id, site]) => {
            const button = document.createElement('button');
            button.className = 'model-btn';
            button.textContent = site.name;
            button.onclick = () => loadModel(id);
            modelSelector.appendChild(button);
        });
        
        console.log('Model selection buttons created');
    }

    // Function to create a primitive shape
    function createPrimitive(primitive, color, scale, position, rotation) {
        const entity = document.createElement('a-entity');
        
        // Set common attributes
        entity.setAttribute('geometry', {
            primitive: primitive,
            radius: 0.5,
            height: 1,
            depth: 1
        });
        
        entity.setAttribute('material', { color: color });
        entity.setAttribute('scale', scale);
        entity.setAttribute('position', position);
        entity.setAttribute('rotation', rotation);
        
        // Add animation
        entity.setAttribute('animation', {
            property: 'rotation',
            to: '0 360 0',
            dur: 20000,
            loop: true,
            easing: 'linear'
        });
        
        return entity;
    }

    // Function to load a 3D model with fallback to primitive shape
    function loadModel(siteId) {
        console.log(`Loading model for ${siteId}...`);
        const site = heritageSites[siteId];
        if (!site) {
            console.error(`Site ${siteId} not found`);
            return;
        }
        
        // Get the marker entity
        const marker = document.querySelector('a-marker');
        if (!marker) {
            console.error('Marker not found');
            return;
        }
        
        // Clear existing model
        const existingModel = marker.querySelector('a-entity');
        if (existingModel) {
            marker.removeChild(existingModel);
        }
        
        // Create a container for the model
        const container = document.createElement('a-entity');
        container.setAttribute('id', 'model-container');
        
        // Create the model entity
        const model = document.createElement('a-entity');
        
        // Set model attributes
        model.setAttribute('gltf-model', `url(${site.model.path})`);
        model.setAttribute('scale', site.model.scale);
        model.setAttribute('position', site.model.position);
        model.setAttribute('rotation', site.model.rotation);
        
        // Add animation
        model.setAttribute('animation', {
            property: 'rotation',
            to: '0 360 0',
            dur: 20000,
            loop: true,
            easing: 'linear'
        });
        
        // Add click event to show info panel
        model.setAttribute('class', 'clickable');
        model.addEventListener('click', () => showInfoPanel(site));
        
        // Add model to container
        container.appendChild(model);
        
        // Add container to marker
        marker.appendChild(container);
        
        // Show info panel
        showInfoPanel(site);
        
        console.log(`Model loaded for ${site.name}`);
        
        // Set up error handling for model loading
        model.addEventListener('model-error', () => {
            console.error(`Failed to load model for ${site.name}, falling back to primitive shape`);
            
            // Remove the failed model
            if (marker.contains(container)) {
                marker.removeChild(container);
            }
            
            // Create a primitive shape as fallback
            const primitive = createPrimitive(
                site.primitive.type,
                site.primitive.color,
                site.primitive.scale,
                site.primitive.position,
                site.primitive.rotation
            );
            
            // Add click event to show info panel
            primitive.setAttribute('class', 'clickable');
            primitive.addEventListener('click', () => showInfoPanel(site));
            
            // Add to marker
            marker.appendChild(primitive);
        });
    }

    // Show info panel with site details
    function showInfoPanel(site) {
        if (!infoPanel || !infoTitle || !infoContent) return;
        
        infoTitle.textContent = site.name;
        infoContent.innerHTML = `
            <p><strong>Location:</strong> ${site.location}</p>
            <p><strong>Built:</strong> ${site.built}</p>
            <p><strong>Architect:</strong> ${site.architect}</p>
            <p><strong>UNESCO:</strong> ${site.unesco}</p>
            <p>${site.description}</p>
        `;
        
        infoPanel.style.display = 'block';
    }

    // Close button event - only if closeButton exists
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            if (infoPanel) {
                infoPanel.style.display = 'none';
            }
        });
    }

    // Initialize AR when A-Frame is ready
    if (window.ARjs) {
        console.log('AR.js is loaded');
        initAR();
    } else {
        console.log('AR.js not loaded yet, waiting...');
        window.addEventListener('arjs-nft-loaded', () => {
            console.log('AR.js NFT module loaded');
            initAR();
        });
    }

    // Add help button functionality
    const helpButton = document.getElementById('help-button');
    const helpModal = document.getElementById('help-modal');
    const closeHelp = document.getElementById('close-help');
    
    if (helpButton && helpModal) {
        helpButton.addEventListener('click', () => {
            helpModal.style.display = 'block';
        });
    }
    
    if (closeHelp && helpModal) {
        closeHelp.addEventListener('click', () => {
            helpModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === helpModal) {
            helpModal.style.display = 'none';
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        const arToolkitSource = document.querySelector('a-scene').components['arjs'].arToolkitSource;
        if (arToolkitSource) {
            arToolkitSource.init(() => {
                console.log('AR source reinitialized after resize');
            });
        }
    });
});
