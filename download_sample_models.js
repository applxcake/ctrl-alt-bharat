const fs = require('fs');
const https = require('https');
const path = require('path');

// Sample models from A-Frame examples
const sampleModels = {
    'taj_mahal': 'https://cdn.aframe.io/test-models/models/glTF-2.0/box/glTF-Binary/Box.glb',
    'hampi': 'https://cdn.aframe.io/test-models/models/glTF-2.0/box/glTF-Binary/Box.glb',
    'khajuraho': 'https://cdn.aframe.io/test-models/models/glTF-2.0/box/glTF-Binary/Box.glb',
    'konark': 'https://cdn.aframe.io/test-models/models/glTF-2.0/box/glTF-Binary/Box.glb'
};

// Create models directory if it doesn't exist
const modelsDir = path.join(__dirname, 'models');
if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
}

// Download function
function downloadModel(url, filePath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => {}); // Delete the file async
            reject(err);
        });
    });
}

// Download all models
async function downloadAllModels() {
    for (const [site, url] of Object.entries(sampleModels)) {
        const siteDir = path.join(modelsDir, site);
        if (!fs.existsSync(siteDir)) {
            fs.mkdirSync(siteDir, { recursive: true });
        }
        
        const fileName = 'scene.glb';
        const filePath = path.join(siteDir, fileName);
        
        console.log(`Downloading ${site} model...`);
        try {
            await downloadModel(url, filePath);
            console.log(`Successfully downloaded ${site} model`);
        } catch (error) {
            console.error(`Error downloading ${site} model:`, error.message);
        }
    }
    console.log('All models downloaded!');
}

downloadAllModels().catch(console.error);
