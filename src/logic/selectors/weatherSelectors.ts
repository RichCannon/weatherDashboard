import { RootState } from "../../App";

export const weatherDataSelector = (state: RootState) => state.weather.weather

export const userLocationSelector = (state: RootState) => state.weather.userLocation