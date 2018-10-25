import createSagaMiddleware from 'redux-saga'
import {isGenerator} from './utils'

/**
 * Saga Plugin
 *
 * Plugin for handling redux sagas
 */
const sagaPlugin = (sagaMiddleware = createSagaMiddleware()) => ({
    config: {
        redux: {
            middlewares: [sagaMiddleware],
        }
    },
    onModel(model) {
        const effects =
            typeof model.effects === 'function'
                ? model.effects(this.dispatch)
                : model.effects

        for (const effectName of Object.keys(effects)) {
            const fn = effects[effectName]

            if (isGenerator(fn)) {
                const boundFn = fn.bind(this.dispatch[model.name])
                this.effects[`${model.name}/${effectName}`] = (...p) =>
                    sagaMiddleware.run(boundFn, ...p).done
                this.dispatch[model.name][effectName] = this.createDispatcher.apply(
                    this,
                    [model.name, effectName]
                )
                // tag saga actions so they can be differentiated from normal actions
                this.dispatch[model.name][effectName].isSaga = true
            }
        }
    }
})

export default sagaPlugin

