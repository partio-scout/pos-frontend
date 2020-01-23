import { SET_USER } from 'redux/actionTypes'

export const user = (state = {}, action) => {
  switch (action.type) {
    case SET_USER:
      return action.payload
    default:
      return state
  }
}
