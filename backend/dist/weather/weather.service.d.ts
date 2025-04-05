import { HttpService } from '@nestjs/axios';
import { CitiesService } from '../cities/cities.service';
import { CityWeather } from './interfaces/city-weather.interface';
import { WeatherForecast } from './interfaces/weather-forecast.interface';
import { Cache } from 'cache-manager';
export declare class WeatherService {
    private readonly httpService;
    private readonly citiesService;
    private cacheManager;
    private readonly logger;
    private readonly weatherApiUrl;
    private readonly apiKey;
    constructor(httpService: HttpService, citiesService: CitiesService, cacheManager: Cache);
    getCitiesWithWeather(query?: string): Promise<CityWeather[]>;
    getCityForecast(cityId: string): Promise<WeatherForecast>;
    private getCurrentWeather;
    private getWeatherForecastId;
    private processForecastData;
}
