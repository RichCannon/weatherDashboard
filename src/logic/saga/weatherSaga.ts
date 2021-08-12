import { Action } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { call, put, takeLeading } from 'redux-saga/effects';

import { api } from '../api/weather';
import { GetWeatherResponse, weatherActions } from '../reducers/weatherReducer';


function* getWeatherRequest(action: Action) {
   if (weatherActions.weather.request.match(action)) {
      try {
         const weatherReponse: AxiosResponse<GetWeatherResponse> = yield call(api.getWeather, action.payload)
         yield put(weatherActions.weather.success(weatherReponse.data))
      } catch (e) {
         yield put(weatherActions.weather.failure(e))
      }
   }
}


export function* WeatherSaga() {
   yield* [
      takeLeading(weatherActions.weather.request.type, getWeatherRequest),
   ];
}