// Import Three.js for development (npm)
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import getStarfield from "./getStarfield.js";
import { getFresnelMat } from "./getFresnelMat.js";
import { SeatRecommender } from "./SeatRecommender.js";
import { AirportData } from "./AirportData.js";

class AircraftSeatRecommender {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.earthGroup = null;
        this.earthMesh = null;
        this.lightsMesh = null;
        this.glowMesh = null;
        this.stars = null;
        this.sunLight = null;
        this.seatRecommender = null;
        this.airportData = null;
        this.currentFlightPath = null;
        this.sourceMarker = null;
        this.destMarker = null;
        
        this.init();
    }

    async init() {
        // Initialize Three.js scene
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupControls();
        this.createEarth();
        this.createStars();
        this.createLighting();
        
        // Initialize components
        this.seatRecommender = new SeatRecommender();
        this.airportData = new AirportData();
        
        // Load airport data for search functionality
        await this.airportData.loadAirports();
        
        // Initialize search functionality with airport data
        if (window.setAirports) {
            window.setAirports(this.airportData.getAllAirports());
            this.setupSearchFunctionality();
        }
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start animation loop
        this.animate();
        
        // Set default departure time to current time
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        document.getElementById('departure-time').value = now.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000011);
    }

    setupCamera() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
        this.camera.position.z = 3.5;
    }

    setupRenderer() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const canvas = document.getElementById('earth-canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true 
        });
        this.renderer.setSize(w, h);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 2.5;
        this.controls.maxDistance = 15;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
    }

    createEarth() {
        // Create Earth group with axial tilt
        this.earthGroup = new THREE.Group();
        this.earthGroup.rotation.z = -23.4 * Math.PI / 180; // Earth's axial tilt
        this.scene.add(this.earthGroup);

        // Increased detail for higher resolution textures
        const detail = 16; // Increased from 12 to 16 for smoother surface
        const loader = new THREE.TextureLoader();
        const geometry = new THREE.IcosahedronGeometry(1.5, detail); // Increased size from 1 to 1.5

        // Earth surface material with 8K textures
        const material = new THREE.MeshPhongMaterial({
            map: loader.load("./textures-ultra/earth_day_8k.jpg"),
            specularMap: loader.load("./textures/02_earthspec1k.jpg"), // Keep 1K specular for now
            bumpMap: loader.load("./textures/01_earthbump1k.jpg"), // Keep 1K bump for now
            bumpScale: 0.04,
        });
        this.earthMesh = new THREE.Mesh(geometry, material);
        this.earthGroup.add(this.earthMesh);

        // City lights material with 8K night texture
        const lightsMat = new THREE.MeshBasicMaterial({
            map: loader.load("./textures-ultra/earth_night_8k.jpg"),
            blending: THREE.AdditiveBlending,
        });
        this.lightsMesh = new THREE.Mesh(geometry, lightsMat);
        this.earthGroup.add(this.lightsMesh);

        // Atmospheric glow
        const fresnelMat = getFresnelMat();
        this.glowMesh = new THREE.Mesh(geometry, fresnelMat);
        this.glowMesh.scale.setScalar(1.01);
        this.earthGroup.add(this.glowMesh);
    }

    createStars() {
        this.stars = getStarfield({numStars: 2000});
        this.scene.add(this.stars);
    }

    createLighting() {
        // Sun light
        this.sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
        this.sunLight.position.set(-2, 0.5, 1.5);
        this.scene.add(this.sunLight);

        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Update controls
        this.controls.update();

        // Rotate the entire Earth group (including markers and flight paths)
        this.earthGroup.rotation.y += 0.002;
        this.stars.rotation.y -= 0.0002;

        // Debug: Log Earth rotation and marker positions every 100 frames
        if (Math.floor(Date.now() / 100) % 100 === 0) {
            console.log('Earth group rotation Y:', this.earthGroup.rotation.y);
            if (this.sourceMarker) {
                console.log('Source marker world position:', this.sourceMarker.getWorldPosition(new THREE.Vector3()));
            }
            if (this.destMarker) {
                console.log('Dest marker world position:', this.destMarker.getWorldPosition(new THREE.Vector3()));
            }
        }

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }

    async getRecommendations() {
        const source = document.getElementById('source').value.trim();
        const destination = document.getElementById('destination').value.trim();
        const departureTimeInput = document.getElementById('departure-time').value;
        const flightDuration = parseFloat(document.getElementById('flight-duration').value);

        if (!source || !destination || !departureTimeInput || !flightDuration) {
            alert('Please fill in all fields');
            return;
        }

        // Show loading
        document.getElementById('loading').style.display = 'block';

        try {
            // Find airports
            const sourceAirport = this.airportData.findAirportByCity(source);
            const destAirport = this.airportData.findAirportByCity(destination);

            if (!sourceAirport || !destAirport) {
                alert('Airport not found. Please check city names.');
                return;
            }

            // Parse departure time from the calendar input
            let departureTime;
            if (departureTimeInput.includes(',')) {
                // Format: "Jun 29, 2024, 11:30 PM"
                departureTime = new Date(departureTimeInput).toISOString().slice(0, 16);
            } else {
                // Fallback to original format
                departureTime = departureTimeInput;
            }

            // Calculate flight path
            const earthRadius = 1.5;
            const sourcePos = this.latLngTo3D(sourceAirport.latitude, sourceAirport.longitude, earthRadius);
            const destPos = this.latLngTo3D(destAirport.latitude, destAirport.longitude, earthRadius);
            
            // Create flight path with higher arch to avoid surface glitching
            const flightPath = this.calculateFlightPath(sourceAirport, destAirport);
            console.log('Calculated flight path points:', flightPath);
            
            // Remove previous flight path
            if (this.currentFlightPath) {
                this.earthGroup.remove(this.currentFlightPath);
                console.log('Removed previous flight path');
            }
            
            // Add new flight path to the earth group so it rotates with the Earth
            this.currentFlightPath = this.createFlightPath(flightPath);
            console.log('Created flight path object:', this.currentFlightPath);
            
            this.earthGroup.add(this.currentFlightPath);
            console.log('Added new flight path to earthGroup');
            console.log('Earth group children count after adding flight path:', this.earthGroup.children.length);
            console.log('Current flight path object:', this.currentFlightPath);
            console.log('Earth group:', this.earthGroup);

            // Add visible markers at source and destination
            this.addCityMarkers(sourceAirport, destAirport);

            // Get seat recommendations
            const recommendations = this.seatRecommender.getRecommendations(
                sourceAirport,
                destAirport,
                departureTime,
                flightDuration
            );

            // Display recommendations
            this.displayRecommendations(recommendations);

            // Update sun position based on departure time
            this.updateSunPosition(departureTime);

        } catch (error) {
            console.error('Error getting recommendations:', error);
            alert('Error getting recommendations. Please try again.');
        } finally {
            document.getElementById('loading').style.display = 'none';
        }
    }

    calculateFlightPath(source, destination) {
        // Create a curved arch flight path that follows great circle distance
        const earthRadius = 1.5; // Match the Earth size
        
        // Convert lat/lng to 3D coordinates on Earth surface
        const sourcePos = this.latLngTo3D(source.latitude, source.longitude, earthRadius);
        const destPos = this.latLngTo3D(destination.latitude, destination.longitude, earthRadius);
        
        // Debug logging
        console.log('Source:', source.city, 'Lat:', source.latitude, 'Lng:', source.longitude, 'Pos:', sourcePos);
        console.log('Destination:', destination.city, 'Lat:', destination.latitude, 'Lng:', destination.longitude, 'Pos:', destPos);
        
        // Create a curved arch path using interpolation between the adjusted coordinates
        const pathPoints = [];
        const segments = 50; // Number of points along the path
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            
            // Interpolate latitude and longitude
            const lat = source.latitude + (destination.latitude - source.latitude) * t;
            const lng = source.longitude + (destination.longitude - source.longitude) * t;
            
            // Use the same coordinate conversion as spheres
            const point = this.latLngTo3D(lat, lng, earthRadius);
            
            // Add arch height
            const archHeight = 0.25; // Much higher arch to prevent surface glitching
            const archFactor = 4 * archHeight * t * (1 - t);
            const direction = point.clone().normalize();
            const finalPoint = point.clone().add(direction.multiplyScalar(archFactor));
            
            pathPoints.push(finalPoint);
        }
        
        return pathPoints;
    }

    latLngTo3D(lat, lng, radius) {
        // Convert latitude and longitude to 3D coordinates
        // Try swapping X and Z with offsets to match Earth texture coordinate system
        
        // Convert to radians
        const latRad = lat * Math.PI / 180;
        const lngRad = lng * Math.PI / 180;
        
        // Add offsets for both latitude and longitude
        // Change these values to experiment:
        const latOffset = 0; // Degrees (positive = north, negative = south)
        const lngOffset = -90; // Degrees (positive = east, negative = west)
        
        const adjustedLat = latRad + (latOffset * Math.PI / 180);
        const adjustedLng = lngRad + (lngOffset * Math.PI / 180);
        
        // Standard spherical coordinate system:
        // X: longitude (east-west)
        // Y: latitude (north-south) 
        // Z: depth (into/out of screen)
        
        const x = radius * Math.cos(adjustedLat) * Math.cos(adjustedLng);
        const y = radius * Math.sin(adjustedLat);
        const z = radius * Math.cos(adjustedLat) * Math.sin(adjustedLng);
        
        // Swap X and Z to match Earth texture coordinate system
        return new THREE.Vector3(z, y, x);
    }

    createFlightPath(pathPoints) {
        // Create a thicker tube geometry for the flight path with proper rendering priority
        const curve = new THREE.CatmullRomCurve3(pathPoints);
        const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.008, 8, false); // Thicker tube
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xffaa00, // Warmer, more elegant yellow
            transparent: true,
            opacity: 0.9,
            depthTest: false, // Disable depth testing to render on top
            depthWrite: false, // Don't write to depth buffer
            side: THREE.DoubleSide // Render both sides
        });
        const tube = new THREE.Mesh(tubeGeometry, material);
        
        // Set render order to ensure it renders after the Earth
        tube.renderOrder = 1;
        
        // Add some debugging
        console.log('Flight path tube created with arch points:', pathPoints);
        console.log('Tube geometry vertices:', tubeGeometry.attributes.position.count);
        console.log('Tube mesh:', tube);
        console.log('Tube material:', material);
        
        return tube;
    }

    updateSunPosition(departureTime) {
        // Parse the departure date and time
        const departureDate = new Date(departureTime);
        
        // Calculate the day of year (0-365)
        const startOfYear = new Date(departureDate.getFullYear(), 0, 0);
        const dayOfYear = Math.floor((departureDate - startOfYear) / (1000 * 60 * 60 * 24));
        
        // Calculate solar declination (how far north/south the sun is)
        // This approximates the sun's position relative to the equator
        const solarDeclination = 23.45 * Math.sin((2 * Math.PI / 365) * (dayOfYear - 80));
        
        // Calculate time of day in radians (0 = midnight, π = noon, 2π = midnight)
        const hours = departureDate.getHours();
        const minutes = departureDate.getMinutes();
        const timeOfDay = (hours + minutes / 60) * (2 * Math.PI / 24);
        
        // Earth's axial tilt (23.4 degrees)
        const earthTilt = 23.4 * Math.PI / 180;
        
        // Calculate sun position in 3D space
        // X: east-west position (longitude)
        // Y: north-south position (latitude) 
        // Z: distance from Earth center
        
        // Sun's distance from Earth (much larger than Earth radius)
        const sunDistance = 10;
        
        // Calculate sun position relative to Earth's tilted axis
        // First, calculate position in Earth's coordinate system
        const sunX = sunDistance * Math.cos(solarDeclination * Math.PI / 180) * Math.cos(timeOfDay);
        const sunY = sunDistance * Math.sin(solarDeclination * Math.PI / 180);
        const sunZ = sunDistance * Math.cos(solarDeclination * Math.PI / 180) * Math.sin(timeOfDay);
        
        // Apply Earth's axial tilt to the sun position
        // Rotate around Z-axis to account for Earth's tilt
        const tiltedSunX = sunX * Math.cos(earthTilt) - sunY * Math.sin(earthTilt);
        const tiltedSunY = sunX * Math.sin(earthTilt) + sunY * Math.cos(earthTilt);
        const tiltedSunZ = sunZ;
        
        // Set the sun light position
        this.sunLight.position.set(tiltedSunX, tiltedSunY, tiltedSunZ);
        
        // Debug logging
        console.log('=== SUN POSITION DEBUG ===');
        console.log('Departure date:', departureDate.toDateString());
        console.log('Day of year:', dayOfYear);
        console.log('Solar declination:', solarDeclination.toFixed(2) + '°');
        console.log('Time of day:', hours + ':' + minutes.toString().padStart(2, '0'));
        console.log('Sun position (tilted):', {
            x: tiltedSunX.toFixed(2),
            y: tiltedSunY.toFixed(2), 
            z: tiltedSunZ.toFixed(2)
        });
        console.log('=== END SUN DEBUG ===');
    }

    displayRecommendations(recommendations) {
        const container = document.getElementById('recommendations');
        
        // Clear previous recommendations but preserve the close button and title
        const closeButton = container.querySelector('.recommendations-close');
        const title = container.querySelector('h3');
        const defaultText = container.querySelector('p');
        
        container.innerHTML = '';
        
        // Restore the close button and title
        if (closeButton) container.appendChild(closeButton);
        if (title) container.appendChild(title);
        
        if (recommendations.length === 0) {
            const noRecs = document.createElement('p');
            noRecs.style.color = '#ccc';
            noRecs.textContent = 'No specific recommendations for this route.';
            container.appendChild(noRecs);
        } else {
            recommendations.forEach(rec => {
                const item = document.createElement('div');
                item.className = 'recommendation-item';
                
                item.innerHTML = `
                    <h4>${rec.seatSide} Side</h4>
                    <div class="seat-side">${rec.recommendation}</div>
                    <div class="reason">${rec.reason}</div>
                `;
                
                container.appendChild(item);
            });
        }

        // Automatically show the recommendations panel
        container.classList.add('show');
        
        // Also show the overlay on mobile
        const overlay = document.getElementById('mobile-overlay');
        if (overlay) {
            overlay.classList.add('show');
        }
    }

    setupSearchFunctionality() {
        // This function will be called from the HTML script
        if (typeof window.setupSearch === 'function') {
            window.setupSearch('source', 'source-results');
            window.setupSearch('destination', 'destination-results');
        }
    }

    addCityMarkers(sourceAirport, destAirport) {
        const earthRadius = 1.5;
        
        // Remove previous markers
        if (this.sourceMarker) {
            this.earthGroup.remove(this.sourceMarker);
        }
        if (this.destMarker) {
            this.earthGroup.remove(this.destMarker);
        }
        
        // Create source marker (green sphere) - much bigger
        const sourcePos = this.latLngTo3D(sourceAirport.latitude, sourceAirport.longitude, earthRadius);
        const sourceGeometry = new THREE.SphereGeometry(0.03, 16, 16); // Much bigger sphere
        const sourceMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ff88, // Softer green
            transparent: true,
            opacity: 0.9
        });
        this.sourceMarker = new THREE.Mesh(sourceGeometry, sourceMaterial);
        this.sourceMarker.position.copy(sourcePos);
        this.earthGroup.add(this.sourceMarker);
        
        // Create destination marker (blue sphere) - much bigger
        const destPos = this.latLngTo3D(destAirport.latitude, destAirport.longitude, earthRadius);
        const destGeometry = new THREE.SphereGeometry(0.03, 16, 16); // Much bigger sphere
        const destMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x4488ff, // Softer blue
            transparent: true,
            opacity: 0.9
        });
        this.destMarker = new THREE.Mesh(destGeometry, destMaterial);
        this.destMarker.position.copy(destPos);
        this.earthGroup.add(this.destMarker);
        
        console.log('=== COORDINATE DEBUG ===');
        console.log('Source airport:', sourceAirport.city);
        console.log('  Lat:', sourceAirport.latitude, 'Lng:', sourceAirport.longitude);
        console.log('  Calculated position:', sourcePos);
        console.log('  Expected location: Should be on Earth surface at these coordinates');
        console.log('Destination airport:', destAirport.city);
        console.log('  Lat:', destAirport.latitude, 'Lng:', destAirport.longitude);
        console.log('  Calculated position:', destPos);
        console.log('  Expected location: Should be on Earth surface at these coordinates');
        console.log('Earth group children count:', this.earthGroup.children.length);
        console.log('=== END DEBUG ===');
    }
}

// Initialize the application
const app = new AircraftSeatRecommender();

// Make getRecommendations function globally available
window.getRecommendations = () => app.getRecommendations();