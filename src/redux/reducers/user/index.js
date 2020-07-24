import {
  SET_USER,
  SET_USER_GROUPS,
  SET_GROUP_MEMBER_TASK,
  REMOVE_GROUP_MEMBER_TASK,
} from 'redux/actionTypes'
import { COMPLETION_STATUS } from '../../../consts'

const setTask = (user, taskData) => {
  const groupIndex = user.userGroups.findIndex(group => {
    return group.id === taskData.groupGuid
  })
  const memberIndex = user.userGroups[groupIndex].members.findIndex(
    member => member.memberId === taskData.user_guid
  )

  const tasks = user.userGroups[groupIndex].members[
    memberIndex
  ].memberTasks.slice(0)
  tasks.push({
    task_guid: taskData.task_guid,
    completion_status: taskData.completion_status,
  })

  const userGroups = user.userGroups.slice(0)
  const groupMembers = user.userGroups[groupIndex].members.slice(0)
  groupMembers[memberIndex].memberTasks = tasks
  userGroups[groupIndex].members = groupMembers

  return {
    ...user,
    userGroups,
  }
}

const removeTask = (user, taskData) => {
  const groupIndex = user.userGroups.findIndex(group => {
    return group.id === taskData.groupGuid
  })
  const memberIndex = user.userGroups[groupIndex].members.findIndex(
    member => member.memberId === taskData.user_guid
  )

  const tasks = user.userGroups[groupIndex].members[
    memberIndex
  ].memberTasks.slice(0)

  const completedTaskIndex = tasks.findIndex(
    task =>
      task.task_guid === taskData.task_guid &&
      task.completion_status === COMPLETION_STATUS.COMPLETED
  )
  const completionRequestedTaskIndex = tasks.findIndex(
    task =>
      task.task_guid === taskData.task_guid &&
      task.completion_status === COMPLETION_STATUS.COMPLETION_REQUESTED
  )

  if (completedTaskIndex >= 0) tasks.splice(completedTaskIndex, 1)
  if (completionRequestedTaskIndex >= 0)
    tasks.splice(completionRequestedTaskIndex, 1)

  const userGroups = user.userGroups.slice(0)
  const groupMembers = user.userGroups[groupIndex].members.slice(0)
  groupMembers[memberIndex].memberTasks = tasks
  userGroups[groupIndex].members = groupMembers

  return {
    ...user,
    userGroups,
  }
}

export const user = (state = {}, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        ...action.payload,
      }
    case SET_USER_GROUPS:
      return {
        ...state,
        userGroups: action.payload,
      }
    case SET_GROUP_MEMBER_TASK:
      return setTask(state, action.payload)
    case REMOVE_GROUP_MEMBER_TASK:
      return removeTask(state, action.payload)
    default:
      return state
  }
}
