"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const cache_manager_1 = require("@nestjs/cache-manager");
const cities_service_1 = require("./cities.service");
describe('CitiesService', () => {
    let service;
    const mockCacheManager = {
        get: jest.fn(),
        set: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            imports: [
                axios_1.HttpModule,
                config_1.ConfigModule.forRoot(),
            ],
            providers: [
                cities_service_1.CitiesService,
                {
                    provide: cache_manager_1.CACHE_MANAGER,
                    useValue: mockCacheManager,
                },
            ],
        }).compile();
        service = module.get(cities_service_1.CitiesService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('getPopularCities', () => {
        it('should return cached cities if available', async () => {
            const mockCachedCities = [
                {
                    id: 1,
                    name: 'Monterrey',
                    slug: 'monterrey',
                    state: 'Nuevo León',
                    country: 'Mexico',
                    lat: 25.6866,
                    long: -100.3161,
                },
            ];
            mockCacheManager.get.mockResolvedValue(mockCachedCities);
            const result = await service.getPopularCities('monterrey');
            expect(result).toEqual(mockCachedCities);
            expect(mockCacheManager.get).toHaveBeenCalledWith('popular_cities_monterrey');
        });
    });
});
//# sourceMappingURL=cities.service.spec.js.map