import {
  SET_ACTIVITY_GROUPS,
  SET_SELECTED_ACTIVITY_GROUP,
} from 'redux/actionTypes'

export const activityGroups = (state = [], action) => {
  switch (action.type) {
    case SET_ACTIVITY_GROUPS:
      return action.payload
    default:
      return state
  }
}

export const selectedActivityGroup = (state = null, action) => {
  switch (action.type) {
    case SET_SELECTED_ACTIVITY_GROUP:
      return action.payload
    default:
      return state
  }
}
