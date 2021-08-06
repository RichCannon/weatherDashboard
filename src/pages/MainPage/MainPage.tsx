import React, { memo, useCallback, useState } from 'react'
import { GoogleMap, useJsApiLoader, useLoadScript } from '@react-google-maps/api';

import s from './MainPage.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import { weatherDataSelector } from '../../logic/selectors/weatherSelectors';
import { weatherActions } from '../../logic/reducers/weatherReducer';
import { authSelector } from '../../logic/selectors/authSelector';
import { useAuthState } from 'react-firebase-hooks/auth';


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



   const { authFirebase } = useSelector(authSelector)
   const [isAuth] = useAuthState(authFirebase)

   const dispatch = useDispatch()
   const { weather } = useSelector(weatherDataSelector)
   const onClick = useCallback((e) => {
      if (isAuth) {
         dispatch(weatherActions.weather.request({ lat: e.latLng.lat(), lng: e.latLng.lng() }))
      }
      else {
         window.alert(`To look on weather you need to log in!`)
      }
   }, [isAuth])



   return isLoaded ? (
      <GoogleMap
         options={options}
         mapContainerClassName={s.containerMap}
         center={center}
         zoom={10}
         onClick={onClick}
      >
      </GoogleMap>
   ) : <></>
}

export default memo(MainPage)