export interface WeatherForecast {
    city: {
        id: number;
        name: string;
        state?: string;
        country: string;
        lat: number;
        long: number;
    };
    forecast: DailyForecast[];
}
export interface DailyForecast {
    date: string;
    temp_min: number;
    temp_max: number;
    conditions: string[];
    descriptions: string[];
    icons: string[];
}
