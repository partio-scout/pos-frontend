import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { renderWithTheme } from 'test'
import ListItem from './index'

const listItemProps = {
  guid: '1234',
  ageGroupIndex: 0,
  title: 'ListItem title',
  language: 'fi',
}

const TestComponent = (
  <MemoryRouter>
    <ListItem {...listItemProps} />
  </MemoryRouter>
)

describe('ListItem component', () => {
  it('displays the given title', () => {
    const { getByTestId } = renderWithTheme(TestComponent)
    const elem = getByTestId('title')
    expect(elem.innerHTML).toBe(listItemProps.title)
  })

  it('links to the given GUID with the givenn language', () => {
    const { getByTestId } = renderWithTheme(TestComponent)
    const elem = getByTestId('link')
    expect(elem.getAttribute('href')).toBe(
      `/guid/${listItemProps.guid}?lang=${listItemProps.language}`
    )
  })
})
