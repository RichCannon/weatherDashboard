import axios from "axios"
import { WeatherDataT } from "../reducers/weatherReducer"


const WEATHER_KEY = process.env.REACT_APP_OPEN_WEATHER_API_KEY || ""

export const api = {
   getWeather: async ({lat,lng}: WeatherDataT) => {
      const data = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_KEY}`)
      return data
   }
} 