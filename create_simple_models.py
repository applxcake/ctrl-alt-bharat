import os
import numpy as np
from pathlib import Path
import trimesh

def create_simple_model(name, color, size=1.0):
    """Create a simple 3D model with a distinctive shape and color"""
    # Create a simple shape based on the heritage site
    if 'taj' in name.lower():
        # Dome shape for Taj Mahal
        mesh = trimesh.creation.icosphere(radius=size/2, subdivisions=2)
        mesh.vertices[:, 1] *= 0.5  # Flatten the dome
        mesh.visual.vertex_colors = [int(c * 255) for c in color]
    elif 'hampi' in name.lower():
        # Temple-like shape for Hampi
        base = trimesh.creation.box(extents=[size, size, size/3])
        top = trimesh.creation.cone(radius=size/2, height=size/2)
        top.apply_translation([0, 0, size/3 + size/4])
        mesh = trimesh.util.concatenate([base, top])
        mesh.visual.vertex_colors = [int(c * 255) for c in color]
    elif 'khajuraho' in name.lower():
        # Tower-like shape for Khajuraho
        base = trimesh.creation.box(extents=[size, size, size/2])
        middle = trimesh.creation.cylinder(radius=size/3, height=size/2)
        middle.apply_translation([0, 0, size/2 + size/4])
        top = trimesh.creation.cone(radius=size/4, height=size/2)
        top.apply_translation([0, 0, size/2 + size/2 + size/4])
        mesh = trimesh.util.concatenate([base, middle, top])
        mesh.visual.vertex_colors = [int(c * 255) for c in color]
    elif 'konark' in name.lower():
        # Wheel shape for Konark Sun Temple
        mesh = trimesh.creation.cylinder(radius=size/2, height=size/4)
        mesh.visual.vertex_colors = [int(c * 255) for c in color]
    else:
        # Default to a simple box
        mesh = trimesh.creation.box(extents=[size, size, size])
        mesh.visual.vertex_colors = [int(c * 255) for c in color]
    
    return mesh

def main():
    # Create models directory if it doesn't exist
    models_dir = Path("models")
    models_dir.mkdir(exist_ok=True)
    
    # Define models to create with their colors (RGB values 0-1)
    models = [
        {"name": "taj_mahal", "color": [0.95, 0.95, 0.95, 1.0]},  # White
        {"name": "hampi", "color": [0.83, 0.69, 0.22, 1.0]},     # Gold
        {"name": "khajuraho", "color": [0.55, 0.27, 0.07, 1.0]}, # Brown
        {"name": "konark", "color": [0.80, 0.36, 0.36, 1.0]}    # Indian Red
    ]
    
    # Create each model
    for model in models:
        print(f"Creating model for {model['name']}...")
        
        # Create model directory
        model_dir = models_dir / model["name"]
        model_dir.mkdir(exist_ok=True)
        
        # Create the 3D model
        mesh = create_simple_model(model["name"], model["color"])
        
        # Export as GLB
        output_path = model_dir / "scene.glb"
        mesh.export(output_path, file_type='glb')
        
        print(f"  -> Saved to {output_path}")
    
    print("\nAll models created successfully!")

if __name__ == "__main__":
    main()
