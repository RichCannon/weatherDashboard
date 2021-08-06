import {  createReducer } from "@reduxjs/toolkit"

import { GetWeatherRestActions } from "../actions/weatherActions"
import { createRestActions } from "../helpers/helpers";

export type WeatherDataT = {
   lat: number
   lng: number
}



type InitStateT = {
   weather: WeatherDataT[]
}




const getWeatherRestActions = createRestActions<
   typeof GetWeatherRestActions,
   any,
   WeatherDataT
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

 