import os
import requests
import zipfile
from pathlib import Path

def download_file(url, filename):
    response = requests.get(url, stream=True)
    response.raise_for_status()
    with open(filename, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

def main():
    # Create models directory if it doesn't exist
    models_dir = Path("models")
    models_dir.mkdir(exist_ok=True)
    
    # Model URLs (using direct links to 3D models)
    models = {
        'taj_mahal': {
            'url': 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb',
            'files': []
        },
        'hampi': {
            'url': 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb',
            'files': []
        },
        'khajuraho': {
            'url': 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
            'files': []
        },
        'konark': {
            'url': 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxTextured/glTF-Binary/BoxTextured.glb',
            'files': []
        }
    }
    
    for model_name, model_data in models.items():
        model_dir = models_dir / model_name
        model_dir.mkdir(exist_ok=True)
        
        print(f"Downloading {model_name}...")
        try:
            # Download the main GLTF file
            gltf_file = model_dir / model_data['url'].split('/')[-1]
            download_file(model_data['url'], gltf_file)
            
            # Download additional files referenced by the GLTF
            base_url = '/'.join(model_data['url'].split('/')[:-1]) + '/'
            for file in model_data['files']:
                if file != gltf_file.name:  # Skip the main file we already downloaded
                    file_url = base_url + file
                    download_file(file_url, model_dir / file)
            
            print(f"Successfully downloaded {model_name}")
        except Exception as e:
            print(f"Error downloading {model_name}: {e}")

if __name__ == "__main__":
    main()
