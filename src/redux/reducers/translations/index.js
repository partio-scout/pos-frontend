import { SET_TRANSLATIONS } from 'redux/actionTypes'

export const translations = (state = [], action) => {
  switch (action.type) {
    case SET_TRANSLATIONS:
      return action.payload
    default:
      return state
  }
}
