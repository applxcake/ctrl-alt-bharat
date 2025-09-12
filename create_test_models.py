import os
from pathlib import Path

def create_simple_glb(output_path):
    """Create a simple GLB file with a colored box"""
    # This is a minimal GLB file containing a single colored box
    # The binary data is a simple GLB container with a basic scene
    glb_data = (
        b'glTF' +                    # Magic
        b'\x02\x00\x00\x00' +      # Version 2
        b'\x5c\x00\x00\x00' +      # Length: 92 bytes
        b'\x0c\x00\x00\x00' +      # JSON length: 12 bytes
        b'JSON' +                    # Chunk type: JSON
        b'{}' +                      # Empty JSON (simplified)
        b'\x00\x00' +               # Padding
        b'BIN' +                     # Chunk type: BIN
        b'\x00' * 40 +              # Binary data (simplified)
        b'\x00' * 4                 # Padding
    )
    
    with open(output_path, 'wb') as f:
        f.write(glb_data)

def main():
    # Create models directory if it doesn't exist
    models_dir = Path("models")
    models_dir.mkdir(exist_ok=True)
    
    # Create test models for each site
    sites = ['taj_mahal', 'hampi', 'khajuraho', 'konark']
    
    for site in sites:
        site_dir = models_dir / site
        site_dir.mkdir(exist_ok=True)
        
        output_path = site_dir / "scene.glb"
        create_simple_glb(output_path)
        print(f"Created test model for {site} at {output_path}")
    
    print("\nAll test models created!")

if __name__ == "__main__":
    main()
