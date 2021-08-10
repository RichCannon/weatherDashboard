import { memo, useCallback, useEffect, useState } from 'react'
import { GoogleMap, useLoadScript } from '@react-google-maps/api'
import { useDispatch, useSelector } from 'react-redux'

import s from './MainPage.module.scss'
import { userLocationSelector, weatherDataSelector } from '../../logic/selectors/weatherSelectors'
import { HourlyTemp, weatherActions } from '../../logic/reducers/weatherReducer'
import { authSelector } from '../../logic/selectors/authSelector'
import { useAuthState } from 'react-firebase-hooks/auth'
import Modal from '../../components/Modal/Modal'
import GraphModal from '../../components/GraphModal/GraphModal'
import { LocationT } from '../../types/types'



const options = {
   disableDefaultUI: true,
   zoomControl: true
}

const radiusForCacheData = 17 // kilometrs
const cacheLiveTime = 10 // sec 3600 sec = 1 hour

const distanceBetween2Dots = (mk1: LocationT, mk2: LocationT) => {
   const R = 6371.071; // Radius of the Earth in kilometrs
   const rlat1 = mk1.lan * (Math.PI / 180); // Convert degrees to radians
   const rlat2 = mk2.lan * (Math.PI / 180); // Convert degrees to radians
   const difflat = rlat2 - rlat1; // Radian difference (latitudes)
   const difflon = (mk2.lng - mk1.lng) * (Math.PI / 180); // Radian difference (longitudes)
   return 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2)
      * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2)
      * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
}



const MainPage = () => {
   const { isLoaded } = useLoadScript({
      id: 'google-map-script',
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""
   })


   const [currentWeather, setCurrentWeather] = useState<HourlyTemp>([])

   const [isVisible, setIsVisible] = useState(false)
   const { authFirebase } = useSelector(authSelector)
   const userLocation = useSelector(userLocationSelector)

   const [isAuth] = useAuthState(authFirebase)

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


      if (isAuth && e.latLng) {
         setIsVisible(true)
         if (weather.length === 0) {
            dispatch(weatherActions.weather.request({ lat: e.latLng.lat(), lng: e.latLng.lng() }))
         }
         else {

            const newWeather = weather.filter(d => Math.floor(Date.now() / 1000) - d.timestamp <= cacheLiveTime)

            dispatch(weatherActions.updateWeather(newWeather))

            for (let i = 0; i < newWeather.length; i++) {
               const d = newWeather[i]

               const distance = distanceBetween2Dots(
                  { lan: d.lat, lng: d.lon },
                  { lan: e.latLng!.lat(), lng: e.latLng!.lng() })

               if (distance <= radiusForCacheData) {
                  setCurrentWeather(d.hourly)
                  break
               }
               else if ((distance > radiusForCacheData && (i === newWeather.length - 1))) {
                  dispatch(weatherActions.weather.request({ lat: e.latLng.lat(), lng: e.latLng.lng() }))
               }
            }
         }
      }
      else {
         window.alert(`To look on weather you need to log in!`)
      }
   }, [isAuth, weather])




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