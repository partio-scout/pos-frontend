import { SET_USER, SET_USER_GROUPS } from 'redux/actionTypes'

export const user = (state = {}, action) => {
  switch (action.type) {
    case SET_USER:
      return action.payload
    case SET_USER_GROUPS:
      return {
        userGroups: action.payload,
        ...state,
      }
    default:
      return state
  }
}
