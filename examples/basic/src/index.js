import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {Provider} from 'react-redux'
import {init} from '@rematch/core'
import * as models from './model'
import sagaPlugin from 'rematch-saga'

const store = init({
    models,
    plugins: [sagaPlugin()]
})

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root'))
