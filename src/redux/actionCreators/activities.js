import { SET_ACTIVITIES } from 'redux/actionTypes'

export const setActivities = (activities) => {
  return {
    type: SET_ACTIVITIES,
    payload: activities,
  }
}
