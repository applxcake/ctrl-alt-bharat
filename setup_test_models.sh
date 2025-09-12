#!/bin/bash

# Create model directories and symlinks for test models

MODELS_DIR="models"
SIMPLE_MODEL="simple_box.glb"

# Create directories and symlinks for each site
for site in "taj_mahal" "hampi" "khajuraho" "konark"; do
    # Create site directory if it doesn't exist
    mkdir -p "$MODELS_DIR/$site"
    
    # Create symlink to the simple model
    ln -sf "../$SIMPLE_MODEL" "$MODELS_DIR/$site/scene.glb"
    
    echo "Created symlink for $site"
done

echo "Test models setup complete!"
