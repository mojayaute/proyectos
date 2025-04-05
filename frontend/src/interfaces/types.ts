export interface CityWeather {
  id: number;
  name: string;
  state?: string;
  country?: string;
  weather: {
    id: number;
    temp: number;
    condition: string;
    description: string;
    icon: string;
  };
}

export interface DailyForecast {
  date: string;
  temp_min: number;
  temp_max: number;
  conditions: string[];
  descriptions: string[];
  icons: string[];
}

export interface CityForecast {
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

export interface ForecastDayProps {
  date: string;
  tempMax: number;
  tempMin: number;
  icon: string;
  condition: string;
  description: string;
}

export interface LoadingErrorProps {
  message: string;
  isError: boolean;
}