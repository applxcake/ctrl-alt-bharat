import os
import urllib.request
from pathlib import Path

# Sample models from A-Frame examples
SAMPLE_MODELS = {
    'taj_mahal': 'https://cdn.aframe.io/test-models/models/glTF-2.0/box/glTF-Binary/Box.glb',
    'hampi': 'https://cdn.aframe.io/test-models/models/glTF-2.0/box/glTF-Binary/Box.glb',
    'khajuraho': 'https://cdn.aframe.io/test-models/models/glTF-2.0/box/glTF-Binary/Box.glb',
    'konark': 'https://cdn.aframe.io/test-models/models/glTF-2.0/box/glTF-Binary/Box.glb'
}

def download_model(url, file_path):
    """Download a file from URL to the specified path"""
    try:
        urllib.request.urlretrieve(url, file_path)
        print(f"Downloaded {os.path.basename(file_path)}")
        return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return False

def main():
    # Create models directory if it doesn't exist
    models_dir = Path("models")
    models_dir.mkdir(exist_ok=True)
    
    # Download each model
    for site, url in SAMPLE_MODELS.items():
        site_dir = models_dir / site
        site_dir.mkdir(exist_ok=True)
        
        file_path = site_dir / "scene.glb"
        print(f"Downloading {site} model...")
        success = download_model(url, file_path)
        
        if success:
            print(f"Successfully downloaded {site} model")
        else:
            print(f"Failed to download {site} model")
    
    print("\nAll models downloaded!")

if __name__ == "__main__":
    main()
