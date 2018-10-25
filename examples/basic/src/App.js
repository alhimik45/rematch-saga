import React from 'react'
import {connect} from 'react-redux'

const App = (props) => (
    <div>
        <h1>{props.count}</h1>
        <button onClick={() => props.decrement()}>-</button>
        <button onClick={() => props.increment()}>+</button>
        <button onClick={() => props.incrementAsync()}>+ Async</button>
        <button onClick={() => props.incrementAsyncSaga()}>+ Async Saga</button>
        <button onClick={() => props.setState(0)}>Reset State</button>
    </div>
)

const mapStateToProps = state => ({count: state.count})
const mapDispatchToProps = ({count: {decrement, increment, incrementAsync, incrementAsyncSaga, setState}}) => ({
    decrement, increment, incrementAsync, incrementAsyncSaga, setState
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
