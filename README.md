# Technical Cut Visualization with Three.js and Angular

![Project Preview](https://via.placeholder.com/800x400?text=Technical+Cut+Visualization) <!-- Consider adding a real screenshot -->

A 3D visualization tool for displaying technical cuts on models in real-time using Three.js and Angular, compliant with ISO CSN 128-3 standards.

## Key Features

- 🎨 **Realtime Cut Visualization** using Three.js stencil buffer
- 📐 **ISO CSN 128-3 Compliant** technical cut display
- ⚡ **Angular-based** responsive UI
- 🖥️ **Interactive 3D Model** manipulation
- ✂️ **Precise Cutting Plane** controls

## Technologies Used

- [Three.js](https://threejs.org/) - 3D rendering library
- [Angular](https://angular.io/) - Frontend framework
- TypeScript - Type-safe JavaScript
- WebGL - Hardware-accelerated graphics

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SimonZanta/technicky-rez-technical-cut.git
   ```

2. Install dependencies:
```bash
npm install
```
3. Run the development server:
```bash
    ng serve
```
Open your browser at http://localhost:4200
## Usage

 - Load a 3D model (supported formats: .gltf, .obj, .stl)

 - Position the cutting plane using the interactive controls

 - View the technical cut in real-time

 - Adjust visualization parameters as needed

## Implementation Highlights

 - Stencil Buffer Technique: For precise real-time cuts without modifying geometry

 - Cut Surface Rendering: Compliant with ISO CSN 128-3 standards

 - Responsive Controls: Intuitive UI for manipulating cutting planes
