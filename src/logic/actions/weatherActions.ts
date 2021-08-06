import { restActionCreatorHelper } from "../helpers/helpers"


const userRestActionsHelper = restActionCreatorHelper(`weather`)

export const GetWeatherRestActions = userRestActionsHelper(`getWeather`)