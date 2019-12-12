import { SET_ITEMS_BY_GUID } from 'redux/actionTypes'

export const setItemsByGuid = items => {
  return {
    type: SET_ITEMS_BY_GUID,
    payload: items,
  }
}
