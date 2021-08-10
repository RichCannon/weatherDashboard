import { useState } from 'react'
import { useSelector } from 'react-redux'
import firebase from 'firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

import { authSelector } from '../../logic/selectors/authSelector'
import Modal from '../Modal/Modal'
import s from './Header.module.scss'
import { LoginTypes } from '../../types/types'
import LoginMethodsModal from '../LoginMethodsModal/LoginMethodsModal'

const Header = () => {

   const [isVisible, setIsVisible] = useState(false)

   const { authFirebase } = useSelector(authSelector)
   const [isAuth] = useAuthState(authFirebase)


   console.log(isAuth)
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
         {isVisible &&
            <Modal onDismissClick={onDismissClick}>
               <LoginMethodsModal onLoginMethodClick={onLoginMethodClick} />
            </Modal>
         }
         <>
            <div className={s.userData}>
               <div className={s.avatar} >{isAuth && <img src={isAuth.photoURL!} className={s.img} />}</div>
               <div className={s.userName}>
                  {isAuth ? isAuth.displayName : ``}
               </div>
            </div>
            {!isAuth
               ? <button onClick={onLoginClick} className={`${s.login} ${s.button}`}>{`Log in`}</button>
               : <button onClick={onLogoutClick} className={`${s.logout} ${s.button}`}>{`Log out`}</button>
            }
         </>
      </header>
   )
}

export default Header

