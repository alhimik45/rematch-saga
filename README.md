# Rematch Saga

Redux-saga plugin for Rematch.

## Install

```
npm install rematch-saga
```

## Setup

```js
import { init } from '@rematch/core'
import sagaPlugin from 'rematch-saga'

init({
  plugins: [sagaPlugin()]
})
```

Optionally `sagaPlugin` takes `sagaMiddleware`. If it is not passed, plugin creates its own middleware.

## Using sagas

After including plugin along with async effects you can write sagas:

```js
const count = {
    state: 0,
    reducers: {
        increment(state) {
            return state + 1
        }
    },
    effects: {
        async incrementAsync() { // usual async effect
            await asyncDelay(1000)
            this.increment()
        },
        *incrementAsyncSaga() { // full-featured saga
            yield call(delay, 1000)
            yield call(this.increment)
        }
    }
}
```

Sagas are called like any other effects. See `examples/` for more information.
