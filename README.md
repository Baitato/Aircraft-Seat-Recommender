# Aircraft Seat Recommender with 3D Earth Visualization

A sophisticated web application that provides intelligent aircraft seat recommendations based on flight direction, time of day, and sun position, featuring a stunning 3D Earth visualization using Three.js with **8K ultra-resolution textures**.

## Features

### 🌍 3D Earth Visualization
- **Ultra-High Resolution Earth**: 8K textures from [Solar System Scope](https://www.solarsystemscope.com/textures/) for incredible detail
- **Realistic Earth Rendering**: Based on the [bobbyroe/threejs-earth](https://github.com/bobbyroe/threejs-earth) implementation
- **Larger Earth Size**: 50% larger Earth for better visibility and impact
- **Atmospheric Effects**: Fresnel shader for atmospheric glow
- **City Lights**: Visible on the night side of Earth with 8K resolution
- **Starfield**: Beautiful background star field
- **Interactive Controls**: Orbit controls for exploring the Earth
- **High-Detail Geometry**: Increased mesh detail for smoother surface

### ✈️ Intelligent Seat Recommendations
- **Flight Direction Analysis**: Calculates optimal seating based on flight path
- **Sun Position Tracking**: Considers sun exposure during flight
- **Time-of-Day Analysis**: Different recommendations for day/night/mixed flights
- **Long-Haul Considerations**: Special recommendations for extended flights
- **Comprehensive Airport Database**: 100+ major airports worldwide

### 🎯 Smart Features
- **Real-time Sun Position**: Updates based on departure time
- **Flight Path Visualization**: Shows route on 3D Earth
- **Multiple Recommendation Factors**: Side preference, window vs aisle, sun exposure
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Three.js**: 3D graphics and visualization
- **WebGL**: Hardware-accelerated rendering
- **Custom Shaders**: Atmospheric effects and lighting
- **Vanilla JavaScript**: Modern ES6+ features
- **HTML5/CSS3**: Responsive UI design
- **8K Textures**: Ultra-high resolution Earth textures

## Installation

1. **Clone or download** the project files
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm start
   ```
4. **Open your browser** and navigate to `http://localhost:5175`

## Usage

### Getting Seat Recommendations

1. **Enter Flight Details**:
   - **Source**: Enter departure city (e.g., "New York", "London", "Tokyo")
   - **Destination**: Enter arrival city
   - **Departure Time**: Select date and time
   - **Flight Duration**: Enter flight duration in hours

2. **Get Recommendations**: Click "Get Recommendations" to analyze your flight

3. **View Results**: The application will display:
   - Optimal seat side (left/right)
   - Window vs aisle recommendations
   - Reasoning for each recommendation
   - Flight path visualization on the 3D Earth

### 3D Earth Interaction

- **Rotate**: Click and drag to rotate the Earth
- **Zoom**: Scroll to zoom in/out (enhanced range for larger Earth)
- **Auto-rotation**: Earth automatically rotates for dynamic viewing
- **Flight Path**: Red line shows your flight route when recommendations are generated

## How It Works

### Seat Recommendation Algorithm

The application analyzes multiple factors to provide optimal seat recommendations:

1. **Flight Direction**: Calculates bearing from source to destination
2. **Sun Position**: Determines sun exposure during flight
3. **Time Analysis**: Considers departure and arrival times
4. **Duration**: Factors in flight length for comfort considerations
5. **Seasonal Effects**: Accounts for Earth's axial tilt and seasonal changes

### 3D Earth Implementation

- **Geometry**: High-detail icosahedron (16 subdivisions) for ultra-smooth Earth surface
- **8K Textures**: Ultra-resolution Earth textures from [Solar System Scope](https://www.solarsystemscope.com/textures/)
- **Larger Size**: 50% larger Earth (1.5x scale) for better visibility
- **Materials**: Multiple material layers (surface, lights, atmosphere)
- **Lighting**: Dynamic sun positioning and atmospheric scattering
- **Shaders**: Custom fresnel shader for atmospheric glow

### High-Resolution Textures

The application uses **8K ultra-resolution Earth textures** from [Solar System Scope](https://www.solarsystemscope.com/textures/):

- **Earth Day Map**: 8K resolution for incredible surface detail
- **Earth Night Map**: 8K resolution for beautiful city lights
- **Enhanced Detail**: 16x geometry subdivisions for smooth surface
- **Professional Quality**: Based on NASA Blue Marble data

## Airport Database

The application includes a comprehensive database of major airports worldwide:

- **100+ Airports**: Major international hubs
- **Global Coverage**: All continents represented
- **Accurate Coordinates**: Precise latitude/longitude data
- **City Matching**: Flexible search by city name or airport code

## Credits

- **8K Earth Textures**: Courtesy of [Solar System Scope](https://www.solarsystemscope.com/textures/) under CC Attribution 4.0 license
- **Three.js**: 3D graphics library by [mrdoob](https://github.com/mrdoob)

## Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile Browsers**: Responsive design with touch controls

## Performance

- **Optimized Rendering**: Efficient WebGL implementation
- **Responsive Controls**: Smooth interaction on all devices
- **Memory Efficient**: Proper resource management
- **Fast Loading**: Optimized texture loading and caching
- **8K Texture Support**: High-resolution textures for premium experience

## Future Enhancements

- **Weather Integration**: Real-time weather data for flight conditions
- **Aircraft Type**: Specific recommendations based on aircraft model
- **Seasonal Adjustments**: More accurate sun position calculations
- **Flight Tracking**: Real-time flight status integration
- **Mobile App**: Native mobile application
- **4K/8K Video Export**: High-resolution flight path videos

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

---

**Enjoy your flight!** ✈️🌍 