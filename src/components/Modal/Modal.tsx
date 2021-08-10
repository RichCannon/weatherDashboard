import { FC } from 'react'

import s from './Modal.module.scss'


type ModalP = {
   onDismissClick: () => void
   className?: string
   isLoading?: boolean
}

const Modal: FC<ModalP> = ({ onDismissClick, className = ``, children, isLoading }) => {
   return (
      <div className={s.container} onClick={onDismissClick}>
         <div onClick={e => e.stopPropagation()} className={`${s.content} ${className}`}>
            {isLoading ? `Loading...` : children}
         </div>
      </div>
   )
}

export default Modal