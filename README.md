# Indian Heritage AR Experience

An interactive Augmented Reality experience showcasing India's rich cultural heritage sites. This web-based AR application allows users to explore 3D models of famous Indian monuments and learn about their history and significance.

## Features

- **Interactive 3D Models**: View detailed 3D models of Indian heritage sites
- **Rich Information**: Learn about the history, architecture, and significance of each site
- **Mobile-Friendly**: Works on most modern smartphones with a camera
- **No App Required**: Runs directly in the web browser
- **Offline Support**: Works without an internet connection after first load

## Supported Heritage Sites

1. Taj Mahal
2. Hampi
3. Khajuraho Temples
4. Konark Sun Temple

## Setup Instructions

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A smartphone with a camera (for AR experience)
- A stable internet connection (for initial setup)

### Local Development

1. Clone this repository
2. Start a local server (Python 3 example):
   ```
   python -m http.server 8000
   ```
3. Open your browser and navigate to `http://localhost:8000`

### Using the AR Experience

1. Print out the marker images from the `markers` folder
2. Open the app on your mobile device
3. Point your camera at a marker to see the 3D model
4. Tap on the model to see detailed information

## Team

### Team Name: Ctrl+Alt+Bharat

#### Team Members:
- **Aditya** - Project Lead & Full Stack Developer
  - GitHub: [@applxcake](https://github.com/applxcake)
  
*Additional team members can be added here with their roles and contact information*

## How It Works

This application uses:
- [AR.js](https://ar-js-org.github.io/AR.js-Docs/) for augmented reality capabilities
- [A-Frame](https://aframe.io/) for 3D and VR experiences
- [Three.js](https://threejs.org/) for 3D rendering

## Adding New Heritage Sites

To add a new heritage site:

1. Add a new marker pattern to the `markers` directory
2. Add the 3D model to the `models` directory (in glTF/GLB format)
3. Update the `heritageSites` object in `js/main.js` with the new site's information

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- 3D models from [Sketchfab](https://sketchfab.com/)
- AR.js and A-Frame communities for their amazing open-source libraries
