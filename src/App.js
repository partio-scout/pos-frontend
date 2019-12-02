import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle, theme } from 'styles'
import AgeGroupsPage from 'pages/AgeGroupsPage'

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <>
          <GlobalStyle />
          <Route path="/" exact component={AgeGroupsPage} />
        </>
      </ThemeProvider>
    </Router>
  )
}

export default App
