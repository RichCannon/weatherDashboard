import { useState } from 'react'
import { useSelector } from 'react-redux'
import firebase from 'firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

import { authSelector } from '../../logic/selectors/authSelector'
import Modal from '../Modal/Modal'
import s from './Header.module.scss'
import { LoginTypes } from '../../types/types'

const Header = () => {

   const [isVisible, setIsVisible] = useState(false)

   const { authFirebase } = useSelector(authSelector)
   const [isAuth] = useAuthState(authFirebase)

   const onLoginMethodClick = async (loginWith: LoginTypes) => {

      let provider: any


      switch (loginWith) {
         case `github`:
            provider = new firebase.auth.GithubAuthProvider
            break;
         case `google`:
            provider = new firebase.auth.GoogleAuthProvider
            break;
         case `yahoo`:
            provider = new firebase.auth.OAuthProvider('yahoo.com')
            break;
         default:
            return
      }

      await authFirebase.signInWithPopup(provider) as any

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
         {isVisible && <Modal onLoginMethodClick={onLoginMethodClick} onDismissClick={onDismissClick} />}
         {!isAuth
            ? <button onClick={onLoginClick} className={`${s.login} ${s.button}`}>{`Log in`}</button>
            : <button onClick={onLogoutClick} className={`${s.logout} ${s.button}`}>{`Log out`}</button>
         }
      </header>
   )
}

export default Header

