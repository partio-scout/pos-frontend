import { determineLanguageFromUrl } from 'utils'

describe('determineLanguageFromUrl', () => {
  it('returns what is specified in the "lang" url parameter', () => {
    const testUrl = 'https://test-url.com/?lang=sv'
    expect(determineLanguageFromUrl(testUrl)).toEqual('sv')
  })

  it('returns "fi" if no "lang" parameter is specified', () => {
    const testUrl = 'https://test-url.com/'
    expect(determineLanguageFromUrl(testUrl)).toEqual('fi')
  })
})
