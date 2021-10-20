import {
  SET_ACTIVITY_GROUPS,
  SET_SELECTED_ACTIVITY_GROUP,
} from 'redux/actionTypes'

export const setActivityGroups = (activityGroups) => {
  return {
    type: SET_ACTIVITY_GROUPS,
    payload: activityGroups,
  }
}

export const setSelectedActivityGroup = (activityGroup) => {
  return {
    type: SET_SELECTED_ACTIVITY_GROUP,
    payload: activityGroup,
  }
}
