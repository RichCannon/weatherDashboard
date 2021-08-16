import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import firebase from 'firebase'

import { authSelector } from '../../logic/selectors/authSelector'
import Modal from '../Modal/Modal'
import s from './Header.module.scss'
import { LoginTypes } from '../../types/types'
import LoginMethodsModal from '../LoginMethodsModal/LoginMethodsModal'
import { authActions } from '../../logic/reducers/authReducer'

const Header = () => {

   const [isVisible, setIsVisible] = useState(false)
   const [isReady, setIsReady] = useState(false)

   const dispatch = useDispatch()

   const { authFirebase, userData} = useSelector(authSelector)


   authFirebase.onAuthStateChanged(user => {
      dispatch(authActions.setUser(user))
      setIsReady(true)

   })

   const onLoginMethodClick = async (loginWith: LoginTypes) => {
      const provider = new firebase.auth.OAuthProvider(loginWith)
      await authFirebase.signInWithPopup(provider)
      setIsVisible(false)
   }

   const onLoginClick = () => {
      setIsVisible(true)
   }

   const onLogoutClick = () => {
      authFirebase.signOut()
   }

   const onDismissClick = () => {
      setIsVisible(false)
   }

   return (
      <header className={s.header}>
         {isReady ? <>
            {isVisible &&
               <Modal className={s.modalContent} onDismissClick={onDismissClick}>
                  <LoginMethodsModal onLoginMethodClick={onLoginMethodClick} />
               </Modal>
            }
            <>
               <div className={s.userData}>
                  <div className={s.avatar} >{userData && <img src={userData.photoURL!} className={s.img} />}</div>
                  <div className={s.userName}>
                     {userData ? userData.displayName : ``}
                  </div>
               </div>
               {!userData
                  ? <button onClick={onLoginClick} className={`${s.login} ${s.button}`}>{`Log in`}</button>
                  : <button onClick={onLogoutClick} className={`${s.logout} ${s.button}`}>{`Log out`}</button>
               }
            </>
         </>
            : `Loading...`
         }
      </header>
   )
}

export default Header

