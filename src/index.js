import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'
import App from './App'
import { Provider } from 'react-redux'
import store from 'redux/store'
import * as serviceWorker from './serviceWorker'

Sentry.init({
  dsn: 'https://4f518e9e5ce54053ac58c5a7f5366b9b@sentry.io/1852387',
})

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
