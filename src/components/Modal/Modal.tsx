import { FC } from 'react'

import { LoginTypes } from '../../types/types'
import s from './Modal.module.scss'


type ModalP = {
   onDismissClick: () => void
   onLoginMethodClick: (loginWith: LoginTypes) => void
}

type LogInWithT = {
   value: LoginTypes,
   label: string
}

const logInWith: LogInWithT[] = [{
   value: `github`,
   label: `Login with github`
}, {
   value: `google`,
   label: `Login with google`
}, {
   value: `yahoo`,
   label: `Login with yahoo`
}]

const Modal: FC<ModalP> = ({ onDismissClick, onLoginMethodClick }) => {
   return (
      <div className={s.container} onClick={onDismissClick}>
         <div onClick={e => e.stopPropagation()} className={s.content}>
            {logInWith.map(d =>
               <button onClick={() => onLoginMethodClick(d.value)}
                  key={d.value}
                  className={s.button}>
                  {d.label}
               </button>)
            }
         </div>
      </div>
   )
}

export default Modal