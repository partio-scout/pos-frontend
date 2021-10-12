import { SET_ITEMS_BY_GUID } from 'redux/actionTypes'

// export const itemsByGuid = (state = [], action) => {
//   switch (action.type) {
//     case SET_ITEMS_BY_GUID:
//       return action.payload
//     default:
//       return state
//   }
// }

export const itemsByGuid = (state = {}, action) => {
  const itemsObject = { ...state }
  switch (action.type) {
    case SET_ITEMS_BY_GUID:
      action.payload.forEach((item) => {
        itemsObject[item.wp_guid] = item
      })
      return itemsObject
    default:
      return state
  }
}
