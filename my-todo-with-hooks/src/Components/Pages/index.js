import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Switch, Route, Link, useLocation } from 'react-router-dom'
import { useTransition, animated } from 'react-spring'
import './styles.css'

export default function App() {
  const location = useLocation()
  const transitions = useTransition(location, location => location.pathname, {
    from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
  })
  return transitions.map(({ item: location, props, key }) => (
    <animated.div key={key} style={props}>
      <Switch location={location}>
        <Route path="/" exact component={A} />
        <Route path="/a" component={A} />
        <Route path="/b" component={B} />
        <Route path="/c" component={C} />
      </Switch>
    </animated.div>
  ))
}

const A = () => (
  <div style={{ background: 'lightpink' }}>
    <Link to="/b">A</Link>
  </div>
)

const B = () => (
  <div style={{ background: 'lightblue' }}>
    <Link to="/c">B</Link>
  </div>
)

const C = () => (
  <div style={{ background: 'lightgreen' }}>
    <Link to="/a">C</Link>
  </div>
)

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
)
