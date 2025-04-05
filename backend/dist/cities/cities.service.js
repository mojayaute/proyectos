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
var CitiesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitiesService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const cache_manager_1 = require("@nestjs/cache-manager");
const common_2 = require("@nestjs/common");
let CitiesService = CitiesService_1 = class CitiesService {
    constructor(httpService, cacheManager) {
        this.httpService = httpService;
        this.cacheManager = cacheManager;
        this.logger = new common_1.Logger(CitiesService_1.name);
        this.placesApiUrl = 'https://search.reservamos.mx/api/v2/places';
    }
    async getPopularCities(query = '') {
        const cacheKey = `popular_cities_${query}`;
        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) {
            this.logger.log('Returning cities from cache');
            return cachedData;
        }
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.placesApiUrl}`, {
                params: { q: query || 'mexico' },
            }).pipe((0, rxjs_1.catchError)((error) => {
                this.logger.error(`Error fetching cities: ${error.message}`);
                throw new Error('Failed to fetch cities from external API');
            })));
            const cities = data
                .filter((place) => place.result_type === 'city')
                .map((city) => ({
                id: city.id,
                slug: city.slug,
                name: city.city_name || city.name,
                state: city.state,
                country: city.country,
                lat: city.lat,
                long: city.long,
            }));
            await this.cacheManager.set(cacheKey, cities, 3600000);
            return cities;
        }
        catch (error) {
            this.logger.error(`Failed to fetch cities: ${error.message}`);
            throw error;
        }
    }
};
exports.CitiesService = CitiesService;
exports.CitiesService = CitiesService = CitiesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_2.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [axios_1.HttpService, Object])
], CitiesService);
//# sourceMappingURL=cities.service.js.map