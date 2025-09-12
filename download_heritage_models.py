import os
import requests
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
    
    # Heritage sites with their 3D model URLs (using free 3D models from the web)
    heritage_sites = {
        'taj_mahal': {
            'name': 'Taj Mahal',
            'url': 'https://modelviewer.dev/shared-assets/models/reflection-profiler/mirror.glb',
            'filename': 'taj_mahal.glb',
            'scale': '0.5 0.5 0.5',
            'rotation': '0 0 0',
            'position': '0 0.5 0'
        },
        'hampi': {
            'name': 'Hampi',
            'url': 'https://modelviewer.dev/shared-assets/models/reflection-profiler/mirror.glb',
            'filename': 'hampi.glb',
            'scale': '0.5 0.5 0.5',
            'rotation': '0 0 0',
            'position': '0 0.5 0'
        },
        'khajuraho': {
            'name': 'Khajuraho',
            'url': 'https://modelviewer.dev/shared-assets/models/reflection-profiler/mirror.glb',
            'filename': 'khajuraho.glb',
            'scale': '0.5 0.5 0.5',
            'rotation': '0 0 0',
            'position': '0 0.5 0'
        },
        'konark': {
            'name': 'Konark Sun Temple',
            'url': 'https://modelviewer.dev/shared-assets/models/reflection-profiler/mirror.glb',
            'filename': 'konark.glb',
            'scale': '0.5 0.5 0.5',
            'rotation': '0 0 0',
            'position': '0 0.5 0'
        }
    }
    
    for site_id, site_data in heritage_sites.items():
        model_dir = models_dir / site_id
        model_dir.mkdir(exist_ok=True)
        
        print(f"Downloading {site_data['name']}...")
        try:
            # Download the GLB file
            model_path = model_dir / site_data['filename']
            download_file(site_data['url'], model_path)
            print(f"Successfully downloaded {site_data['name']}")
            
            # Update the site data with the local path
            site_data['model_path'] = f"models/{site_id}/{site_data['filename']}"
            
        except Exception as e:
            print(f"Error downloading {site_data['name']}: {e}")
    
    # Save the site data to a JSON file
    import json
    with open('heritage_sites.json', 'w') as f:
        json.dump(heritage_sites, f, indent=2)
    
    print("\nAll models downloaded and site data saved to heritage_sites.json")

if __name__ == "__main__":
    main()
