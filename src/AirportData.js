export class AirportData {
    constructor() {
        this.airports = [];
        this.loaded = false;
    }

    async loadAirports() {
        if (this.loaded) return;

        try {
            // Major airports dataset
            this.airports = [
                // North America
                { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA', latitude: 40.6413, longitude: -73.7781 },
                { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'USA', latitude: 33.9416, longitude: -118.4085 },
                { code: 'ORD', name: "O'Hare International Airport", city: 'Chicago', country: 'USA', latitude: 41.9786, longitude: -87.9048 },
                { code: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas', country: 'USA', latitude: 32.8968, longitude: -97.0380 },
                { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', country: 'USA', latitude: 33.6407, longitude: -84.4277 },
                { code: 'DEN', name: 'Denver International Airport', city: 'Denver', country: 'USA', latitude: 39.8561, longitude: -104.6737 },
                { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'USA', latitude: 37.7749, longitude: -122.4194 },
                { code: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'USA', latitude: 25.7932, longitude: -80.2906 },
                { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada', latitude: 43.6777, longitude: -79.6248 },
                { code: 'YVR', name: 'Vancouver International Airport', city: 'Vancouver', country: 'Canada', latitude: 49.1967, longitude: -123.1815 },
                { code: 'MEX', name: 'Mexico City International Airport', city: 'Mexico City', country: 'Mexico', latitude: 19.4363, longitude: -99.0721 },

                // Europe
                { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'UK', latitude: 51.4700, longitude: -0.4543 },
                { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', latitude: 49.0097, longitude: 2.5479 },
                { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', latitude: 50.0379, longitude: 8.5622 },
                { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', latitude: 52.3105, longitude: 4.7683 },
                { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas Airport', city: 'Madrid', country: 'Spain', latitude: 40.4983, longitude: -3.5676 },
                { code: 'FCO', name: 'Leonardo da Vinci International Airport', city: 'Rome', country: 'Italy', latitude: 41.8045, longitude: 12.2508 },
                { code: 'BCN', name: 'Barcelona–El Prat Airport', city: 'Barcelona', country: 'Spain', latitude: 41.2974, longitude: 2.0833 },
                { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany', latitude: 48.3538, longitude: 11.7861 },
                { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', latitude: 47.4588, longitude: 8.5559 },
                { code: 'VIE', name: 'Vienna International Airport', city: 'Vienna', country: 'Austria', latitude: 48.1102, longitude: 16.5697 },
                { code: 'ARN', name: 'Stockholm Arlanda Airport', city: 'Stockholm', country: 'Sweden', latitude: 59.6498, longitude: 17.9238 },
                { code: 'OSL', name: 'Oslo Airport', city: 'Oslo', country: 'Norway', latitude: 60.1975, longitude: 11.1004 },
                { code: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark', latitude: 55.6180, longitude: 12.6508 },
                { code: 'HEL', name: 'Helsinki Airport', city: 'Helsinki', country: 'Finland', latitude: 60.3172, longitude: 24.9633 },

                // Asia
                { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', latitude: 35.7720, longitude: 140.3929 },
                { code: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan', latitude: 35.5494, longitude: 139.7798 },
                { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea', latitude: 37.4602, longitude: 126.4407 },
                { code: 'PEK', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China', latitude: 40.0799, longitude: 116.6031 },
                { code: 'PVG', name: 'Shanghai Pudong International Airport', city: 'Shanghai', country: 'China', latitude: 31.1443, longitude: 121.8083 },
                { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'China', latitude: 22.3080, longitude: 113.9185 },
                { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', latitude: 1.3644, longitude: 103.9915 },
                { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', latitude: 13.6900, longitude: 100.7501 },
                { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'India', latitude: 28.5562, longitude: 77.1000 },
                { code: 'BOM', name: 'Chhatrapati Shivaji International Airport', city: 'Mumbai', country: 'India', latitude: 19.0896, longitude: 72.8656 },
                { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore', country: 'India', latitude: 13.1986, longitude: 77.7066 },
                { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', country: 'India', latitude: 12.9941, longitude: 80.1709 },
                { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia', latitude: 2.7456, longitude: 101.7072 },
                { code: 'CGK', name: 'Soekarno–Hatta International Airport', city: 'Jakarta', country: 'Indonesia', latitude: -6.1256, longitude: 106.6558 },
                { code: 'MNL', name: 'Ninoy Aquino International Airport', city: 'Manila', country: 'Philippines', latitude: 14.5086, longitude: 121.0198 },
                { code: 'HAN', name: 'Noi Bai International Airport', city: 'Hanoi', country: 'Vietnam', latitude: 21.2212, longitude: 105.8072 },
                { code: 'SGN', name: 'Tan Son Nhat International Airport', city: 'Ho Chi Minh City', country: 'Vietnam', latitude: 10.8188, longitude: 106.6520 },

                // Middle East
                { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', latitude: 25.2532, longitude: 55.3657 },
                { code: 'AUH', name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', country: 'UAE', latitude: 24.4331, longitude: 54.6511 },
                { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar', latitude: 25.2730, longitude: 51.6081 },
                { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', latitude: 41.2751, longitude: 28.7519 },
                { code: 'TLV', name: 'Ben Gurion Airport', city: 'Tel Aviv', country: 'Israel', latitude: 32.0114, longitude: 34.8867 },
                { code: 'RUH', name: 'King Khalid International Airport', city: 'Riyadh', country: 'Saudi Arabia', latitude: 24.9578, longitude: 46.6989 },
                { code: 'JED', name: 'King Abdulaziz International Airport', city: 'Jeddah', country: 'Saudi Arabia', latitude: 21.6805, longitude: 39.1565 },

                // Africa
                { code: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt', latitude: 30.1219, longitude: 31.4056 },
                { code: 'JNB', name: 'O. R. Tambo International Airport', city: 'Johannesburg', country: 'South Africa', latitude: -26.1392, longitude: 28.2460 },
                { code: 'CPT', name: 'Cape Town International Airport', city: 'Cape Town', country: 'South Africa', latitude: -33.9715, longitude: 18.6021 },
                { code: 'NBO', name: 'Jomo Kenyatta International Airport', city: 'Nairobi', country: 'Kenya', latitude: -1.3192, longitude: 36.9278 },
                { code: 'LAG', name: 'Murtala Muhammed International Airport', city: 'Lagos', country: 'Nigeria', latitude: 6.5774, longitude: 3.3210 },
                { code: 'CMN', name: 'Mohammed V International Airport', city: 'Casablanca', country: 'Morocco', latitude: 33.5731, longitude: -7.5898 },

                // Oceania
                { code: 'SYD', name: 'Sydney Airport', city: 'Sydney', country: 'Australia', latitude: -33.9399, longitude: 151.1753 },
                { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia', latitude: -37.8136, longitude: 144.9631 },
                { code: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', country: 'Australia', latitude: -27.3842, longitude: 153.1175 },
                { code: 'PER', name: 'Perth Airport', city: 'Perth', country: 'Australia', latitude: -31.9404, longitude: 115.9668 },
                { code: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand', latitude: -37.0082, longitude: 174.7850 },
                { code: 'WLG', name: 'Wellington Airport', city: 'Wellington', country: 'New Zealand', latitude: -41.3272, longitude: 174.8053 },

                // South America
                { code: 'GRU', name: 'São Paulo/Guarulhos International Airport', city: 'São Paulo', country: 'Brazil', latitude: -23.4356, longitude: -46.4731 },
                { code: 'GIG', name: 'Rio de Janeiro/Galeão International Airport', city: 'Rio de Janeiro', country: 'Brazil', latitude: -22.8089, longitude: -43.2496 },
                { code: 'EZE', name: 'Ministro Pistarini International Airport', city: 'Buenos Aires', country: 'Argentina', latitude: -34.8222, longitude: -58.5358 },
                { code: 'SCL', name: 'Arturo Merino Benítez International Airport', city: 'Santiago', country: 'Chile', latitude: -33.3928, longitude: -70.7858 },
                { code: 'LIM', name: 'Jorge Chávez International Airport', city: 'Lima', country: 'Peru', latitude: -12.0219, longitude: -77.1143 },
                { code: 'BOG', name: 'El Dorado International Airport', city: 'Bogotá', country: 'Colombia', latitude: 4.7016, longitude: -74.1469 },
                { code: 'CCS', name: 'Simón Bolívar International Airport', city: 'Caracas', country: 'Venezuela', latitude: 10.6031, longitude: -66.9910 }
            ];

            this.loaded = true;
        } catch (error) {
            console.error('Error loading airport data:', error);
            throw error;
        }
    }

    findAirportByCity(cityName) {
        if (!this.loaded) {
            console.warn('Airport data not loaded yet');
            return null;
        }

        const normalizedCityName = cityName.toLowerCase().trim();
        
        // First try exact match
        let airport = this.airports.find(airport => 
            airport.city.toLowerCase() === normalizedCityName
        );
        
        if (airport) return airport;
        
        // Try partial match
        airport = this.airports.find(airport => 
            airport.city.toLowerCase().includes(normalizedCityName) ||
            normalizedCityName.includes(airport.city.toLowerCase())
        );
        
        if (airport) return airport;
        
        // Try airport code
        airport = this.airports.find(airport => 
            airport.code.toLowerCase() === normalizedCityName
        );
        
        return airport || null;
    }

    findAirportByCode(code) {
        if (!this.loaded) return null;
        
        const normalizedCode = code.toUpperCase().trim();
        
        return this.airports.find(airport => 
            airport.code === normalizedCode
        ) || null;
    }

    searchAirports(query) {
        if (!this.loaded) return [];
        
        const normalizedQuery = query.toLowerCase().trim();
        
        return this.airports.filter(airport => 
            airport.city.toLowerCase().includes(normalizedQuery) ||
            airport.name.toLowerCase().includes(normalizedQuery) ||
            airport.code.toLowerCase().includes(normalizedQuery) ||
            airport.country.toLowerCase().includes(normalizedQuery)
        );
    }

    getAllAirports() {
        return this.airports;
    }

    getAirportsByCountry(country) {
        if (!this.loaded) return [];
        
        const normalizedCountry = country.toLowerCase().trim();
        
        return this.airports.filter(airport => 
            airport.country.toLowerCase() === normalizedCountry
        );
    }

    getMajorAirports() {
        // Return airports from major cities
        const majorCities = [
            'New York', 'London', 'Paris', 'Tokyo', 'Beijing', 'Shanghai',
            'Los Angeles', 'Chicago', 'Dubai', 'Singapore', 'Hong Kong',
            'Sydney', 'Toronto', 'Mumbai', 'Delhi', 'São Paulo', 'Moscow'
        ];
        
        return this.airports.filter(airport => 
            majorCities.includes(airport.city)
        );
    }
} 