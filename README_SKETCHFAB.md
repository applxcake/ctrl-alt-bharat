# Downloading 3D Models from Sketchfab

This guide explains how to download 3D models of Indian heritage sites from Sketchfab for use in the AR experience.

## Prerequisites

1. **Sketchfab Account**: Create a free account at [Sketchfab](https://sketchfab.com/signup)
2. **API Token**: Get your API token from [Sketchfab Account Settings](https://sketchfab.com/settings/password)

## Setup

1. Update the `sketchfab_config.json` file with your API token and model URLs:
   ```json
   {
       "api_token": "YOUR_SKETCHFAB_API_TOKEN",
       "models": {
           "taj_mahal": "https://sketchfab.com/3d-models/taj-mahal-7d8d6b3e3d3b4e3e8e3e3e3e3e3e3e3e",
           "hampi": "https://sketchfab.com/3d-models/hampi-virupaksha-temple-3d-model-8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c",
           "khajuraho": "https://sketchfab.com/3d-models/khajuraho-temple-9d9d9d9d9d9d9d9d9d9d9d9d9d9d9d9d",
           "konark": "https://sketchfab.com/3d-models/konark-sun-temple-1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a"
       }
   }
   ```

2. Install required Python packages:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install requests tqdm
   ```

## Finding Free 3D Models

1. Visit [Sketchfab](https://sketchfab.com/) and search for the heritage site (e.g., "Taj Mahal")
2. Filter by "Downloadable" and "Free"
3. Click on a model and copy its URL
4. Update the `sketchfab_config.json` with the new URL

## Downloading Models

Run the download script:
```bash
python download_sketchfab_models.py
```

The script will download the models to their respective directories in the `models` folder.

## Model Requirements

- Format: GLB (preferred) or GLTF
- File name: `scene.glb` in each site's directory
- Size: Optimized for mobile devices (under 5MB per model)
- Textures: Should be embedded in the GLB file

## Troubleshooting

- **API Token Issues**: Make sure your token is correct and has download permissions
- **Model Not Found**: Check if the model URL is still valid
- **Download Errors**: Some models might have restrictions on downloads

## Alternative Sources

If you can't find suitable models on Sketchfab, try these alternatives:
- [Poly Haven](https://polyhaven.com/)
- [Clara.io](https://clara.io/)
- [TurboSquid](https://www.turbosquid.com/) (check license terms)
- [CGTrader](https://www.cgtrader.com/) (check license terms)
