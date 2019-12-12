import { SET_ITEMS_BY_GUID } from 'redux/actionTypes'

export const itemsByGuid = (state = [], action) => {
  switch (action.type) {
    case SET_ITEMS_BY_GUID:
      return action.payload
    default:
      return state
  }
}
