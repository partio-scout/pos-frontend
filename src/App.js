import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'
import { useTransition, animated } from 'react-spring'
import { fetchAllContent } from 'api'
import { setAgeGroups } from 'redux/actionCreators'
import { GlobalStyle, theme } from 'styles'
import AgeGroups from 'views/AgeGroups'
import TaskGroups from 'views/TaskGroups'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    fetchAllContent().then(({ ageGroups }) => {
      dispatch(setAgeGroups(ageGroups))
    })
  }, [dispatch])

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <>
          <GlobalStyle />
          <BaseRoute />
          <ActivityPageRoutes />
        </>
      </ThemeProvider>
    </Router>
  )
}

const BaseRouteContainer = styled(animated.div)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
`

const BaseRoute = withRouter(({ location }) => {
  const transitions = useTransition(location, location => location.pathname, {
    from: { transform: 'translate3d(0, -100%, 0)' },
    enter: { transform: 'translate3d(0, 0, 0)' },
    leave: { transform: 'translate3d(0, -50%, 0)' },
  })

  return (
    <>
      {transitions.map(({ item, props, key }) => (
        <BaseRouteContainer key={key} style={props}>
          <Switch location={item}>
            <Route path="/" exact component={AgeGroups} />
          </Switch>
        </BaseRouteContainer>
      ))}
    </>
  )
})

const ActivitiesPageContainer = styled(animated.div)`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
`

const ActivityPageRoutes = withRouter(({ location }) => {
  const ageGroups = useSelector(state => state.ageGroups)

  const transitions = useTransition(location, location => location.pathname, {
    from: { transform: 'translate3d(0, 100%, 0)' },
    enter: { transform: 'translate3d(0, 0, 0)' },
    leave: { transform: 'translate3d(0, 100%, 0)' },
  })

  return (
    <>
      {transitions.map(({ item, props, key }) => (
        <ActivitiesPageContainer key={key} style={props}>
          <Switch location={item}>
            {ageGroups.map((ageGroup, i) => (
              <Route
                key={i}
                path={`/guid/${ageGroup.guid}`}
                exact
                component={TaskGroups}
              />
            ))}
          </Switch>
        </ActivitiesPageContainer>
      ))}
    </>
  )
})

export default App
