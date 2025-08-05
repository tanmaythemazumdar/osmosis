import { applyMiddleware, combineReducers, legacy_createStore } from 'redux'
import { thunk } from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { reducer as authReducer } from './auth'

const isDev = process.env.NODE_ENV === 'development'
const rootReducers = combineReducers({
  auth: authReducer,
})

export function configureStore(initialState = {}) {
  const middleware = [thunk]
  const composeEnhancers = isDev ? composeWithDevTools(applyMiddleware(...middleware)) : applyMiddleware(...middleware)

  return legacy_createStore(rootReducers, initialState, composeEnhancers)
}

export const store = configureStore()
