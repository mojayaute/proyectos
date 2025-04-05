import { CitiesService } from './cities.service';
export declare class CitiesController {
    private readonly citiesService;
    constructor(citiesService: CitiesService);
    getPopularCities(query?: string): Promise<import("./interfaces/city.interface").City[]>;
}
