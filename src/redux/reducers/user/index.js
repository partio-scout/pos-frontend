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

  items[data.task_guid] = data.completion_status || data.completed

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

const deleteItems = (user, data, itemtype, items) => {
  const groupIndex = user.userGroups.findIndex((group) => {
    return group.id === data.groupGuid
  })
  const memberIndex = user.userGroups[groupIndex].members.findIndex(
    (member) => member.memberId === data.user_guid
  )

  if (itemtype === 'tasks') {
    items = Object.keys(
      user.userGroups[groupIndex].members[memberIndex].memberTasks
    ).filter((item) => item !== data.task_guid)
  } else if (itemtype === 'taskGroups') {
    items = Object.keys(
      user.userGroups[groupIndex].members[memberIndex].memberTaskGroups
    ).filter((item) => item !== data.taskgroup_guid)
  } else {
    items = Object.keys(
      user.userGroups[groupIndex].members[memberIndex].memberAgeGroups
    ).filter((item) => item !== data.agegroup_guid)
  }

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
    case DELETE_GROUP_MEMBER_TASK:
      return deleteItems(state, action.payload, 'tasks')
    case DELETE_GROUP_MEMBER_TASKGROUP:
      return deleteItems(state, action.payload, 'taskGroups')
    case DELETE_GROUP_MEMBER_AGEGROUP:
      return deleteItems(state, action.payload, 'ageGroups')
    default:
      return state
  }
}
