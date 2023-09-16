import dotenv from "dotenv"
dotenv.config()

Base_URL: "http://api.weatherapi.com/v1"
const apiKey = process.env.WEATHER_API_KEY

export async function getWeather(city) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        const weather = `The weather in ${data.location.name} is currently ${data.current.condition.text} with a temperature of ${data.current.temp_c} degrees Celsius. The wind speed is ${data.current.wind_kph} mph and humidity is ${data.current.humidity} %.`
        return weather;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
