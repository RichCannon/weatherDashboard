import { FC } from 'react'

import { LoginTypes } from '../../types/types'
import s from './LoginMethodsModal.module.scss'


type LogInWithT = {
   value: LoginTypes,
   label: string
}


const logInWith: LogInWithT[] = [{
   value: LoginTypes.Github,
   label: `Login with github`
}, {
   value: LoginTypes.Google,
   label: `Login with google`
}, {
   value: LoginTypes.Yahoo,
   label: `Login with yahoo`
}]

type LoginMethodsModalP = {
   onLoginMethodClick: (loginWith: LoginTypes) => void
}

const LoginMethodsModal: FC<LoginMethodsModalP> = ({ onLoginMethodClick }) => {


   return (
      <>
         {logInWith.map(d =>
            <button onClick={() => onLoginMethodClick(d.value)}
               key={d.value}
               className={s.button}>
               {d.label}
            </button>)
         }
      </>
   )
}

export default LoginMethodsModal