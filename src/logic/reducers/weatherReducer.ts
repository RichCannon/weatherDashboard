import { createAction, createReducer } from "@reduxjs/toolkit"

import { LocationT } from "../../types/types";
import { GetWeatherRestActions } from "../actions/weatherActions"
import { createRestActions, defauleRestState } from "../helpers/helpers";
import { DefaultRestStateT } from "../helpers/restHelpers";


export type HourlyTemp = {
   temp: number
   dt: number
}[]


export type WeatherDataT = {
   hourly: HourlyTemp
   lat: number
   lon: number
   timestamp: number
}



type InitStateT = {
   weather: DefaultRestStateT<WeatherDataT[]>
   userLocation: LocationT
}


export type GetWeatherPayload = {
   lat: number
   lng: number
}

export type GetWeatherResponse = WeatherDataT


const getWeatherRestActions = createRestActions<
   typeof GetWeatherRestActions,
   GetWeatherResponse,
   GetWeatherPayload
>(GetWeatherRestActions);


export const weatherActions = {
   weather: getWeatherRestActions,
   userLocation: createAction<LocationT>(`weather/setUserLocation`),
   updateWeather: createAction<WeatherDataT[]>(`weather/updateWeather`)
}




const initState: InitStateT = {
   weather: defauleRestState<WeatherDataT[]>(),
   userLocation: { lan: -3.745, lng: -38.523 }
}



export const weatherReducer = createReducer<InitStateT>(initState, (builder) => {
   builder
      .addCase(weatherActions.weather.success, (state, action) => {
         state.weather = {
            data: [...state.weather.data, { ...action.payload, timestamp: Math.floor(Date.now() / 1000) }],
            fetching: false,
            error: null
         }
      })
      .addCase(weatherActions.weather.request, state => {
         state.weather.error = null
         state.weather.fetching = true
      })
      .addCase(weatherActions.weather.failure, state => {
         state.weather.fetching = true
      })
      .addCase(weatherActions.userLocation, (state, action) => {
         state.userLocation = action.payload
      })
      .addCase(weatherActions.updateWeather, (state, action) => {
         state.weather = {
            data: action.payload,
            fetching: false,
            error: null
         }
      })
})


