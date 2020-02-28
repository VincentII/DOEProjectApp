import { applyMiddleware, createStore } from "redux"

import logger from "redux-logger"
import thunk from "redux-thunk"
import promiseMiddleware  from "redux-promise-middleware"

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'

import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import reducer from "../reducers"


const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: ['user'],
    stateReconciler: autoMergeLevel2 // see "Merge Process" section for details.
   };

const pReducer = persistReducer(persistConfig, reducer);

const middleware = applyMiddleware(promiseMiddleware, thunk, logger)

const store = createStore(pReducer, middleware)

export default store;
export const persistor = persistStore(store);