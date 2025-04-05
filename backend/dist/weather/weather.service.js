"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WeatherService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const cities_service_1 = require("../cities/cities.service");
const cache_manager_1 = require("@nestjs/cache-manager");
const common_2 = require("@nestjs/common");
let WeatherService = WeatherService_1 = class WeatherService {
    constructor(httpService, citiesService, cacheManager) {
        this.httpService = httpService;
        this.citiesService = citiesService;
        this.cacheManager = cacheManager;
        this.logger = new common_1.Logger(WeatherService_1.name);
        this.weatherApiUrl = 'https://api.openweathermap.org/data/2.5';
        this.apiKey = '0eebd1fcf852d29ca0340c5c451d4c9a';
    }
    async getCitiesWithWeather(query = '') {
        const cacheKey = `cities_weather_${query}`;
        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) {
            this.logger.log('Returning cities with weather from cache');
            return cachedData;
        }
        try {
            const cities = await this.citiesService.getPopularCities(query);
            const citiesWithWeather = await Promise.all(cities.map(async (city) => {
                const weather = await this.getCurrentWeather(city.lat, city.long);
                return {
                    ...city,
                    weather: {
                        id: weather.id,
                        temp: weather.main.temp,
                        condition: weather.weather[0].main,
                        description: weather.weather[0].description,
                        icon: weather.weather[0].icon,
                    },
                };
            }));
            await this.cacheManager.set(cacheKey, citiesWithWeather, 1800000);
            return citiesWithWeather;
        }
        catch (error) {
            this.logger.error(`Failed to fetch cities with weather: ${error.message}`);
            throw error;
        }
    }
    async getCityForecast(cityId) {
        const cacheKey = `city_forecast_${cityId}`;
        const cachedForecast = await this.cacheManager.get(cacheKey);
        if (cachedForecast) {
            this.logger.log(`Returning forecast for city ${cityId} from cache`);
            return cachedForecast;
        }
        try {
            const forecast = await this.getWeatherForecastId(cityId);
            const dailyForecasts = this.processForecastData(forecast);
            const result = {
                forecast: dailyForecasts,
            };
            await this.cacheManager.set(cacheKey, result, 1800000);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to fetch forecast for city ${cityId}: ${error.message}`);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch weather forecast: ${error.message}`);
        }
    }
    async getCurrentWeather(lat, lon) {
        const cacheKey = `current_weather_${lat}_${lon}`;
        const cachedWeather = await this.cacheManager.get(cacheKey);
        if (cachedWeather) {
            return cachedWeather;
        }
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService
                .get(`${this.weatherApiUrl}/weather`, {
                params: {
                    lat,
                    lon,
                    appid: this.apiKey,
                    units: 'metric',
                },
            })
                .pipe((0, rxjs_1.catchError)((error) => {
                this.logger.error(`Error fetching current weather: ${error.message}`);
                throw new Error('Failed to fetch weather data from external API');
            })));
            await this.cacheManager.set(cacheKey, data, 1800000);
            return data;
        }
        catch (error) {
            this.logger.error(`Failed to fetch current weather: ${error.message}`);
            throw error;
        }
    }
    async getWeatherForecastId(id) {
        const cacheKey = `weather_forecast_${id}`;
        const cachedForecast = await this.cacheManager.get(cacheKey);
        if (cachedForecast) {
            return cachedForecast;
        }
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService
                .get(`${this.weatherApiUrl}/forecast`, {
                params: {
                    id,
                    appid: this.apiKey,
                    units: 'metric',
                },
            })
                .pipe((0, rxjs_1.catchError)((error) => {
                this.logger.error(`Error fetching weather forecast: ${error.message}`);
                throw new Error('Failed to fetch forecast data from external API');
            })));
            await this.cacheManager.set(cacheKey, data, 1800000);
            return data;
        }
        catch (error) {
            this.logger.error(`Failed to fetch weather forecast: ${error.message}`);
            throw error;
        }
    }
    processForecastData(forecastData) {
        const dailyForecasts = {};
        forecastData.list.forEach((item) => {
            const date = new Date(item.dt * 1000).toISOString().split('T')[0];
            dailyForecasts[date] = {
                date,
                temp_min: item.main.temp_min,
                temp_max: item.main.temp_max,
                conditions: [item.weather[0].main],
                descriptions: [item.weather[0].description],
                icons: [item.weather[0].icon],
            };
        });
        return Object.values(dailyForecasts).slice(0, 7);
    }
};
exports.WeatherService = WeatherService;
exports.WeatherService = WeatherService = WeatherService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_2.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        cities_service_1.CitiesService, Object])
], WeatherService);
//# sourceMappingURL=weather.service.js.map