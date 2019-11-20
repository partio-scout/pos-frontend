import React from 'react'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle, theme } from 'styles'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyle />
        <p>Hello World!</p>
      </>
    </ThemeProvider>
  )
}

export default App
