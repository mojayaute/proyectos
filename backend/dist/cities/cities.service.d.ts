import { HttpService } from '@nestjs/axios';
import { City } from './interfaces/city.interface';
import { Cache } from 'cache-manager';
export declare class CitiesService {
    private readonly httpService;
    private cacheManager;
    private readonly logger;
    private readonly placesApiUrl;
    constructor(httpService: HttpService, cacheManager: Cache);
    getPopularCities(query?: string): Promise<City[]>;
}
