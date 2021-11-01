import { SET_SELECTED_LANGUAGE } from 'redux/actionTypes'

export const setSelectedLanguage = (language) => {
  return {
    type: SET_SELECTED_LANGUAGE,
    payload: language,
  }
}
