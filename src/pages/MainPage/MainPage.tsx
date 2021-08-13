import { memo, useCallback, useEffect, useState } from 'react'
import { GoogleMap, useLoadScript } from '@react-google-maps/api'
import { useDispatch, useSelector } from 'react-redux'

import s from './MainPage.module.scss'
import { userLocationSelector, weatherDataSelector } from '../../logic/selectors/weatherSelectors'
import {  weatherActions } from '../../logic/reducers/weatherReducer'
import { authSelector } from '../../logic/selectors/authSelector'
import Modal from '../../components/Modal/Modal'
import GraphModal from '../../components/GraphModal/GraphModal'
import { distanceBetween2Dots } from '../../utils/helpers'
import { HourlyTemp } from '../../types/types'

const options = {
   disableDefaultUI: true,
   zoomControl: true
}

const radiusForCacheData = 17 // kilometrs
const cacheLiveTime = 10 // sec 3600 sec = 1 hour

const MainPage = () => {
   const { isLoaded } = useLoadScript({
      id: 'google-map-script',
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""
   })


   const [currentWeather, setCurrentWeather] = useState<HourlyTemp>([])

   const [isVisible, setIsVisible] = useState(false)
   const userLocation = useSelector(userLocationSelector)
   const { userData } = useSelector(authSelector)


   const dispatch = useDispatch()
   const { data: weather, fetching: isLoading } = useSelector(weatherDataSelector)

   const onDismissClick = () => {
      setIsVisible(false)
      setCurrentWeather([])
   }

   useEffect(() => {
      navigator.geolocation.getCurrentPosition(position => {
         dispatch(weatherActions.userLocation({
            lan: position.coords.latitude,
            lng: position.coords.longitude
         }))
      });
   }, [])

   const onClick = useCallback((e: google.maps.MapMouseEvent) => {
      if (userData && e.latLng) {
         setIsVisible(true)
         if (weather.length === 0) {
            dispatch(weatherActions.weather.request({ lat: e.latLng.lat(), lng: e.latLng.lng() }))
         }
         else {
            // Check if cache is actual
            const newWeather = weather.filter(d => Math.floor(Date.now() / 1000) - d.timestamp <= cacheLiveTime)
            // Update cache
            dispatch(weatherActions.updateWeather(newWeather))

            for (let i = 0; i < newWeather.length; i++) {
               const d = newWeather[i]

               const distance = distanceBetween2Dots(
                  { lan: d.lat, lng: d.lon },
                  { lan: e.latLng!.lat(), lng: e.latLng!.lng() })

               if (distance <= radiusForCacheData) {
                  setCurrentWeather(d.hourly)
                  break
               } // If there is no cached data, get the data for this location
               else if ((distance > radiusForCacheData && (i === newWeather.length - 1))) {
                  dispatch(weatherActions.weather.request({ lat: e.latLng.lat(), lng: e.latLng.lng() }))
               }
            }
         }
      }
      else {
         window.alert(`To look on weather you need to log in!`)
      }
   }, [userData, weather])




   return isLoaded ? (
      <>
         {isVisible &&
            <Modal isLoading={isLoading} className={s.modalContent} onDismissClick={onDismissClick}>
               <GraphModal dataAll={currentWeather.length > 0
                  ? currentWeather
                  : (weather && weather.length > 0 ? weather[weather.length - 1].hourly : [])} />
            </Modal>
         }
         <GoogleMap
            options={options}
            mapContainerClassName={s.containerMap}
            center={{ lat: userLocation.lan, lng: userLocation.lng }}
            zoom={10}
            onClick={onClick}
         >
         </GoogleMap>
      </>
   )
      : <></>
}

export default memo(MainPage)