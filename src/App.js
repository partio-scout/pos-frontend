import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'
import { useTransition, animated } from 'react-spring'
import { GlobalStyle, theme } from 'styles'
import AgeGroupsPage from 'pages/AgeGroupsPage'
import AgeGroupActivitiesPage from 'pages/AgeGroupActivitiesPage'

const App = () => {
  // const fetchAllData = async () => {
  //   const data = await fetch(
  //     'https://pof-backend-staging.partio.fi/spn-ohjelma-json-taysi/?postGUID=86b5b30817ce3649e590c5059ec88921'
  //   )
  //   console.log(data)
  // }

  // useEffect(() => {
  //   fetchAllData()
  // }, [])

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
            <Route path="/" exact component={AgeGroupsPage} />
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
  const transitions = useTransition(location, location => location.pathname, {
    from: { transform: 'translate3d(0, 100%, 0)' },
    enter: { transform: 'translate3d(0, 0, 0)' },
    leave: { transform: 'translate3d(0, 100%, 0)' },
  })

  const ageGroups = [
    'Sudenpennut',
    'Seikkailijat',
    'Tarpojat',
    'Samoajat',
    'Vaeltajat',
  ]

  return (
    <>
      {transitions.map(({ item, props, key }) => (
        <ActivitiesPageContainer key={key} style={props}>
          <Switch location={item}>
            {ageGroups.map((ageGroup, i) => (
              <Route
                key={i}
                path={`/${ageGroup}`}
                exact
                component={AgeGroupActivitiesPage}
              />
            ))}
          </Switch>
        </ActivitiesPageContainer>
      ))}
    </>
  )
})

export default App
