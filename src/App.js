import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'
import { useTransition, animated } from 'react-spring'
import { fetchAllContent, fetchTranslations } from 'api'
import { setAgeGroups, setTaskGroups } from 'redux/actionCreators'
import { GlobalStyle, theme } from 'styles'
import AgeGroups from 'views/AgeGroups'
import TaskGroups from 'views/TaskGroups'
import SubTaskGroups from 'views/SubTaskGroups'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    fetchAllContent().then(({ ageGroups, taskGroups }) => {
      dispatch(setAgeGroups(ageGroups))
      dispatch(setTaskGroups(taskGroups))
    })
    fetchTranslations()
  }, [dispatch])

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <>
          <GlobalStyle />
          <BaseRoute />
          <ActivityPageRoutes />
          <SubTaskPageRoutes />
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

const BaseRoute = () => {
  const location = useLocation()
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
}

const ActivitiesPageContainer = styled(animated.div)`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
`

const ActivityPageRoutes = () => {
  const location = useLocation()
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
            <Route path="/guid/:guid" component={TaskGroups} />
          </Switch>
        </ActivitiesPageContainer>
      ))}
    </>
  )
}

const SubTaskPageContainer = styled(animated.div)`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
`

const SubTaskPageRoutes = () => {
  const location = useLocation()
  const transitions = useTransition(location, location => location.pathname, {
    from: { transform: 'translate3d(100%, 0, 0)' },
    enter: { transform: 'translate3d(0, 0, 0)' },
    leave: { transform: 'translate3d(100%, 0, 0)' },
  })

  return (
    <>
      {transitions.map(({ item, props, key }) => (
        <SubTaskPageContainer key={key} style={props}>
          <Switch location={item}>
            <Route path="/guid/:guid" component={SubTaskGroups} />
          </Switch>
        </SubTaskPageContainer>
      ))}
    </>
  )
}

export default App
