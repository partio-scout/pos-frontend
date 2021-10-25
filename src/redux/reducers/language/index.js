import { SET_SELECTED_LANGUAGE } from 'redux/actionTypes'

export const selectedLanguage = (state = 'fi', action) => {
  switch (action.type) {
    case SET_SELECTED_LANGUAGE:
      return action.payload
    default:
      return state
  }
}
