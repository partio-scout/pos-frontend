import React from 'react'
import { fireEvent } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { renderWithTheme } from 'test'
import ListItem from './index'

//TODO: Fix this test to work with Redux

const listItemProps = {
  guid: '1234',
  ageGroupIndex: 0,
  title: 'ListItem title',
  language: 'fi',
}

describe('ListItem component', () => {
  it('placeholder', () => {
    expect(listItemProps.guid).toBe('1234')
  })
  /*
  it('displays the given title', () => {
    const history = createMemoryHistory()
    const { getByTestId } = renderWithTheme(
      <Router history={history}>
        <ListItem {...listItemProps} />
      </Router>
    )
    const elem = getByTestId('title')
    expect(elem.innerHTML).toBe(listItemProps.title)
  })

  it('links to the given GUID with the given language', () => {
    const history = createMemoryHistory()
    const { getByTestId } = renderWithTheme(
      <Router history={history}>
        <ListItem {...listItemProps} />
      </Router>
    )
    const elem = getByTestId('link')
    fireEvent.click(elem)
    expect(history.location.pathname).toEqual(`/guid/${listItemProps.guid}`)
    expect(history.location.search).toEqual(`?lang=${listItemProps.language}`)
  })
   */
})
