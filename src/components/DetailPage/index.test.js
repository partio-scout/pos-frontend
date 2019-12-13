import React from 'react'
import { cleanup, fireEvent } from '@testing-library/react'
import { renderWithTheme } from 'test'
import DetailPage from './index'

const detailPageProps = {
  onBackClick: jest.fn(() => {}),
  title: 'DetailPage',
  children: null,
}

describe('DetailPage component', () => {
  it('displays the given title', () => {
    const { getByTestId } = renderWithTheme(<DetailPage {...detailPageProps} />)
    const elem = getByTestId('title')
    expect(elem.innerHTML).toBe(detailPageProps.title)
  })

  it('runs the onBackClick function when back arrow is clicked', () => {
    const { getByTestId } = renderWithTheme(<DetailPage {...detailPageProps} />)
    const elem = getByTestId('back-arrow')
    fireEvent.click(elem)
    expect(detailPageProps.onBackClick.mock.calls.length).toBe(1)
  })

  afterEach(cleanup)
})
