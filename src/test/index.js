import React from 'react'
import { theme } from 'styles'
import { ThemeProvider } from 'styled-components'
import { render } from '@testing-library/react'

export const renderWithTheme = children =>
  render(<ThemeProvider theme={theme}>{children}</ThemeProvider>)
