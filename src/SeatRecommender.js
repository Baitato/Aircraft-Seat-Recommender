export class SeatRecommender {
    constructor() {
        this.recommendations = [];
    }

    getRecommendations(sourceAirport, destAirport, departureTime, flightDuration) {
        this.recommendations = [];
        
        // Calculate flight direction
        const flightDirection = this.calculateFlightDirection(sourceAirport, destAirport);
        
        // Calculate sun position during flight
        const sunAnalysis = this.analyzeSunPosition(departureTime, flightDuration, sourceAirport, destAirport);
        
        // Generate recommendations based on analysis
        this.generateRecommendations(flightDirection, sunAnalysis, flightDuration);
        
        return this.recommendations;
    }

    calculateFlightDirection(source, destination) {
        // Calculate bearing from source to destination
        const lat1 = this.toRadians(source.latitude);
        const lat2 = this.toRadians(destination.latitude);
        const deltaLng = this.toRadians(destination.longitude - source.longitude);
        
        const y = Math.sin(deltaLng) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
        const bearing = this.toDegrees(Math.atan2(y, x));
        
        // Normalize to 0-360
        const normalizedBearing = (bearing + 360) % 360;
        
        return {
            degrees: normalizedBearing,
            direction: this.getDirectionName(normalizedBearing)
        };
    }

    analyzeSunPosition(departureTime, flightDuration, source, destination) {
        const departureDate = new Date(departureTime);
        const arrivalTime = new Date(departureDate.getTime() + flightDuration * 60 * 60 * 1000);
        
        // Calculate sun position at departure and arrival
        const departureSunPos = this.calculateSunPosition(departureDate, source);
        const arrivalSunPos = this.calculateSunPosition(arrivalTime, destination);
        
        // Calculate mid-flight sun position
        const midFlightTime = new Date(departureDate.getTime() + (flightDuration * 60 * 60 * 1000) / 2);
        const midFlightSunPos = this.calculateSunPosition(midFlightTime, this.getMidPoint(source, destination));
        
        return {
            departure: departureSunPos,
            arrival: arrivalSunPos,
            midFlight: midFlightSunPos,
            flightDuration: flightDuration
        };
    }

    calculateSunPosition(date, location) {
        // Simplified sun position calculation
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const timeOfDay = hours + minutes / 60;
        
        // Calculate sun azimuth (simplified)
        let azimuth;
        if (timeOfDay < 6) {
            azimuth = 90 - (6 - timeOfDay) * 15;
        } else if (timeOfDay < 18) {
            azimuth = 90 + (timeOfDay - 6) * 15;
        } else {
            azimuth = 270 + (timeOfDay - 18) * 15;
        }
        
        // Calculate sun elevation
        let elevation;
        if (timeOfDay < 6 || timeOfDay > 18) {
            elevation = 0;
        } else {
            const noon = 12;
            const maxElevation = 60;
            elevation = maxElevation * Math.cos(Math.abs(timeOfDay - noon) * Math.PI / 12);
        }
        
        return {
            azimuth: azimuth,
            elevation: elevation,
            timeOfDay: timeOfDay,
            isDaytime: timeOfDay >= 6 && timeOfDay <= 18
        };
    }

    getMidPoint(source, destination) {
        return {
            latitude: (source.latitude + destination.latitude) / 2,
            longitude: (source.longitude + destination.longitude) / 2
        };
    }

    generateRecommendations(flightDirection, sunAnalysis, flightDuration) {
        const { departure, arrival, midFlight } = sunAnalysis;
        const isLongHaul = flightDuration > 6;
        const sunExposure = this.analyzeSunExposure(flightDirection, sunAnalysis);
        
        if (sunExposure.leftSideExposed) {
            this.addRecommendation(
                'Left',
                'Window seat on the right side',
                `The left side of the aircraft will be exposed to direct sunlight for ${Math.round(sunExposure.leftSideExposed * 100)}% of the flight. Choose the right side for better comfort.`
            );
        }
        
        if (sunExposure.rightSideExposed) {
            this.addRecommendation(
                'Right',
                'Window seat on the left side',
                `The right side of the aircraft will be exposed to direct sunlight for ${Math.round(sunExposure.rightSideExposed * 100)}% of the flight. Choose the left side for better comfort.`
            );
        }
        
        if (departure.isDaytime && arrival.isDaytime) {
            this.addRecommendation(
                'Day Flight',
                'Aisle seat preferred',
                'Both departure and arrival are during daylight hours. Aisle seats provide better access and comfort for long flights.'
            );
        } else if (!departure.isDaytime && !arrival.isDaytime) {
            this.addRecommendation(
                'Night Flight',
                'Window seat preferred',
                'Night flight - window seats allow you to see city lights and stars, and provide a surface to lean against for sleep.'
            );
        } else {
            this.addRecommendation(
                'Mixed Day/Night',
                'Window seat on the darker side',
                'Flight crosses day/night boundary. Choose the side that will be in shadow for most of the flight.'
            );
        }
        
        if (flightDirection.direction.includes('East')) {
            this.addRecommendation(
                'Eastbound',
                'Window seat on the left side',
                'Eastbound flights often have better views of sunrise and landscapes. Left side provides better views when flying north-south.'
            );
        } else if (flightDirection.direction.includes('West')) {
            this.addRecommendation(
                'Westbound',
                'Window seat on the right side',
                'Westbound flights offer sunset views. Right side provides better views when flying north-south.'
            );
        }
        
        if (isLongHaul) {
            this.addRecommendation(
                'Long Haul',
                'Aisle seat for mobility',
                `Long flight duration (${flightDuration}h) - aisle seats provide easier access to restrooms and allow stretching without disturbing others.`
            );
        }
        
        if (midFlight.elevation > 30) {
            this.addRecommendation(
                'High Sun',
                'Shaded side preferred',
                'Mid-flight sun will be high in the sky. Choose the side that will be in shadow based on flight direction.'
            );
        }
    }

    analyzeSunExposure(flightDirection, sunAnalysis) {
        const { midFlight } = sunAnalysis;
        const direction = flightDirection.degrees;
        
        let leftSideExposed = 0;
        let rightSideExposed = 0;
        
        if (direction >= 0 && direction < 90) {
            if (midFlight.azimuth > 180 && midFlight.azimuth < 360) {
                leftSideExposed = 0.7;
                rightSideExposed = 0.3;
            } else {
                leftSideExposed = 0.3;
                rightSideExposed = 0.7;
            }
        } else if (direction >= 90 && direction < 180) {
            if (midFlight.azimuth > 0 && midFlight.azimuth < 180) {
                leftSideExposed = 0.7;
                rightSideExposed = 0.3;
            } else {
                leftSideExposed = 0.3;
                rightSideExposed = 0.7;
            }
        } else if (direction >= 180 && direction < 270) {
            if (midFlight.azimuth > 0 && midFlight.azimuth < 180) {
                leftSideExposed = 0.3;
                rightSideExposed = 0.7;
            } else {
                leftSideExposed = 0.7;
                rightSideExposed = 0.3;
            }
        } else {
            if (midFlight.azimuth > 180 && midFlight.azimuth < 360) {
                leftSideExposed = 0.3;
                rightSideExposed = 0.7;
            } else {
                leftSideExposed = 0.7;
                rightSideExposed = 0.3;
            }
        }
        
        return {
            leftSideExposed: leftSideExposed,
            rightSideExposed: rightSideExposed
        };
    }

    addRecommendation(seatSide, recommendation, reason) {
        this.recommendations.push({
            seatSide: seatSide,
            recommendation: recommendation,
            reason: reason
        });
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    toDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    getDirectionName(bearing) {
        const directions = [
            'North', 'Northeast', 'East', 'Southeast',
            'South', 'Southwest', 'West', 'Northwest'
        ];
        const index = Math.round(bearing / 45) % 8;
        return directions[index];
    }
} 