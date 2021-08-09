import { memo, useCallback, useEffect, useState } from 'react'
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';

import s from './MainPage.module.scss'
import { weatherDataSelector } from '../../logic/selectors/weatherSelectors';
import { weatherActions } from '../../logic/reducers/weatherReducer';
import { authSelector } from '../../logic/selectors/authSelector';
import { useAuthState } from 'react-firebase-hooks/auth';
import Modal from '../../components/Modal/Modal';
import GraphModal from '../../components/GraphModal/GraphModal';


const center = {
   lat: -3.745,
   lng: -38.523
};

const options = {
   disableDefaultUI: true,
   zoomControl: true
}


const MainPage = () => {
   const { isLoaded } = useLoadScript({
      id: 'google-map-script',
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""
   })


   const [isVisible, setIsVisible] = useState(true)
   const { authFirebase } = useSelector(authSelector)
   const [isAuth] = useAuthState(authFirebase)

   const dispatch = useDispatch()
   const { weather } = useSelector(weatherDataSelector)

   const onDismissClick = () => {
      setIsVisible(false)
   }

   useEffect(() => {
      dispatch(weatherActions.weather.request({ lat: -3.8073, lng: -38.5429 }))
   }, [])

   const onClick = useCallback((e: google.maps.MapMouseEvent) => {

      if (isAuth && e.latLng) {
         dispatch(weatherActions.weather.request({ lat: e.latLng.lat(), lng: e.latLng.lng() }))
      }
      else {
         window.alert(`To look on weather you need to log in!`)
      }
   }, [isAuth])

   if (weather && weather.length > 0) {
      console.log(weather[weather.length - 1])
   }



   return isLoaded ? (
      <>
         {isVisible &&
            <Modal onDismissClick={onDismissClick}>
               <GraphModal dataAll={weather.length > 0 ? weather[weather.length - 1].hourly : []} />
            </Modal>
         }
         <GoogleMap
            options={options}
            mapContainerClassName={s.containerMap}
            center={center}
            zoom={10}
            onClick={onClick}
         >
         </GoogleMap>
      </>
   )
      : <></>
}

export default memo(MainPage)