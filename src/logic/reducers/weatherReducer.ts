import { createReducer } from "@reduxjs/toolkit"

import { GetWeatherRestActions } from "../actions/weatherActions"
import { createRestActions } from "../helpers/helpers";


export type HourlyTemp = {
   temp: number
   dt: number
}[]


export type WeatherDataT = {
   lat: number
   lng: number
   hourly: HourlyTemp
}



type InitStateT = {
   weather: WeatherDataT[]
}


export type GetWeatherPayload = {
   lat: number
   lng: number
}


const getWeatherRestActions = createRestActions<
   typeof GetWeatherRestActions,
   any,
   GetWeatherPayload
>(GetWeatherRestActions);

export const weatherActions = {
   weather: getWeatherRestActions
}



const initState: InitStateT = {
   weather: []
}



export const weatherReducer = createReducer<InitStateT>(initState, (builder) => {
   builder
      .addCase(weatherActions.weather.success, (state, action) => {
         state.weather = [...state.weather, action.payload]
      })
})

