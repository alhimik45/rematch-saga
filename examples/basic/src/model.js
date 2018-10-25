import {delay} from 'redux-saga'
import {call} from 'redux-saga/effects'

const asyncDelay = (time) => new Promise((resolve) => (
    setTimeout(() => resolve(), time))
)

export const count = {
    state: 0,
    reducers: {
        increment(state) {
            return state + 1
        },
        decrement(state) {
            return state - 1
        },
        set(state, value) {
            return value
        },
    },
    effects: {
        async incrementAsync() {
            await asyncDelay(1000)
            this.increment()
        },
        *incrementAsyncSaga() {
            yield call(delay, 1000)
            yield call(this.increment)
        },
        *setState(value) {
            yield call(this.set, value)
        }
    }
}