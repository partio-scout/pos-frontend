import {
  SET_USER,
  SET_USER_GROUPS,
  SET_GROUP_MEMBER_TASK,
} from 'redux/actionTypes'

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

export const updateGroupMemberTask = memberTask => {
  return {
    type: SET_GROUP_MEMBER_TASK,
    payload: memberTask,
  }
}
