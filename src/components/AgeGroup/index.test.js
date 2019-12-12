import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { getAgeGroupTitleWithoutAges } from 'helpers'
import { renderWithTheme } from 'test'

import AgeGroup from './index'

const testAgeGroup = {
  minAge: '7',
  maxAge: '9',
  guid: '053fa231362e95cb211c5eb85c3cbedb',
  title: 'Sudenpennut (7-9 v.)',
  languages: [
    { lang: 'fi', title: 'Sudenpennut (7-9 v.)' },
    { lang: 'sv', title: 'Vargungar (7-9 år)' },
  ],
}

describe('AgeGroup component', () => {
  it('displays the title of the given age group with the given language', () => {
    const language = 'sv'
    const { getByTestId } = renderWithTheme(
      <MemoryRouter>
        <AgeGroup ageGroup={testAgeGroup} language={language} />
      </MemoryRouter>
    )
    const elem = getByTestId('title')
    expect(elem.innerHTML).toBe(
      getAgeGroupTitleWithoutAges(
        testAgeGroup.languages.find(lang => lang.lang === language).title
      )
    )
  })
})
