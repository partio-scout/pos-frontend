import { SET_AGE_GROUPS } from 'redux/actionTypes'

export const ageGroups = (state = [], action) => {
  switch (action.type) {
    case SET_AGE_GROUPS:
      return action.payload
    default:
      return state
  }
}
