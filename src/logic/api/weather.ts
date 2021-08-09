import axios from "axios"

import { GetWeatherPayload } from "../reducers/weatherReducer"


const WEATHER_KEY = process.env.REACT_APP_OPEN_WEATHER_API_KEY || ""
const EXCLUDE_PARTS = `current,minutely,daily,alerts`
const UNIT_TYPE = `metric`


//https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_KEY}
export const api = {
   getWeather: async ({ lat, lng }:GetWeatherPayload) => {
      const data = await axios.get(
         `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=${EXCLUDE_PARTS}&appid=${WEATHER_KEY}&units=${UNIT_TYPE}`
      )
      return data
   }
}