type RestActions = 'request' | 'success' | 'failure' | 'needUpdate';

export type RestActionTypes = { [K in RestActions]: string };
export type BaseFieldsType = { [key: string]: string };
export interface BaseErrorType {
   description: string;
   code?: number;
   fields?: BaseFieldsType;
}

export interface BaseErrorType {
   description: string;
   code?: number;
   fields?: BaseFieldsType;
}

export type CreateErrorPreparedAction = (
   data: BaseErrorType,
) => {
   payload: any;
   error: BaseErrorType;
};

export type DefaultRestStateT<T> = {
   data: T | []
   fetching: boolean
   error: BaseErrorType | null
}


