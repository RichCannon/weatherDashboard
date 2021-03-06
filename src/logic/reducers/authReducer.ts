import { createAction, createReducer } from "@reduxjs/toolkit";
import firebase from 'firebase'

firebase.initializeApp({
   apiKey: "AIzaSyB3vGnTD1tyDCiPoSCamuNeqhfVuU78NrM",
   authDomain: "weatherdashboard-322109.firebaseapp.com",
   projectId: "weatherdashboard-322109",
   storageBucket: "weatherdashboard-322109.appspot.com",
   messagingSenderId: "611854473148",
   appId: "1:611854473148:web:a7d9a67d524751e4623db9"
})



const initState = {
   auth: {
      authFirebase: firebase.auth(),
      userData: null as firebase.User | null
   }
}


export const authActions = {
   setUser: createAction<firebase.User | null>(`auth/setUser`)
}



export const authReducer = createReducer(initState, builder => {
   builder
      .addCase(authActions.setUser, (state,action) => {
         state.auth.userData = action.payload
      })
})