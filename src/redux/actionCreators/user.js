import { SET_USER, SET_USER_GROUPS } from 'redux/actionTypes'

export const setUser = user => {
  return {
    type: SET_USER,
    payload: user,
  }
}

export const setUserGroups = groups => {
  return {
    type: SET_USER_GROUPS,
    payload: groups,
  }
}
