import { ageGroups } from './index'
import { SET_AGE_GROUPS } from 'redux/actionTypes'

describe('Age groups reducer', () => {
  it('should return the initial state', () => {
    expect(ageGroups(undefined, {})).toEqual([])
  })

  it('should handle SET_AGE_GROUPS', () => {
    const testAgeGroups = [
      {
        minAge: '7',
        maxAge: '9',
      },
    ]
    expect(
      ageGroups([], {
        type: SET_AGE_GROUPS,
        payload: testAgeGroups,
      })
    ).toEqual(testAgeGroups)
  })
})
