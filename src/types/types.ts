export enum LoginTypes {
   Google = 'google.com',
   Github = `github.com`,
   Yahoo = `yahoo.com`
}


export type LocationT = {
   lan: number
   lng: number
}

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

