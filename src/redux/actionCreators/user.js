import {
  SET_USER,
  SET_USER_GROUPS,
  SET_GROUP_MEMBER_TASK,
  SET_GROUP_MEMBER_TASKGROUP,
  SET_GROUP_MEMBER_AGEGROUP,
  DELETE_GROUP_MEMBER_TASK,
  DELETE_GROUP_MEMBER_TASKGROUP,
  DELETE_GROUP_MEMBER_AGEGROUP,
} from 'redux/actionTypes'

export const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  }
}

export const setUserGroups = (groups) => {
  return {
    type: SET_USER_GROUPS,
    payload: groups,
  }
}

export const updateGroupMemberTask = (memberTask) => {
  return {
    type: SET_GROUP_MEMBER_TASK,
    payload: memberTask,
  }
}

export const updateGroupMemberTaskGroup = (memberTaskGroup) => {
  return {
    type: SET_GROUP_MEMBER_TASKGROUP,
    payload: memberTaskGroup,
  }
}

export const updateGroupMemberAgeGroup = (memberAgeGroup) => {
  return {
    type: SET_GROUP_MEMBER_AGEGROUP,
    payload: memberAgeGroup,
  }
}
export const deleteGroupMemberTask = (memberTask) => {
  return {
    type: DELETE_GROUP_MEMBER_TASK,
    payload: memberTask,
  }
}

export const deleteGroupMemberTaskGroup = (memberTaskGroup) => {
  return {
    type: DELETE_GROUP_MEMBER_TASKGROUP,
    payload: memberTaskGroup,
  }
}

export const deleteGroupMemberAgeGroup = (memberAgeGroup) => {
  return {
    type: DELETE_GROUP_MEMBER_AGEGROUP,
    payload: memberAgeGroup,
  }
}
