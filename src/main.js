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
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start animation loop
        this.animate();
        
        // Set default departure time to current time
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        document.getElementById('departure-time').value = localDateTime;
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000011);
    }

    setupCamera() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
        this.camera.position.z = 7;
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

        // Rotate Earth layers at different speeds
        this.earthMesh.rotation.y += 0.002;
        this.lightsMesh.rotation.y += 0.002;
        this.glowMesh.rotation.y += 0.002;
        this.stars.rotation.y -= 0.0002;

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }

    async getRecommendations() {
        const source = document.getElementById('source').value.trim();
        const destination = document.getElementById('destination').value.trim();
        const departureTime = document.getElementById('departure-time').value;
        const flightDuration = parseFloat(document.getElementById('flight-duration').value);

        if (!source || !destination || !departureTime || !flightDuration) {
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

            // Calculate flight path
            const flightPath = this.calculateFlightPath(sourceAirport, destAirport);
            
            // Remove previous flight path
            if (this.currentFlightPath) {
                this.scene.remove(this.currentFlightPath);
            }
            
            // Add new flight path
            this.currentFlightPath = this.createFlightPath(flightPath);
            this.scene.add(this.currentFlightPath);

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
        // Convert lat/lng to 3D coordinates on Earth surface
        const earthRadius = 1.5; // Updated to match the larger Earth size
        const sourcePos = this.latLngTo3D(source.latitude, source.longitude, earthRadius);
        const destPos = this.latLngTo3D(destination.latitude, destination.longitude, earthRadius);

        // Create a great circle path
        const pathPoints = [];
        const steps = 100;
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const lat = source.latitude + (destination.latitude - source.latitude) * t;
            const lng = source.longitude + (destination.longitude - source.longitude) * t;
            const pos = this.latLngTo3D(lat, lng, earthRadius);
            pathPoints.push(pos);
        }

        return pathPoints;
    }

    latLngTo3D(lat, lng, radius) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const y = radius * Math.cos(phi);
        
        return new THREE.Vector3(x, y, z);
    }

    createFlightPath(pathPoints) {
        const geometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
        const material = new THREE.LineBasicMaterial({ 
            color: 0xff4444,
            linewidth: 2
        });
        return new THREE.Line(geometry, material);
    }

    updateSunPosition(departureTime) {
        // Update sun position based on departure time
        const departureDate = new Date(departureTime);
        const hours = departureDate.getHours();
        const minutes = departureDate.getMinutes();
        const timeOfDay = hours + minutes / 60;
        
        // Calculate sun position (simplified)
        const sunAngle = (timeOfDay - 6) * (Math.PI / 12); // 6 AM = 0, 6 PM = π
        const sunX = Math.cos(sunAngle) * 5;
        const sunY = Math.sin(sunAngle) * 5;
        
        this.sunLight.position.set(sunX, sunY, 0);
    }

    displayRecommendations(recommendations) {
        const container = document.getElementById('recommendations');
        
        // Clear previous recommendations
        const existingContent = container.querySelector('h3');
        container.innerHTML = '';
        container.appendChild(existingContent);
        
        if (recommendations.length === 0) {
            const noRecs = document.createElement('p');
            noRecs.style.color = '#ccc';
            noRecs.textContent = 'No specific recommendations for this route.';
            container.appendChild(noRecs);
            return;
        }

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
}

// Initialize the application
const app = new AircraftSeatRecommender();

// Make getRecommendations function globally available
window.getRecommendations = () => app.getRecommendations(); 