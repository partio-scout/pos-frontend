import {
  SET_ACTIVITY_GROUPS,
  SET_SELECTED_ACTIVITY_GROUP,
  SET_USER_ACTIVITY_GROUPS,
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

export const setUserActivityGroups = (activitygroups) => {
  return {
    type: SET_USER_ACTIVITY_GROUPS,
    payload: activitygroups,
  }
}
