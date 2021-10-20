import { SET_ACTIVITY_GROUPS } from 'redux/actionTypes'

export const activityGroups = (state = [], action) => {
  switch (action.type) {
    case SET_ACTIVITY_GROUPS:
      return action.payload
    default:
      return state
  }
}
