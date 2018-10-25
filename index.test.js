const {init} = require('@rematch/core')
const {call} = require('redux-saga/effects')
const sagaPlugin = require('./index').default

describe('sagas:', () => {
    test('should create an saga action', () => {
        const count = {
            state: 0,
            effects: {
                *gen() {
                }
            },
        }

        const store = init({
            models: {count},
            plugins: [sagaPlugin()]
        })

        expect(store.dispatch.count.gen.isSaga).toBe(true)
    })

    test('should get params like usual effect', async () => {
        let effectArgs
        let sagaArgs

        const count = {
            state: 0,
            effects: {
                effect(...args) {
                    effectArgs = args
                },
                *saga(...args) {
                    sagaArgs = args
                }
            },
        }

        const store = init({
            models: {count},
            plugins: [sagaPlugin()]
        })

        await store.dispatch({type: 'count/effect', payload: 4, meta: {a: 1}})
        await store.dispatch({type: 'count/saga', payload: 4, meta: {a: 1}})

        expect(sagaArgs).toEqual(effectArgs)
    })

    test('should be able to trigger another action', async () => {
        const example = {
            state: 0,
            reducers: {
                addOne: state => state + 1,
            },
            effects: {
                *sagaAddTwo() {
                    yield this.addOne()
                    yield call(this.addOne)
                },
            },
        }

        const store = init({
            models: {example},
            plugins: [sagaPlugin()]
        })

        await store.dispatch.example.sagaAddTwo()

        expect(store.getState()).toEqual({
            example: 2,
        })
    })

    test('should be able to trigger another action with a value', async () => {
        const example = {
            state: 2,
            reducers: {
                addBy: (state, payload) => state + payload,
            },
            effects: {
                *sagaAddBy(value) {
                    yield call(this.addBy, value)
                },
            },
        }

        const store = init({
            models: {example},
            plugins: [sagaPlugin()]
        })

        await store.dispatch.example.sagaAddBy(5)

        expect(store.getState()).toEqual({
            example: 7,
        })
    })

    test('should be able to trigger another action w/ an object value', async () => {
        const example = {
            state: 3,
            reducers: {
                addBy: (state, payload) => state + payload.value,
            },
            effects: {
                *sagaAddBy(value) {
                    yield call(this.addBy, value)
                },
            },
        }

        const store = init({
            models: {example},
            plugins: [sagaPlugin()]
        })

        await store.dispatch.example.sagaAddBy({value: 6})

        expect(store.getState()).toEqual({
            example: 9,
        })
    })

    test('should be able to trigger another action w/ multiple actions', async () => {
        const example = {
            state: 0,
            reducers: {
                addBy: (state, payload) => state + payload,
            },
            effects: {
                *sagaAddOne() {
                    yield call(this.addBy, 1)
                },
                *sagaAddThree() {
                    yield call(this.addBy, 3)
                },
                *sagaAddSome() {
                    yield call(this.sagaAddThree)
                    yield call(this.sagaAddOne)
                    yield call(this.sagaAddOne)
                },
            },
        }

        const store = init({
            models: {example},
            plugins: [sagaPlugin()]
        })

        await store.dispatch.example.sagaAddSome()

        expect(store.getState()).toEqual({
            example: 5,
        })
    })

    test('should appear as an action for devtools', async () => {
        const actions = []

        const store = init({
            models: {
                count: {
                    state: 0,
                    reducers: {
                        addOne(state) {
                            return state + 1
                        },
                    },
                    effects: {
                        *sagaAddOne() {
                            yield call(this.addOne)
                        },
                    },
                },
            },
            plugins: [sagaPlugin()],
            redux: {
                middlewares: [
                    () => next => action => {
                        actions.push(action.type)
                        return next(action)
                    },
                ],
            },
        })

        await store.dispatch.count.sagaAddOne()
        expect(actions).toEqual(['count/sagaAddOne', 'count/addOne'])
    })

    it('should pass dispatch in as a function', async () => {
        const example = {
            state: 0,
            reducers: {
                addOne: state => state + 1,
            },
            effects: dispatch => ({
                *sagaAddTwo() {
                    yield dispatch.example.addOne()
                    yield call(dispatch.example.addOne)
                },
            }),
        }

        const store = init({
            models: {example},
            plugins: [sagaPlugin()]
        })

        await store.dispatch.example.sagaAddTwo()

        expect(store.getState()).toEqual({
            example: 2,
        })
    })
})
