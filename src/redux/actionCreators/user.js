import { SET_USER } from 'redux/actionTypes'

export const setUser = user => {
  return {
    type: SET_USER,
    payload: user,
  }
}
