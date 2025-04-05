"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const cache_manager_1 = require("@nestjs/cache-manager");
const weather_service_1 = require("./weather.service");
const cities_service_1 = require("../cities/cities.service");
describe('WeatherService', () => {
    let service;
    let citiesService;
    const mockCacheManager = {
        get: jest.fn(),
        set: jest.fn(),
    };
    const mockCitiesService = {
        getPopularCities: jest.fn(),
        getCityById: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            imports: [
                axios_1.HttpModule,
                config_1.ConfigModule.forRoot(),
            ],
            providers: [
                weather_service_1.WeatherService,
                {
                    provide: cities_service_1.CitiesService,
                    useValue: mockCitiesService,
                },
                {
                    provide: cache_manager_1.CACHE_MANAGER,
                    useValue: mockCacheManager,
                },
            ],
        }).compile();
        service = module.get(weather_service_1.WeatherService);
        citiesService = module.get(cities_service_1.CitiesService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('getCitiesWithWeather', () => {
        it('should return cached data if available', async () => {
            const mockCachedData = [
                {
                    id: 1,
                    name: 'Monterrey',
                    slug: 'monterrey',
                    state: 'Nuevo León',
                    country: 'Mexico',
                    lat: 25.6866,
                    long: -100.3161,
                    weather: {
                        temp: 25,
                        condition: 'Clear',
                        description: 'clear sky',
                        icon: '01d',
                    },
                },
            ];
            mockCacheManager.get.mockResolvedValue(mockCachedData);
            const result = await service.getCitiesWithWeather('monterrey');
            expect(result).toEqual(mockCachedData);
            expect(mockCacheManager.get).toHaveBeenCalledWith('cities_weather_monterrey');
        });
    });
    describe('getCityForecast', () => {
        it('should return cached forecast if available', async () => {
            const mockCachedForecast = {
                city: {
                    id: 1,
                    name: 'Monterrey',
                    state: 'Nuevo León',
                    country: 'Mexico',
                    lat: 25.6866,
                    long: -100.3161,
                },
                forecast: [
                    {
                        date: '2023-01-01',
                        temp_min: 20,
                        temp_max: 30,
                        conditions: ['Clear'],
                        descriptions: ['clear sky'],
                        icons: ['01d'],
                    },
                ],
            };
            mockCacheManager.get.mockResolvedValue(mockCachedForecast);
            const result = await service.getCityForecast('1');
            expect(result).toEqual(mockCachedForecast);
            expect(mockCacheManager.get).toHaveBeenCalledWith('city_forecast_1');
        });
    });
});
//# sourceMappingURL=weather.service.spec.js.map