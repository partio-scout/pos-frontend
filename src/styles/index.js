import { css, createGlobalStyle } from 'styled-components'

export const sizes = {
  largeDesktopUp: 1400,
  desktopUp: 1024,
  tabletLandscapeUp: 900,
  tabletPortraitUp: 600,
}

export const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (min-width: ${sizes[label]}px) {
      ${css(...args)}
    }
  `
  return acc
}, {})

export const theme = {
  fontFamily: 'Muli, sans-serif',
  color: {
    text: '#FFF',
    background: '#0F0F0F',
    subText: '#878787',
    ageGroups: {
      '053fa231362e95cb211c5eb85c3cbedb': '#3650A1',
      '4ed7e03516698ffba67d342b529358c0': '#D4791E',
      fd0083b9a325c06430ba29cc6c6d1bac: '#5E0F75',
      '3ef690e4499894ed34577c83fdae7786': '#33652E',
      '0fe4dd441b0708f6bbff580d62392080': '#6E470A',
      e13d38602cec28781ed110c008385552: '#DB4033',
      default: '#545454',
    },
    ageGroupGradients: {
      '053fa231362e95cb211c5eb85c3cbedb': '#D8CD41',
      '4ed7e03516698ffba67d342b529358c0': '#DB8F43',
      fd0083b9a325c06430ba29cc6c6d1bac: '#78368B',
      '3ef690e4499894ed34577c83fdae7786': '#547E50',
      '0fe4dd441b0708f6bbff580d62392080': '#856532',
      e13d38602cec28781ed110c008385552: '#F67166',
      default: '#575757',
    },
    ageGroupGradientsDark: {
      '053fa231362e95cb211c5eb85c3cbedb': '#211F05',
      '4ed7e03516698ffba67d342b529358c0': '#221305',
      fd0083b9a325c06430ba29cc6c6d1bac: '#100F10',
      '3ef690e4499894ed34577c83fdae7786': '#0F100F',
      '0fe4dd441b0708f6bbff580d62392080': '#120C02',
      e13d38602cec28781ed110c008385552: '#3F1916',
      default: '#1A1A1A',
    },
    gradientDark: '#0F0F0F',
  },
}

export const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    width: 100%;
    height: 100%;
    font-family: ${({ theme }) => theme.fontFamily};
    color: ${({ theme }) => theme.color.text};
  }

  #root {
    width: 100%;
    height: 100%;
    position: relative;
  }
`
