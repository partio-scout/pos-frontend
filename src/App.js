import React, { useEffect, useRef } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
  useParams,
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'
import { useTransition, animated } from 'react-spring'
import { fetchAllContent, fetchTranslations } from 'api'
import { setInitialData } from 'redux/actionCreators'
import { GlobalStyle, theme } from 'styles'
import AgeGroups from 'views/AgeGroups'
import AgeGroup from 'views/AgeGroup'
import TaskGroup from 'views/TaskGroup'
import { ITEM_TYPES } from 'consts'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    fetchAllContent().then(ageGroups => {
      dispatch(setInitialData(ageGroups))
    })
    fetchTranslations()
  }, [dispatch])

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <>
          <GlobalStyle />
          <TransitioningRoutes>
            <Route path="/" exact component={ComponentToRender} />
            <Route path="/guid/:guid" component={ComponentToRender} />
          </TransitioningRoutes>
        </>
      </ThemeProvider>
    </Router>
  )
}

const ComponentToRender = () => {
  const { guid } = useParams()
  const item = useSelector(state => state.itemsByGuid[guid])

  switch (item && item.type) {
    case ITEM_TYPES.AGE_GROUP:
      return <AgeGroup />
    case ITEM_TYPES.TASK_GROUP:
      return <TaskGroup />
    default:
      return <AgeGroups />
  }
}

const RouteContainer = styled(animated.div)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
`

const TransitioningRoutes = ({ children }) => {
  const depth = useRef(-1)
  const direction = useRef(1)
  const location = useLocation()
  const guid = location.pathname.split('/').pop()
  const item = useSelector(state => state.itemsByGuid[guid])

  useEffect(() => {
    let nextDepth = -1
    if (item) {
      nextDepth = item.depth
    }
    direction.current = nextDepth - depth.current > 0 ? 1 : -1
    depth.current = nextDepth
  }, [location.pathname, item])

  const transitions = useTransition(location, location => location.pathname, {
    from: { p: 1 },
    enter: { p: 0 },
    leave: { p: -1 },
  })

  return transitions.map(({ item, props, key }) => {
    const style = {
      transform: props.p.interpolate(p => {
        if (
          depth.current === -1 ||
          (depth.current === 0 && direction.current === 1)
        ) {
          return `translate3d(0, ${p * 100 * direction.current}%, 0)`
        }

        return `translate3d(${p * 100 * direction.current}%, 0, 0)`
      }),
    }

    return (
      <RouteContainer style={style} key={key}>
        <Switch location={item}>{children}</Switch>
      </RouteContainer>
    )
  })
}

export default App
