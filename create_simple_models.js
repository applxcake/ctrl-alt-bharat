const fs = require('fs');
const path = require('path');
const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');
const { Scene, Mesh, BoxBufferGeometry, MeshStandardMaterial, Color, DirectionalLight, AmbientLight, PerspectiveCamera } = require('three');

// Create a simple scene with a colored box
function createSimpleModel(color = 0x00ff00, size = 1) {
    const scene = new Scene();
    
    // Add a colored box
    const geometry = new BoxBufferGeometry(size, size, size);
    const material = new MeshStandardMaterial({ color: new Color(color) });
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);
    
    // Add some lights
    const light1 = new DirectionalLight(0xffffff, 1);
    light1.position.set(1, 1, 1);
    scene.add(light1);
    
    const light2 = new AmbientLight(0x404040);
    scene.add(light2);
    
    // Add a camera (required by GLTFExporter)
    const camera = new PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 2;
    scene.add(camera);
    
    return { scene, mesh };
}

// Export scene to GLB
function exportGLB(scene, outputPath) {
    const exporter = new GLTFExporter();
    
    return new Promise((resolve, reject) => {
        exporter.parse(
            scene,
            (glb) => {
                fs.writeFileSync(outputPath, Buffer.from(glb));
                console.log(`Exported model to ${outputPath}`);
                resolve();
            },
            (error) => {
                console.error('Error exporting GLB:', error);
                reject(error);
            },
            { binary: true }
        );
    });
}

// Create models for each heritage site
async function createAllModels() {
    const modelsDir = path.join(__dirname, 'models');
    
    // Define models to create with their colors
    const models = [
        { name: 'taj_mahal', color: 0xffffff },  // White
        { name: 'hampi', color: 0xd4af37 },     // Gold
        { name: 'khajuraho', color: 0x8b4513 }, // Brown
        { name: 'konark', color: 0xcd5c5c }     // Indian Red
    ];
    
    // Create models directory if it doesn't exist
    if (!fs.existsSync(modelsDir)) {
        fs.mkdirSync(modelsDir, { recursive: true });
    }
    
    // Create each model
    for (const model of models) {
        const modelDir = path.join(modelsDir, model.name);
        const outputPath = path.join(modelDir, 'scene.glb');
        
        // Create model directory if it doesn't exist
        if (!fs.existsSync(modelDir)) {
            fs.mkdirSync(modelDir, { recursive: true });
        }
        
        console.log(`Creating model for ${model.name}...`);
        const { scene } = createSimpleModel(model.color);
        await exportGLB(scene, outputPath);
    }
    
    console.log('All models created successfully!');
}

// Run the script
createAllModels().catch(console.error);
