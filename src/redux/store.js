import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import * as reducers from './reducers'

const createStoreWithMiddlewares = applyMiddleware(thunk)(createStore)

const store = createStoreWithMiddlewares(combineReducers(reducers))

export default store
