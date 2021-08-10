import { createAction } from "@reduxjs/toolkit"
import { BaseErrorType, CreateErrorPreparedAction, DefaultRestStateT, RestActionTypes } from "./restHelpers"

export function restActionCreatorHelper<T extends string>(reducer: T) {
   return function <D extends string>(restAction: D) {

      type TandD = `${T}/${D}`
      type RestActionTypes = {
         request: `${TandD}_request`,
         success: `${TandD}_success`,
         failure: `${TandD}}_failure`,
         needUpdate: `${TandD}_needUpdate`,
      }
      const reducerAndAction = `${reducer}/${restAction}`
      return {
         request: `${reducerAndAction}_request`,
         success: `${reducerAndAction}_success`,
         failure: `${reducerAndAction}_failure`,
         needUpdate: `${reducerAndAction}_needUpdate`,
      } as RestActionTypes
   }
}


function createRestActions<
   T extends RestActionTypes,
   SuccessPayload = void,
   RequestPayload = void,
   NeedUpdatePayload = void
>(actions: T) {
   return {
      request: createAction<RequestPayload, T['request']>(actions.request),
      success: createAction<SuccessPayload, T['success']>(actions.success),
      needUpdate: createAction<NeedUpdatePayload, T['needUpdate']>(
         actions.needUpdate,
      ),
      failure: createAction<CreateErrorPreparedAction, T['failure']>(
         actions.failure,
         (data: BaseErrorType) => {
            return {
               payload: undefined,
               error: data,
            };
         },
      ),
   };
}




function defauleRestState<T>(): DefaultRestStateT<T> {
   return {
      data: [],
      fetching: false,
      error: null
   }
}

export {
   createRestActions,
   defauleRestState
};

