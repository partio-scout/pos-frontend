import {
  SET_ACTIVITY_GROUPS,
  SET_USER_ACTIVITY_GROUPS,
} from 'redux/actionTypes'

export const activityGroups = (state = {}, action) => {
  const itemsObj = {}
  switch (action.type) {
    case SET_ACTIVITY_GROUPS:
      action.payload.forEach((item) => {
        itemsObj[item.id] = item
      })
      return itemsObj
    default:
      return state
  }
}

export const userActivityGroups = (state = {}, action) => {
  switch (action.type) {
    case SET_USER_ACTIVITY_GROUPS:
      return action.payload.reduce((acc, curr) => {
        acc[curr.taskgroup_guid] = curr.completed
        return acc
      }, {})
    default:
      return state
  }
}
