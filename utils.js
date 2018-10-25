function getGeneratorFunc() {
    try {
        return Function('return function*() {}')()
    } catch (e) {
    }
}

const generatorFunc = getGeneratorFunc()
const GeneratorFunction = generatorFunc ? Object.getPrototypeOf(generatorFunc) : {}

export function isGenerator(fn) {
    return Object.getPrototypeOf(fn) === GeneratorFunction || Object.prototype.toString.call(fn) === '[object GeneratorFunction]'
}
