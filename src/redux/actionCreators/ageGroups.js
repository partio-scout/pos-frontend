import { SET_AGE_GROUPS } from 'redux/actionTypes'

export const setAgeGroups = ageGroups => {
  return {
    type: SET_AGE_GROUPS,
    payload: ageGroups,
  }
}
