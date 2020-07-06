import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import * as reducers from './reducers'

const store = createStore(
  combineReducers(reducers),
  composeWithDevTools(applyMiddleware(thunk))
)

export default store
