import { WeatherService } from './weather.service';
export declare class WeatherController {
    private readonly weatherService;
    constructor(weatherService: WeatherService);
    getCitiesWithWeather(query?: string): Promise<import("./interfaces/city-weather.interface").CityWeather[]>;
    getCityForecast(id: string): Promise<import("./interfaces/weather-forecast.interface").WeatherForecast>;
}
