import os
import json
import requests
from pathlib import Path
from tqdm import tqdm

class SketchfabDownloader:
    def __init__(self, config_file='sketchfab_config.json'):
        self.config = self._load_config(config_file)
        self.api_token = self.config.get('api_token')
        self.models = self.config.get('models', {})
        self.headers = {
            'Authorization': f'Token {self.api_token}',
            'Content-Type': 'application/json'
        }
    
    def _load_config(self, config_file):
        """Load configuration from JSON file"""
        try:
            with open(config_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Error: Config file '{config_file}' not found.")
            return {}
        except json.JSONDecodeError:
            print(f"Error: Invalid JSON in config file '{config_file}'.")
            return {}
    
    def _download_file(self, url, file_path):
        """Download a file from URL to the specified path"""
        try:
            response = requests.get(url, stream=True)
            response.raise_for_status()
            
            total_size = int(response.headers.get('content-length', 0))
            block_size = 1024  # 1 Kibibyte
            
            with open(file_path, 'wb') as f, tqdm(
                desc=f"Downloading {os.path.basename(file_path)}",
                total=total_size,
                unit='iB',
                unit_scale=True,
                unit_divisor=1024,
            ) as bar:
                for data in response.iter_content(block_size):
                    size = f.write(data)
                    bar.update(size)
            
            return True
        except Exception as e:
            print(f"Error downloading {url}: {e}")
            return False
    
    def _get_model_download_url(self, model_id):
        """Get the download URL for a model"""
        try:
            response = requests.get(
                f'https://api.sketchfab.com/v3/models/{model_id}/download',
                headers=self.headers
            )
            response.raise_for_status()
            return response.json().get('gltf', {}).get('url')
        except Exception as e:
            print(f"Error getting download URL for model {model_id}: {e}")
            return None
    
    def download_model(self, model_name, model_url, output_dir='models'):
        """Download a model from Sketchfab"""
        # Extract model ID from URL
        model_id = model_url.split('/')[-1].split('-')[-1]
        if not model_id:
            print(f"Invalid Sketchfab URL: {model_url}")
            return False
        
        print(f"Processing {model_name} (ID: {model_id})...")
        
        # Get download URL
        download_url = self._get_model_download_url(model_id)
        if not download_url:
            print(f"Could not get download URL for {model_name}")
            return False
        
        # Create output directory
        output_path = Path(output_dir) / model_name
        output_path.mkdir(parents=True, exist_ok=True)
        
        # Download the model
        output_file = output_path / 'scene.glb'
        success = self._download_file(download_url, output_file)
        
        if success:
            print(f"Successfully downloaded {model_name} to {output_file}")
        else:
            print(f"Failed to download {model_name}")
        
        return success
    
    def download_all_models(self):
        """Download all models specified in the config"""
        if not self.api_token or self.api_token == 'YOUR_SKETCHFAB_API_TOKEN':
            print("Error: Please set your Sketchfab API token in sketchfab_config.json")
            return False
        
        if not self.models:
            print("No models found in config")
            return False
        
        results = {}
        for model_name, model_url in self.models.items():
            success = self.download_model(model_name, model_url)
            results[model_name] = 'success' if success else 'failed'
        
        print("\nDownload summary:")
        for model_name, status in results.items():
            print(f"- {model_name}: {status}")
        
        return all(status == 'success' for status in results.values())

if __name__ == "__main__":
    downloader = SketchfabDownloader()
    downloader.download_all_models()
