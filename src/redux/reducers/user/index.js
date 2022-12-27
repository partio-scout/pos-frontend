import {
  SET_USER,
  SET_USER_GROUPS,
  SET_GROUP_MEMBER_TASK,
  SET_GROUP_MEMBER_TASKGROUP,
  SET_GROUP_MEMBER_AGEGROUP,
} from 'redux/actionTypes'

const getItemGuid = (itemtype, data) => {
  switch (itemtype) {
    case 'tasks':
      return data.task_guid
    case 'taskGroups':
      return data.taskgroup_guid
    case 'ageGroups':
      return data.agegroup_guid
  }
}

const setItems = (user, data, itemtype, items) => {
  const groupIndex = user.userGroups.findIndex((group) => {
    return group.id === data.groupGuid
  })
  const memberIndex = user.userGroups[groupIndex].members.findIndex(
    (member) => member.memberId === data.user_guid
  )

  if (itemtype === 'tasks') {
    items = Object.assign(
      {},
      user.userGroups[groupIndex].members[memberIndex].memberTasks
    )
  } else if (itemtype === 'taskGroups') {
    items = Object.assign(
      {},
      user.userGroups[groupIndex].members[memberIndex].memberTaskGroups
    )
  } else {
    items = Object.assign(
      {},
      user.userGroups[groupIndex].members[memberIndex].memberAgeGroups
    )
  }
  items[getItemGuid(itemtype, data)] = data.completion_status || data.completed

  const userGroups = user.userGroups.slice(0)
  const groupMembers = user.userGroups[groupIndex].members.slice(0)

  if (itemtype === 'tasks') {
    groupMembers[memberIndex].memberTasks = items
  } else if (itemtype === 'taskGroups') {
    groupMembers[memberIndex].memberTaskGroups = items
  } else {
    groupMembers[memberIndex].memberAgeGroups = items
  }
  userGroups[groupIndex].members = groupMembers
  return {
    ...user,
    userGroups,
  }
}

export const user = (state = {}, action) => {
  switch (action.type) {
    case SET_USER:
      action.payload.canMarkDone = true
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
      return setItems(state, action.payload, 'tasks')
    case SET_GROUP_MEMBER_TASKGROUP:
      return setItems(state, action.payload, 'taskGroups')
    case SET_GROUP_MEMBER_AGEGROUP:
      return setItems(state, action.payload, 'ageGroups')
    default:
      return state
  }
}
