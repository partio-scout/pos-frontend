import { SET_ACTIVITY_GROUPS } from 'redux/actionTypes'

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
