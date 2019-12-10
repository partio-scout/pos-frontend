import { SET_AGE_GROUPS, SET_SELECTED_AGE_GROUP } from 'redux/actionTypes'

export const ageGroups = (state = [], action) => {
  switch (action.type) {
    case SET_AGE_GROUPS:
      return action.payload
    default:
      return state
  }
}

export const selectedAgeGroup = (state = [], action) => {
  switch (action.type) {
    case SET_SELECTED_AGE_GROUP:
      return action.payload
    default:
      return state
  }
}
