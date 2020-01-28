import { user } from './index'
import { SET_USER } from 'redux/actionTypes'

describe('User reducer', () => {
  it('should return the initial state', () => {
    expect(user(undefined, {})).toEqual({})
  })

  it('should handle SET_USER', () => {
    const testUser = [
      {
        name: 'Teppo Testaaja',
        canMarkDone: false,
      },
    ]
    expect(
      user(
        {},
        {
          type: SET_USER,
          payload: testUser,
        }
      )
    ).toEqual(testUser)
  })
})
