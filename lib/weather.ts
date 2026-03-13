import * as Location from 'expo-location';

export interface WeatherData {
  temp: number;
  condition: string; // 'Sunny', 'Cloudy', 'Rain', 'Snow', 'Windy'
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

export interface DailyForecast {
  date: string;
  minTemp: number;
  maxTemp: number;
  condition: string;
  rainChance: number;
}

// Mock data generator for demo purposes
const CONDITIONS = ['Sunny', 'Cloudy', 'Rain', 'Partly Cloudy', 'Windy'];

export async function getCurrentWeather(city?: string): Promise<WeatherData> {
  // In a real app, we would use an API like OpenWeatherMap here.
  // const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
  // const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
  // For now, we return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        temp: Math.floor(Math.random() * 15) + 10, // 10-25 degrees
        condition: CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)],
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        description: 'Partly cloudy with a chance of styling',
        icon: 'weather-partly-cloudy',
      });
    }, 500);
  });
}

export async function getForecast(city: string, startDate: Date, days: number): Promise<DailyForecast[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const forecast: DailyForecast[] = [];
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        forecast.push({
          date: date.toISOString().split('T')[0],
          minTemp: Math.floor(Math.random() * 10) + 5,
          maxTemp: Math.floor(Math.random() * 10) + 15,
          condition: CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)],
          rainChance: Math.floor(Math.random() * 30),
        });
      }
      resolve(forecast);
    }, 800);
  });
}

export async function getUserLocation(): Promise<string> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return 'London'; // Default
  }

  const location = await Location.getCurrentPositionAsync({});
  // Here we would reverse geocode, but for now just return a placeholder
  return 'Current Location'; 
}
