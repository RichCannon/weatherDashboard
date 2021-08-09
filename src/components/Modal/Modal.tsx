import { FC } from 'react'

import s from './Modal.module.scss'


type ModalP = {
   onDismissClick: () => void
}

const Modal: FC<ModalP> = ({ onDismissClick, children }) => {
   return (
      <div className={s.container} onClick={onDismissClick}>
         <div onClick={e => e.stopPropagation()} className={s.content}>
            {children}
         </div>
      </div>
   )
}

export default Modal