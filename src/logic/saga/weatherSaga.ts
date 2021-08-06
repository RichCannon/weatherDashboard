import { Action } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { call, takeLeading } from 'redux-saga/effects';

import { api } from '../api/weather';
import { weatherActions } from '../reducers/weatherReducer';


function* getWeatherRequest(action: Action) {

   if (weatherActions.weather.request.match(action)) {
      try {
         
         const weatherReponse: AxiosResponse<any> = yield call(api.getWeather, action.payload)
         console.log(weatherReponse)

      } catch (e) {

      }
   }
}

  
export function* WeatherSaga() {
   yield* [
     takeLeading(weatherActions.weather.request.type, getWeatherRequest),      
   ];
 }