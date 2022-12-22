import {
  SET_AGE_GROUPS,
  SET_SELECTED_AGE_GROUP,
  SET_USER_AGE_GROUPS,
} from 'redux/actionTypes'

export const ageGroups = (state = [], action) => {
  switch (action.type) {
    case SET_AGE_GROUPS:
      return action.payload
    default:
      return state
  }
}

export const selectedAgeGroup = (state = null, action) => {
  switch (action.type) {
    case SET_SELECTED_AGE_GROUP:
      return action.payload
    default:
      return state
  }
}

export const userAgeGroups = (state = {}, action) => {
  switch (action.type) {
    case SET_USER_AGE_GROUPS:
      return action.payload.reduce((acc, curr) => {
        acc[curr.agegroup_guid] = curr.completion_status
        return acc
      }, {})
    default:
      return state
  }
}
