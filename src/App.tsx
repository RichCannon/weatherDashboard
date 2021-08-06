import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

import s from './App.module.scss';
import Header from './components/Header/Header';
import { authReducer } from './logic/reducers/authReducer'
import { weatherReducer } from './logic/reducers/weatherReducer';
import { WeatherSaga } from './logic/saga/weatherSaga';
import MainPage from './pages/MainPage/MainPage';

const sagaMiddleware = createSagaMiddleware();


function* rootSaga() {
   yield all([
      WeatherSaga()
   ])
}

const reducer = combineReducers({
   weather: weatherReducer,
   auth: authReducer
})


const store = configureStore({
   reducer,
   middleware: [sagaMiddleware] as const,

})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>

const App = () => {
   return (
      <Provider store={store}>
         <div className={s.container}>
            <Header />
            <MainPage />
         </div>
      </Provider>
   );
}

export default App;
