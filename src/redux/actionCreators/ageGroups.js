import {
  SET_AGE_GROUPS,
  SET_SELECTED_AGE_GROUP,
  SET_USER_AGE_GROUPS,
} from 'redux/actionTypes'

export const setAgeGroups = (ageGroups) => {
  return {
    type: SET_AGE_GROUPS,
    payload: ageGroups,
  }
}

export const setSelectedAgeGroup = (ageGroup) => {
  return {
    type: SET_SELECTED_AGE_GROUP,
    payload: ageGroup,
  }
}

export const setUserAgeGroups = (agegroups) => {
  return {
    type: SET_USER_AGE_GROUPS,
    payload: agegroups,
  }
}
