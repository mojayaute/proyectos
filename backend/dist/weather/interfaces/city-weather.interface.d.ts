import { City } from '../../cities/interfaces/city.interface';
export interface CityWeather extends City {
    weather: {
        temp: number;
        condition: string;
        description: string;
        icon: string;
    };
}
